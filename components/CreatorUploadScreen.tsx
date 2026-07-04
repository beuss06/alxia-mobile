import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../lib/api';

interface PostPayload {
  title: string;
  description: string;
  price: string;
  imageUri: string | null;
}

export default function CreatorUploadScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/posts', {
        title: title.trim(),
        description: description.trim(),
        price: price.trim() || '0',
        imageUri,
      } as PostPayload);
      Alert.alert('Succès', 'Votre post a été publié !');
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUri(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Échec de la publication';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Créer du contenu</Text>

      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Titre du post"
        placeholderTextColor="#6b7280"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description…"
        placeholderTextColor="#6b7280"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Prix (€)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="0"
        placeholderTextColor="#6b7280"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.pickButton} onPress={handlePickImage} activeOpacity={0.8}>
        <Text style={styles.pickButtonText}>
          {imageUri ? 'Changer l\'image' : 'Choisir une image'}
        </Text>
      </TouchableOpacity>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.removeImageText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.publishButton, loading && styles.publishButtonDisabled]}
        onPress={handlePublish}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.publishButtonText}>Publier</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  screenTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 28,
  },
  label: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  pickButton: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  pickButtonText: {
    color: '#f43f5e',
    fontSize: 15,
    fontWeight: '600',
  },
  previewContainer: {
    marginBottom: 24,
    borderRadius: 14,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 14,
  },
  removeImageButton: {
    backgroundColor: '#374151',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 10,
  },
  removeImageText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: '#f43f5e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  publishButtonDisabled: {
    opacity: 0.6,
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
