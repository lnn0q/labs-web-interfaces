import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Image
} from 'react-native';
import api, { getImageUrl } from '../api/api';
import { useAuth } from '../context/AuthContext';

const PostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        api.get(`posts/${postId}/`),
        api.get(`posts/${postId}/comments/`)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Помилка', 'Не вдалося завантажити пост');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      await api.post(`posts/${postId}/like/`);
      // Update local state
      setPost(prev => ({
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`posts/${postId}/comments/`, {
        text: commentText.trim()
      });
      setComments(prev => [...prev, res.data]);
      setCommentText('');
      // Update post comment count
      setPost(prev => ({ ...prev, comments_count: prev.comments_count + 1 }));
    } catch (e) {
      console.error(e);
      Alert.alert('Помилка', 'Не вдалося додати коментар');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        {item.author?.avatar ? (
          <Image source={{ uri: getImageUrl(item.author.avatar) }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.author?.name?.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.commentAuthor}>{item.author?.name}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  const renderHeader = () => {
    if (!post) return null;
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          {post.author?.avatar ? (
            <Image source={{ uri: getImageUrl(post.author.avatar) }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{post.author?.name?.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.postAuthor}>{post.author?.name}</Text>
            <Text style={styles.postTime}>
              {new Date(post.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
        
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Text style={[styles.actionIcon, post.is_liked && styles.likedIcon]}>
              {post.is_liked ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.actionText, post.is_liked && styles.likedText]}>
              {post.likes_count}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{post.comments_count}</Text>
          </View>
        </View>
        
        <Text style={styles.commentsSectionTitle}>Коментарі</Text>
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
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderComment}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Написати коментар..."
          placeholderTextColor="#888"
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, (!commentText.trim() || submitting) && styles.sendBtnDisabled]}
          onPress={handleAddComment}
          disabled={!commentText.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendText}>➤</Text>
          )}
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
  },
  postCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postAuthor: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  postTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionText: {
    color: '#888',
    fontSize: 14,
  },
  likedIcon: {
    color: '#FF4B4B',
  },
  likedText: {
    color: '#FF4B4B',
    fontWeight: 'bold',
  },
  commentsSectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  commentCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  commentTime: {
    color: '#888',
    fontSize: 11,
  },
  commentText: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 52,
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
  },
});

export default PostScreen;
