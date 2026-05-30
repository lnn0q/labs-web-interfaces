import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const res = await api.get('auth/profile/');
        setUser(res.data);
      }
    } catch (e) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await api.post('auth/login/', { email, password });
    await AsyncStorage.setItem('accessToken', res.data.access);
    await AsyncStorage.setItem('refreshToken', res.data.refresh);
    const profileRes = await api.get('auth/profile/');
    setUser(profileRes.data);
    return profileRes.data;
  };

  const registerUser = async (data) => {
    const res = await api.post('auth/register/', data);
    return res.data;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const isFormData = data instanceof FormData;
    const res = await api.patch('auth/profile/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout, updateProfile, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
