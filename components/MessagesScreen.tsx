import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MessageCircle, Send } from 'lucide-react-native';

// Placeholder for full messaging with photo/video (use your backend /message routes + Socket.io)
export default function MessagesScreen() {
  return (
    <View className="flex-1 bg-gray-950 p-4">
      <Text className="text-white text-3xl font-bold mb-4">Messagerie</Text>
      <Text className="text-gray-400 mb-6">Chat en temps réel avec photos/vidéos • Connecté à alxia.fr</Text>

      <ScrollView className="flex-1 mb-4">
        {/* Example messages */}
        <View className="bg-gray-900 p-4 rounded-2xl mb-3">
          <Text className="text-white">Créatrice: Salut ! Comment ça va ?</Text>
        </View>
        <View className="bg-rose-600/20 p-4 rounded-2xl mb-3 self-end max-w-[80%]">
          <Text className="text-white">Super ! J'adore ton contenu 🔥</Text>
        </View>
      </ScrollView>

      <View className="flex-row items-center bg-gray-900 rounded-2xl p-2">
        <TouchableOpacity className="p-3">
          <MessageCircle color="#f43f5e" size={22} />
        </TouchableOpacity>
        <Text className="flex-1 text-gray-400 px-3">Envoyer un message, photo ou vidéo...</Text>
        <TouchableOpacity className="bg-rose-600 p-3 rounded-xl">
          <Send color="white" size={20} />
        </TouchableOpacity>
      </View>

      <Text className="text-xs text-gray-500 text-center mt-4">Fonctionnalité complète à connecter avec Socket.io du backend</Text>
    </View>
  );
}
