import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Slider from 'react-native-slider';
import { Plus, Trash2, Play, Scissors, Palette, Upload } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../lib/api';

interface MediaItem {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
  filter?: string;
  thumbnail?: string;
}

const FILTER_PRESETS = [
  { id: 'normal', label: 'Normal' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'bw', label: 'Noir & Blanc' },
  { id: 'warm', label: 'Chaud' },
  { id: 'cool', label: 'Froid' },
];

export default function CreatorUploadScreen() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const queryClient = useQueryClient();

  const selectedMedia = mediaItems.find(m => m.id === selectedId);

  const generateThumbnail = async (videoUri: string): Promise<string | undefined> => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 1000, quality: 0.6 });
      return uri;
    } catch { return undefined; }
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
      videoMaxDuration: 300,
    });

    if (!result.canceled && result.assets) {
      const newItems: MediaItem[] = [];
      for (const asset of result.assets) {
        const item: MediaItem = {
          id: Date.now() + '-' + Math.random(),
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'photo',
          duration: asset.duration ? asset.duration / 1000 : undefined,
          trimStart: 0,
          trimEnd: asset.duration ? asset.duration / 1000 : undefined,
        };
        if (item.type === 'video') item.thumbnail = await generateThumbnail(asset.uri);
        newItems.push(item);
      }
      setMediaItems(prev => [...prev, ...newItems]);
      if (!selectedId && newItems.length > 0) setSelectedId(newItems[0].id);
    }
  };

  const updateTrim = (start: number, end: number) => {
    if (!selectedMedia || selectedMedia.type !== 'video' || !selectedId) return;
    setMediaItems(prev => prev.map(item => item.id === selectedId ? { ...item, trimStart: Math.max(0, Math.min(start, end)), trimEnd: Math.min(item.duration || 9999, Math.max(end, start)) } : item));
  };

  const applyFilter = (filterId: string) => {
    if (!selectedId) return;
    setMediaItems(prev => prev.map(item => item.id === selectedId ? { ...item, filter: filterId } : item));
    Alert.alert('Filtre appliqué', filterId);
  };

  const removeMedia = (id: string) => {
    const newItems = mediaItems.filter(item => item.id !== id);
    setMediaItems(newItems);
    if (selectedId === id) setSelectedId(newItems.length > 0 ? newItems[0].id : null);
  };

  const uploadMutation = useMutation({ mutationFn: createPost, onSuccess: () => { Alert.alert('Succès', 'Publié !'); setMediaItems([]); setSelectedId(null); setCaption(''); queryClient.invalidateQueries({ queryKey: ['creatorPosts'] }); }, onError: (e: any) => Alert.alert('Erreur', e?.response?.data?.message || 'Échec') });

  const handleUpload = async () => {
    if (mediaItems.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    mediaItems.forEach((item, idx) => {
      formData.append('files', { uri: item.uri, name: `media_${idx}.${item.type === 'video' ? 'mp4' : 'jpg'}`, type: item.type === 'video' ? 'video/mp4' : 'image/jpeg' } as any);
      if (item.type === 'video') { formData.append(`trimStart_${idx}`, String(item.trimStart || 0)); formData.append(`trimEnd_${idx}`, String(item.trimEnd || item.duration || 0)); }
      if (item.filter) formData.append(`filter_${idx}`, item.filter);
    });
    formData.append('caption', caption || ''); formData.append('isLocked', 'true');
    uploadMutation.mutate(formData); setIsUploading(false);
  };

  return (
    <ScrollView className="flex-1 bg-gray-950 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="text-white text-3xl font-bold mb-1">Créer du contenu</Text>
      <Text className="text-rose-400 mb-6">Performances vidéo optimisées</Text>

      <TouchableOpacity onPress={pickMedia} className="bg-rose-600 py-4 rounded-2xl flex-row justify-center items-center mb-6">
        <Plus color="white" size={22} /><Text className="text-white text-lg font-semibold ml-3">Ajouter médias</Text>
      </TouchableOpacity>

      {mediaItems.length > 0 && <View className="mb-6"><Text className="text-white mb-3">Médias ({mediaItems.length}) — Miniatures générées</Text><ScrollView horizontal>{mediaItems.map(item => (<TouchableOpacity key={item.id} onPress={() => setSelectedId(item.id)} className={`mr-3 rounded-2xl overflow-hidden border-2 ${selectedId === item.id ? 'border-rose-500' : 'border-gray-700'}`}>{item.type === 'photo' ? <Image source={{uri: item.uri}} style={{width:110,height:110}} /> : item.thumbnail ? <Image source={{uri: item.thumbnail}} style={{width:110,height:110}} /> : <View style={{width:110,height:110,backgroundColor:'#1f2937',alignItems:'center',justifyContent:'center'}}><Play color="#f43f5e" size={36}/></View>}<TouchableOpacity onPress={() => removeMedia(item.id)} className="absolute top-1 right-1 bg-black/70 p-1.5 rounded-full"><Trash2 color="#fff" size={15}/></TouchableOpacity></TouchableOpacity>))}</ScrollView></View>}

      {selectedMedia && <View className="bg-gray-900 rounded-3xl p-5 mb-6"><Text className="text-white text-xl mb-4">Édition</Text><View style={{aspectRatio:16/9}} className="mb-5 rounded-2xl overflow-hidden bg-black">{selectedMedia.type === 'photo' ? <Image source={{uri:selectedMedia.uri}} style={{flex:1}} resizeMode="cover" /> : <Video source={{uri:selectedMedia.uri}} style={{flex:1}} useNativeControls resizeMode="contain" />}</View>{selectedMedia.type === 'video' && selectedMedia.duration && <View className="mb-6"><Text className="text-white mb-2">Découper vidéo</Text><Slider minimumValue={0} maximumValue={selectedMedia.duration} value={selectedMedia.trimStart||0} onValueChange={v => updateTrim(v, selectedMedia.trimEnd||selectedMedia.duration)} minimumTrackTintColor="#f43f5e" thumbTintColor="#fff" /><Slider minimumValue={0} maximumValue={selectedMedia.duration} value={selectedMedia.trimEnd||selectedMedia.duration} onValueChange={v => updateTrim(selectedMedia.trimStart||0, v)} minimumTrackTintColor="#f43f5e" thumbTintColor="#fff" /></View>}<View><Text className="text-white mb-2">Filtres</Text><View className="flex-row flex-wrap gap-2">{FILTER_PRESETS.map(p => <TouchableOpacity key={p.id} onPress={() => applyFilter(p.id)} className={`px-4 py-2 rounded-full ${selectedMedia.filter===p.id?'bg-rose-600':'bg-gray-800'}`}><Text className="text-white">{p.label}</Text></TouchableOpacity>)}</View></View></View>}

      {mediaItems.length > 0 && <View><TextInput value={caption} onChangeText={setCaption} placeholder="Légende" className="bg-gray-900 text-white p-4 rounded-2xl mb-4" multiline /><TouchableOpacity onPress={handleUpload} disabled={uploadMutation.isPending||isUploading} className="bg-white py-4 rounded-2xl items-center"><Text className="text-gray-900 font-bold">Publier (optimisé)</Text></TouchableOpacity></View>}
    </ScrollView>
  );
}
