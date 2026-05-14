import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Plus, User, MessageCircle } from 'lucide-react-native';
import CreatorUploadScreen from './components/CreatorUploadScreen';
import { StatusBar } from 'expo-status-bar';

// Simple screens placeholders
const HomeScreen = () => <></>;
const MessagesScreen = () => <></>;
const ProfileScreen = () => <></>;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CreatorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreatorUpload" component={CreatorUploadScreen} options={{ title: 'Créer du contenu' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#E11D48', // Rose OnlyFans-like
          tabBarStyle: { backgroundColor: '#111827' },
        }}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} /> }} />
        <Tab.Screen name="Créer" component={CreatorStack} options={{ tabBarIcon: ({ color }) => <Plus color={color} /> }} />
        <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarIcon: ({ color }) => <MessageCircle color={color} /> }} />
        <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <User color={color} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}