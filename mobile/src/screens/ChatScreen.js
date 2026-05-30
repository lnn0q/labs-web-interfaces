import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../api/api';

const ChatScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // 1. Отримати список кімнат для фандому (беремо першу)
    const initChat = async () => {
      try {
        const roomsRes = await api.get(`chats/rooms/?fandom=${slug}`);
        if (roomsRes.data && roomsRes.data.length > 0) {
          const mainRoom = roomsRes.data[0];
          setRoom(mainRoom);
          navigation.setOptions({ title: `Чат: ${mainRoom.fandom_name}` });
          
          // 2. Завантажити історію
          const msgRes = await api.get(`chats/rooms/${mainRoom.id}/messages/`);
          setMessages(msgRes.data);
          
          // 3. Підключити WebSocket
          connectWebSocket(mainRoom.id);
        } else {
          Alert.alert('Помилка', 'Кімнату чату не знайдено');
          navigation.goBack();
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Помилка', 'Не вдалося завантажити чат');
      }
      setLoading(false);
    };

    initChat();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [slug]);

  const connectWebSocket = async (roomId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      // Замінюємо http:// на ws://
      const wsUrl = API_BASE_URL.replace('http', 'ws') + `/ws/chat/${roomId}/?token=${token}`;
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          setMessages((prev) => [...prev, data.message]);
        }
      };

      ws.current.onerror = (error) => {
        console.log('WebSocket Error', error);
      };
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    
    ws.current.send(JSON.stringify({
      message: inputText.trim()
    }));
    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = user && item.author.id === user.id;
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
        {!isMe && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.author.name.charAt(0)}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {!isMe && <Text style={styles.authorName}>{item.author.name}</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Написати повідомлення..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  list: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  theirMessageWrapper: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#FF6B00',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#2A2A2A',
    borderBottomLeftRadius: 4,
  },
  authorName: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 20,
  },
  timeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    minHeight: 40,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendBtnDisabled: {
    backgroundColor: '#444',
  },
  sendText: {
    color: '#FFF',
    fontSize: 18,
  }
});

export default ChatScreen;
