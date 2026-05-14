import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { login as apiLogin } from '../lib/api';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('alexia@alexia.com'); // Test account from seed
  const [password, setPassword] = useState('Alexia123!');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Email et mot de passe requis');
      return;
    }
    setLoading(true);
    try {
      await apiLogin(email, password);
      Alert.alert('Connexion réussie', 'Bienvenue sur Alxia !');
      // Navigation will be handled by parent auth state in real app
      navigation.navigate('Créer'); // or reset to main tabs
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error?.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-950 justify-center p-6">
      <Text className="text-white text-4xl font-bold mb-2 text-center">Alxia</Text>
      <Text className="text-rose-400 text-center mb-10">OnlyFans français gratuit</Text>

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
        className="bg-gray-900 text-white p-4 rounded-2xl mb-6"
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-rose-600 py-4 rounded-2xl items-center mb-4"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">Se connecter</Text>
        )}
      </TouchableOpacity>

      <Text className="text-gray-400 text-center text-sm">
        Comptes test : alexia@alexia.com / Alexia123! (Créatrice)
      </Text>
    </View>
  );
}
