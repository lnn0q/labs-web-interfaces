import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import api, { getImageUrl } from '../api/api';
import { useAuth } from '../context/AuthContext';

const FandomScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const { user } = useAuth();
  
  const [fandom, setFandom] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const fetchData = async () => {
    try {
      const fandomRes = await api.get(`fandoms/${slug}/`);
      setFandom(fandomRes.data);
      
      const postsRes = await api.get(`posts/?fandom=${slug}`);
      setPosts(postsRes.data);

      const mineRes = await api.get('fandoms/mine/');
      const myFandoms = mineRes.data;
      setIsMember(myFandoms.some(f => f.slug === slug));
    } catch (e) {
      console.error(e);
      Alert.alert('Помилка', 'Не вдалося завантажити дані фандому');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleMembership = async () => {
    try {
      if (isMember) {
        await api.post(`fandoms/${slug}/leave/`);
        setIsMember(false);
      } else {
        await api.post(`fandoms/${slug}/join/`);
        setIsMember(true);
      }
      fetchData(); // Оновити учасників
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося змінити статус участі');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await api.post(`posts/${postId}/like/`);
      // Оновити локальний стан лайків
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = !post.is_liked;
            return {
              ...post,
              is_liked: isLiked,
              likes_count: isLiked ? post.likes_count + 1 : post.likes_count - 1
            };
          }
          return post;
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postCard} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Post', { postId: item.id })}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorAvatar}>
          <Text style={styles.avatarText}>{item.author.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.authorName}>{item.author.name}</Text>
          <Text style={styles.postDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => handleLikePost(item.id)}
        >
          <Text style={[styles.actionIcon, item.is_liked && styles.likedIcon]}>
            {item.is_liked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, item.is_liked && styles.likedText]}>
            {item.likes_count || 0}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments_count || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    if (!fandom) return null;
    return (
      <View style={styles.headerContainer}>
        <Image source={{ uri: getImageUrl(fandom.image_url) }} style={styles.coverImage} />
        <View style={styles.fandomInfo}>
          <Text style={styles.fandomName}>{fandom.name}</Text>
          <Text style={styles.fandomCategory}>{fandom.category.toUpperCase()}</Text>
          <Text style={styles.fandomDesc}>{fandom.description}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.btn, isMember ? styles.btnLeave : styles.btnJoin]} 
              onPress={toggleMembership}
            >
              <Text style={styles.btnText}>{isMember ? 'Вийти' : 'Приєднатись'}</Text>
            </TouchableOpacity>
            
            {isMember && (
              <TouchableOpacity 
                style={[styles.btn, styles.btnChat]} 
                onPress={() => navigation.navigate('Chat', { slug })}
              >
                <Text style={styles.btnText}>Чат</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.sectionTitle}>Публікації</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Немає публікацій. Будьте першим!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  fandomInfo: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  fandomName: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fandomCategory: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fandomDesc: {
    color: '#AAA',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnJoin: {
    backgroundColor: '#FF6B00',
  },
  btnLeave: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  btnChat: {
    backgroundColor: '#4CAF50',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  postCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  authorName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postDate: {
    color: '#888',
    fontSize: 12,
  },
  postTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    color: '#DDD',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  actionText: {
    color: '#AAA',
    fontSize: 14,
  },
  likedIcon: {
    color: '#FF4B4B',
  },
  likedText: {
    color: '#FF4B4B',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});

export default FandomScreen;
