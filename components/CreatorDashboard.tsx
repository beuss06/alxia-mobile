import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface DashboardStats {
  subscriberCount?: number;
  paidSubscriberCount?: number;
  postCount?: number;
  monthlyTips?: number;
  totalEarnings?: number;
  newSubscribersThisMonth?: number;
}

interface CreatorInfo {
  monthlyPrice?: number;
  subscriberCount?: number;
  postCount?: number;
  totalEarnings?: number;
}

interface RecentPost {
  id: string;
  title?: string;
  caption?: string;
  createdAt?: string;
}

interface DashboardResponse {
  success: boolean;
  data: {
    creator?: CreatorInfo;
    stats?: DashboardStats;
    recentPosts?: RecentPost[];
  };
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function CreatorDashboard() {
  const { data, isLoading } = useQuery<DashboardResponse>({
    queryKey: ['creatorDashboard'],
    queryFn: () => api.get<DashboardResponse>('/creators/dashboard'),
    retry: false,
  });

  const stats = data?.data?.stats;
  const recentPosts = data?.data?.recentPosts ?? [];

  const subscribers = stats?.subscriberCount ?? 0;
  const totalEarnings = stats?.totalEarnings != null ? `€${stats.totalEarnings}` : '€0';
  const postCount = stats?.postCount ?? 0;
  const monthlyTips = stats?.monthlyTips != null ? `€${stats.monthlyTips}` : '€0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Créatrice</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Abonnés" value={String(subscribers)} />
        <StatCard label="Revenus totaux" value={totalEarnings} />
        <StatCard label="Posts" value={String(postCount)} />
        <StatCard label="Tips ce mois" value={monthlyTips} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes derniers posts</Text>
        {isLoading ? (
          <ActivityIndicator color="#f43f5e" style={{ marginTop: 24 }} />
        ) : recentPosts.length > 0 ? (
          recentPosts.slice(0, 10).map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postTitle}>
                {post.title ?? post.caption ?? 'Post sans titre'}
              </Text>
              {post.createdAt ? (
                <Text style={styles.postDate}>
                  {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              ) : null}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucun post pour l'instant</Text>
            <Text style={styles.emptySubtext}>
              Créez votre premier contenu depuis l'onglet "Créer"
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    paddingBottom: 40,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1f2937',
    borderRadius: 14,
    padding: 20,
    flex: 1,
    minWidth: '44%',
    alignItems: 'center',
    margin: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  postTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  postDate: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
});
