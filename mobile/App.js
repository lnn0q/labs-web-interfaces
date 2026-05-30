import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FandomScreen from './src/screens/FandomScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PostScreen from './src/screens/PostScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#1E1E1E' },
  headerTitleStyle: { color: '#FFF' },
  headerTintColor: '#FF6B00',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      ...globalScreenOptions,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'ProfileTab') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarStyle: {
        backgroundColor: '#1E1E1E',
        borderTopColor: 'rgba(255,255,255,0.05)',
      },
      tabBarActiveTintColor: '#FF6B00',
      tabBarInactiveTintColor: '#888',
    })}
  >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeScreen} 
      options={{ title: 'Фандоми', headerShown: false }} 
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileScreen} 
      options={{ title: 'Профіль' }} 
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{ colors: { background: '#121212' } }}>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen 
              name="Fandom" 
              component={FandomScreen} 
              options={{ title: 'Фандом' }} 
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={{ title: 'Чат' }} 
            />
            <Stack.Screen 
              name="Post" 
              component={PostScreen} 
              options={{ title: 'Обговорення' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
