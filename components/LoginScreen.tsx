import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { login as apiLogin, getCurrentUser } from '../lib/api';

interface Props {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('alexia@alexia.com');
  const [password, setPassword] = useState('Alexia123!');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Email et mot de passe requis');
      return;
    }
    setLoading(true);
    try {
      await apiLogin(email, password);
      await getCurrentUser();
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error?.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-950 justify-center p-6">
      <Text className="text-white text-4xl font-bold mb-2 text-center">Alxia</Text>
      <Text className="text-rose-400 text-center mb-10">OnlyFans français gratuit pour créatrices</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#6b7280"
        className="bg-gray-900 text-white p-4 rounded-2xl mb-4"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        placeholderTextColor="#6b7280"
        className="bg-gray-900 text-white p-4 rounded-2xl mb-8"
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-rose-600 py-4 rounded-2xl items-center"
      >
        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-bold">Se connecter</Text>}
      </TouchableOpacity>

      <Text className="text-gray-500 text-center text-xs mt-8">Comptes de test : alexia@alexia.com / Alexia123!</Text>
    </View>
  );
}
