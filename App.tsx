import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import CreatorUploadScreen from './components/CreatorUploadScreen';
import CreatorDashboard from './components/CreatorDashboard';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import MessagesScreen from './components/MessagesScreen';
import ProfileScreen from './components/ProfileScreen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { clearToken } from './lib/api';
import { DiscreetModeProvider, useDiscreetMode } from './lib/discreetMode';
import DiscreetCalculator from './components/DiscreetCalculator';

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

interface MainAppProps {
  onLogout: () => void;
}

function MainApp({ onLogout }: MainAppProps) {
  function ProfileWrapper() {
    return <ProfileScreen onLogout={onLogout} />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f43f5e',
        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#374151' },
        headerShown: false,
      }}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tab.Screen name="Créer" component={CreatorStack} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} /> }} />
      <Tab.Screen name="Dashboard" component={CreatorDashboard} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} /> }} />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} /> }} />
      <Tab.Screen name="Profil" component={ProfileWrapper} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

function AppShell({ isLoggedIn, onLoginSuccess, onLogout }: { isLoggedIn: boolean; onLoginSuccess: () => void; onLogout: () => void }) {
  const { isActive } = useDiscreetMode();
  if (isActive) return <DiscreetCalculator />;
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {isLoggedIn ? <MainApp onLogout={onLogout} /> : <LoginScreen onLoginSuccess={onLoginSuccess} />}
    </NavigationContainer>
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

  const handleLogout = async () => {
    await clearToken();
    setIsLoggedIn(false);
  };

  if (checkingAuth) return <></>;

  return (
    <QueryClientProvider client={queryClient}>
      <DiscreetModeProvider>
        <AppShell isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
      </DiscreetModeProvider>
    </QueryClientProvider>
  );
}
