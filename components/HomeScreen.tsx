import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Creator {
  user: {
    displayName: string;
    avatarUrl?: string;
  };
}

interface Post {
  id: string;
  title?: string;
  body?: string;
  type?: string;
  isLocked?: boolean;
  isFreePreview?: boolean;
  viewCount?: number;
  likeCount?: number;
  creator?: Creator;
}

interface FeedResponse {
  success: boolean;
  data: Post[];
}

function PostCard({ item }: { item: Post }) {
  return (
    <View style={styles.postCard}>
      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title ?? 'Post sans titre'}
      </Text>
      {item.body ? (
        <Text style={styles.postBody} numberOfLines={2}>
          {item.body}
        </Text>
      ) : null}
      {item.isLocked ? (
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedText}>🔒 Contenu exclusif</Text>
        </View>
      ) : null}
      <View style={styles.postFooter}>
        {item.creator?.user?.displayName ? (
          <Text style={styles.creatorName}>{item.creator.user.displayName}</Text>
        ) : null}
        <View style={styles.postStats}>
          <Text style={styles.statText}>❤️ {item.likeCount ?? 0}</Text>
          <Text style={styles.statText}>👁 {item.viewCount ?? 0}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery<FeedResponse>({
    queryKey: ['feed'],
    queryFn: () => api.get<FeedResponse>('/posts/feed'),
    retry: false,
  });

  const posts = data?.data ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#f43f5e" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>alXia</Text>
      </View>
      {posts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aucun contenu disponible</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard item={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f43f5e"
              colors={['#f43f5e']}
            />
          }
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  headerTitle: {
    color: '#f43f5e',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  list: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#1f2937',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  postTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  postBody: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  lockedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  lockedText: {
    color: '#f43f5e',
    fontSize: 12,
    fontWeight: '600',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  creatorName: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
});
