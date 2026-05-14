import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import Slider from 'react-native-slider'; // or @react-native-community/slider
import { Plus, Trash2, Play, Pause, Scissors, Palette } from 'lucide-react-native';

// Types
interface MediaItem {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
  filter?: string; // e.g. 'vintage', 'bw', etc.
}

// Simple filter presets
const FILTER_PRESETS = [
  { id: 'normal', label: 'Normal', style: {} },
  { id: 'vintage', label: 'Vintage', style: { opacity: 0.9 } }, // Extend with real filters
  { id: 'bw', label: 'Noir & Blanc', style: { /* grayscale via Skia or native */ } },
  { id: 'warm', label: 'Chaud', style: {} },
];

export default function CreatorUploadScreen() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const selectedMedia = mediaItems.find(m => m.id === selectedId);

  // Multi select photos & videos
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
      videoMaxDuration: 300, // 5 min max
    });

    if (!result.canceled && result.assets) {
      const newItems: MediaItem[] = result.assets.map((asset, index) => ({
        id: Date.now() + '-' + index,
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'photo',
        duration: asset.duration ? asset.duration / 1000 : undefined,
        trimStart: 0,
        trimEnd: asset.duration ? asset.duration / 1000 : undefined,
      }));
      setMediaItems(prev => [...prev, ...newItems]);
      if (!selectedId && newItems.length > 0) setSelectedId(newItems[0].id);
    }
  };

  // Apply trim to selected video
  const updateTrim = (start: number, end: number) => {
    if (!selectedMedia || selectedMedia.type !== 'video') return;
    setMediaItems(prev => prev.map(item => 
      item.id === selectedId 
        ? { ...item, trimStart: Math.max(0, start), trimEnd: Math.min(item.duration || 0, end) } 
        : item
    ));
  };

  // Apply filter preset
  const applyFilter = (filterId: string) => {
    if (!selectedId) return;
    setMediaItems(prev => prev.map(item => 
      item.id === selectedId ? { ...item, filter: filterId } : item
    ));
    // TODO: Apply real filter preview with Skia or expo-image-manipulator
    Alert.alert('Filtre appliqué', `Preset: ${filterId}. (Preview live avec Skia dans version complète)`);
  };

  // Remove media
  const removeMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) {
      const remaining = mediaItems.filter(m => m.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Upload to backend (placeholder - connect to your /api/posts or media endpoint)
  const handleUpload = async () => {
    if (mediaItems.length === 0) {
      Alert.alert('Erreur', 'Ajoute au moins un média');
      return;
    }
    setIsUploading(true);
    try {
      // Example: Prepare FormData with trim/filter metadata
      const formData = new FormData();
      mediaItems.forEach((item, idx) => {
        formData.append('media[]', {
          uri: item.uri,
          name: `media_${idx}.${item.type === 'video' ? 'mp4' : 'jpg'}`,
          type: item.type === 'video' ? 'video/mp4' : 'image/jpeg',
        } as any);
        if (item.type === 'video') {
          formData.append(`trim_${idx}`, JSON.stringify({ start: item.trimStart, end: item.trimEnd }));
        }
        if (item.filter) {
          formData.append(`filter_${idx}`, item.filter);
        }
      });
      formData.append('caption', caption);
      formData.append('isLocked', 'true'); // or from UI

      // TODO: Replace with your actual API call + auth token
      // await api.post('/api/creator/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      Alert.alert('Succès', `${mediaItems.length} médias uploadés avec succès ! (Connecte à ton backend alxia.fr)`);
      setMediaItems([]);
      setSelectedId(null);
      setCaption('');
    } catch (e) {
      Alert.alert('Erreur upload', 'Vérifie ta connexion au backend');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-950 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-white text-3xl font-bold mb-2">Créer du contenu</Text>
      <Text className="text-gray-400 mb-6">Outils pro pour créatrices • Alxia (gratuit)</Text>

      {/* Add Media Button */}
      <TouchableOpacity 
        onPress={pickMedia}
        className="bg-rose-600 py-4 rounded-2xl flex-row items-center justify-center mb-6 active:opacity-80"
      >
        <Plus color="white" size={24} />
        <Text className="text-white text-lg font-semibold ml-2">Ajouter photos/vidéos (multiple)</Text>
      </TouchableOpacity>

      {/* Media Grid Preview */}
      {mediaItems.length > 0 && (
        <View className="mb-6">
          <Text className="text-white text-lg mb-3">Médias sélectionnés ({mediaItems.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {mediaItems.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                className={`mr-3 rounded-xl overflow-hidden border-2 ${selectedId === item.id ? 'border-rose-500' : 'border-gray-700'}`}
              >
                {item.type === 'photo' ? (
                  <Image source={{ uri: item.uri }} style={{ width: 120, height: 120 }} />
                ) : (
                  <View style={{ width: 120, height: 120, backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }}>
                    <Play color="#fff" size={40} />
                    <Text className="text-white text-xs mt-1">Vidéo</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => removeMedia(item.id)} className="absolute top-1 right-1 bg-black/70 p-1 rounded-full">
                  <Trash2 color="#fff" size={16} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Editor for Selected Media */}
      {selectedMedia && (
        <View className="bg-gray-900 rounded-3xl p-5 mb-6">
          <Text className="text-white text-xl font-semibold mb-4">
            Édition : {selectedMedia.type === 'video' ? 'Vidéo' : 'Photo'}
          </Text>

          {/* Preview */}
          <View className="mb-5 rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: 16/9 }}>
            {selectedMedia.type === 'photo' ? (
              <Image 
                source={{ uri: selectedMedia.uri }} 
                style={{ flex: 1 }} 
                resizeMode="cover" 
              />
            ) : (
              <Video
                source={{ uri: selectedMedia.uri }}
                style={{ flex: 1 }}
                useNativeControls
                resizeMode="contain"
                // TODO: Apply trimStart/trimEnd with shouldPlay logic or seek
              />
            )}
          </View>

          {/* Video Trim Controls */}
          {selectedMedia.type === 'video' && selectedMedia.duration && (
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Scissors color="#f43f5e" size={20} />
                <Text className="text-white ml-2 font-medium">Découper la vidéo</Text>
              </View>
              <Text className="text-gray-400 text-sm mb-3">
                Start: {selectedMedia.trimStart?.toFixed(1)}s — End: {selectedMedia.trimEnd?.toFixed(1)}s
              </Text>
              
              <Slider
                minimumValue={0}
                maximumValue={selectedMedia.duration}
                value={selectedMedia.trimStart || 0}
                onValueChange={(val) => updateTrim(val, selectedMedia.trimEnd || selectedMedia.duration)}
                minimumTrackTintColor="#f43f5e"
                maximumTrackTintColor="#374151"
                thumbTintColor="#fff"
              />
              <Slider
                minimumValue={0}
                maximumValue={selectedMedia.duration}
                value={selectedMedia.trimEnd || selectedMedia.duration}
                onValueChange={(val) => updateTrim(selectedMedia.trimStart || 0, val)}
                minimumTrackTintColor="#f43f5e"
                maximumTrackTintColor="#374151"
                thumbTintColor="#fff"
              />
              <Text className="text-xs text-gray-500 mt-1">Glisse les curseurs pour découper (preview à implémenter avec seek)</Text>
            </View>
          )}

          {/* Filters */}
          <View>
            <View className="flex-row items-center mb-3">
              <Palette color="#f43f5e" size={20} />
              <Text className="text-white ml-2 font-medium">Appliquer un filtre</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {FILTER_PRESETS.map(preset => (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => applyFilter(preset.id)}
                  className={`px-4 py-2 rounded-full ${selectedMedia.filter === preset.id ? 'bg-rose-600' : 'bg-gray-800'}`}
                >
                  <Text className="text-white text-sm">{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-xs text-gray-500 mt-2">Filtres preview en temps réel avec React Native Skia (recommandé)</Text>
          </View>
        </View>
      )}

      {/* Caption & Publish */}
      {mediaItems.length > 0 && (
        <View className="mb-6">
          <Text className="text-white mb-2">Légende / Description</Text>
          <TextInput // Assume import TextInput from react-native
            value={caption}
            onChangeText={setCaption}
            placeholder="Ajoute une légende..."
            placeholderTextColor="#6b7280"
            className="bg-gray-900 text-white p-4 rounded-2xl mb-4"
            multiline
          />
          
          <TouchableOpacity
            onPress={handleUpload}
            disabled={isUploading}
            className="bg-white py-4 rounded-2xl items-center flex-row justify-center active:bg-gray-200"
          >
            {isUploading ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text className="text-gray-900 text-lg font-bold">Publier sur Alxia</Text>
            )}
          </TouchableOpacity>
          <Text className="text-center text-gray-500 text-xs mt-3">Gratuit • Pas de frais de plateforme pour les créatrices</Text>
        </View>
      )}
    </ScrollView>
  );
}

// Note: Add import TextInput from 'react-native' at top if using.