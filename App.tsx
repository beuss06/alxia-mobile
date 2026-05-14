import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Plus, User, MessageCircle, BarChart3 } from 'lucide-react-native';
import CreatorUploadScreen from './components/CreatorUploadScreen';
import CreatorDashboard from './components/CreatorDashboard';
import LoginScreen from './components/LoginScreen';
import MessagesScreen from './components/MessagesScreen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function CreatorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Créer du contenu" component={CreatorUploadScreen} />
      <Stack.Screen name="Dashboard Créatrice" component={CreatorDashboard} />
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f43f5e',
        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#374151' },
        headerShown: false,
      }}
    >
      <Tab.Screen name="Accueil" component={() => <></>} options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tab.Screen name="Créer" component={CreatorStack} options={{ tabBarIcon: ({ color, size }) => <Plus color={color} size={size} /> }} />
      <Tab.Screen name="Dashboard" component={CreatorDashboard} options={{ tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} /> }} />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }} />
      <Tab.Screen name="Profil" component={() => <></>} options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) setIsLoggedIn(true);
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  if (checkingAuth) return <></>;

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="light" />
        {isLoggedIn ? <MainApp /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
