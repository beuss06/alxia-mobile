import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Conversation {
  id: string;
  participantName?: string;
  lastMessage?: string;
  updatedAt?: string;
  unreadCount?: number;
}

function ConversationItem({ item }: { item: Conversation }) {
  return (
    <TouchableOpacity style={styles.convCard} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.participantName ?? '?')[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.convInfo}>
        <Text style={styles.convName} numberOfLines={1}>
          {item.participantName ?? 'Inconnu'}
        </Text>
        {item.lastMessage ? (
          <Text style={styles.convLastMsg} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        ) : null}
      </View>
      {item.unreadCount && item.unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      ) : null}
      {item.updatedAt ? (
        <Text style={styles.convDate}>
          {new Date(item.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        return await api.get<Conversation[]>('/messages/conversations');
      } catch {
        return [];
      }
    },
    retry: false,
  });

  const empty = !isLoading && (!conversations || conversations.length === 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#f43f5e" size="large" />
        </View>
      ) : empty ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Aucune conversation pour l'instant</Text>
          <Text style={styles.emptySubtitle}>
            Vos échanges avec vos abonnés apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConversationItem item={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#9ca3af',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  convCard: {
    backgroundColor: '#1f2937',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  convInfo: {
    flex: 1,
  },
  convName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  convLastMsg: {
    color: '#9ca3af',
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#f43f5e',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  convDate: {
    color: '#6b7280',
    fontSize: 11,
    marginLeft: 8,
  },
});
