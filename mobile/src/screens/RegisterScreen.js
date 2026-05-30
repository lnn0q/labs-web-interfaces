import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'other',
    date_of_birth: ''
  });
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.date_of_birth.trim()) {
      Alert.alert('Помилка', 'Заповніть всі обов\'язкові поля');
      return;
    }
    
    // Перевірка формату дати (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.date_of_birth)) {
      Alert.alert('Помилка', 'Формат дати народження має бути YYYY-MM-DD');
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      Alert.alert('Успіх', 'Реєстрація успішна! Тепер ви можете увійти.');
      navigation.navigate('Login');
    } catch (e) {
      console.error(e.response?.data || e.message);
      Alert.alert('Помилка реєстрації', 'Перевірте введені дані');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Реєстрація у Takibi</Text>

          <TextInput
            style={styles.input}
            placeholder="Ім'я"
            placeholderTextColor="#888"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#888"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
          />
          
          <Text style={styles.label}>Стать:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setFormData({...formData, gender: itemValue})}
              items={[
                { label: 'Чоловіча', value: 'male' },
                { label: 'Жіноча', value: 'female' },
                { label: 'Інша', value: 'other' },
              ]}
              value={formData.gender}
              placeholder={{ label: 'Оберіть стать...', value: null }}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: { color: '#888' },
              }}
            />
          </View>

          <Text style={styles.label}>Дата народження (РРРР-ММ-ДД):</Text>
          <TextInput
            style={styles.input}
            placeholder="Наприклад: 2000-01-25"
            placeholderTextColor="#888"
            value={formData.date_of_birth}
            onChangeText={(text) => setFormData({...formData, date_of_birth: text})}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Зареєструватися</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Вже маєте акаунт? <Text style={styles.linkAccent}>Увійти</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: 'rgba(30,30,30,0.95)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 14,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pickerInput: {
    color: '#FFF',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 14,
  },
  linkAccent: {
    color: '#FFD700',
    fontWeight: '600',
  },
});

export default RegisterScreen;
