import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/api';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ bio });
      setEditing(false);
      Alert.alert('Успіх', 'Профіль оновлено');
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося оновити профіль');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert('Вихід', 'Ви дійсно хочете вийти?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Вийти', style: 'destructive', onPress: logout }
    ]);
  };

  const handlePickAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Помилка", "Потрібен доступ до галереї для завантаження аватарки.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadAvatar(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Помилка", "Не вдалося відкрити галерею");
    }
  };

  const uploadAvatar = async (uri) => {
    try {
      setLoading(true);
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append('avatar', { uri, name: filename || 'avatar.jpg', type });

      await updateProfile(formData);
      Alert.alert('Успіх', 'Аватарку оновлено!');
    } catch (e) {
      console.error(e);
      Alert.alert('Помилка', 'Не вдалося оновити аватарку');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickAvatar} disabled={loading}>
          {user.avatar ? (
            <Image source={{ uri: getImageUrl(user.avatar) }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
          )}
          {loading && (
            <View style={styles.avatarLoadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
          <View style={styles.editIconBadge}>
            <Text style={styles.editIconText}>✎</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user.is_staff ? 'Адміністратор' : 'Користувач'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Про мене</Text>
          <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
            {loading ? (
              <ActivityIndicator size="small" color="#FF6B00" />
            ) : (
              <Text style={styles.editBtn}>{editing ? 'Зберегти' : 'Редагувати'}</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {editing ? (
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            multiline
            placeholder="Розкажіть трохи про себе..."
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.bioText}>
            {user.bio || 'Інформація відсутня. Розкажіть щось про себе!'}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Додаткова інформація</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Стать:</Text>
          <Text style={styles.infoValue}>
            {user.gender === 'male' ? 'Чоловіча' : user.gender === 'female' ? 'Жіноча' : 'Інша'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Дата народження:</Text>
          <Text style={styles.infoValue}>{user.date_of_birth || 'Не вказано'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Дата реєстрації:</Text>
          <Text style={styles.infoValue}>
            {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Сьогодні'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Вийти з акаунта</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#1E1E1E',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    backgroundColor: '#FF6B00',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
  editIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarText: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  badgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  editBtn: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bioText: {
    color: '#DDD',
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: {
    color: '#888',
    fontSize: 15,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,59,48,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.3)',
    marginTop: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProfileScreen;
