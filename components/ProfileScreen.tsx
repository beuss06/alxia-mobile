import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api, clearToken } from '../lib/api';
import { useDiscreetMode } from '../lib/discreetMode';

interface CreatorInfo {
  monthlyPrice?: number;
  subscriberCount?: number;
  postCount?: number;
}

interface MeData {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  creator?: CreatorInfo;
}

interface MeResponse {
  success: boolean;
  data: MeData;
}

interface Props {
  onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: Props) {
  const { data, isLoading } = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: () => api.get<MeResponse>('/auth/me'),
    retry: false,
  });

  const discreet = useDiscreetMode();

  const handleLogout = async () => {
    await clearToken();
    onLogout();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#f43f5e" size="large" />
      </View>
    );
  }

  const user = data?.data;
  const isCreator = user?.role === 'CREATOR';
  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const posts = isCreator ? (user?.creator?.postCount ?? 0) : 0;
  const subscribers = isCreator ? (user?.creator?.subscriberCount ?? 0) : 0;
  const earnings = isCreator ? `€${user?.creator?.monthlyPrice ?? 0}` : '€0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{user?.displayName ?? '—'}</Text>
          {user?.isVerified ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Vérifié</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.username}>@{user?.username ?? '—'}</Text>

        {user?.bio ? (
          <Text style={styles.bio}>{user.bio}</Text>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{subscribers}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{earnings}</Text>
          <Text style={styles.statLabel}>Revenus</Text>
        </View>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <View style={styles.privacyRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyLabel}>Mode discret</Text>
            <Text style={styles.privacyHint}>Affiche une calculatrice à la place de l'app. Triple tap sur "=" pour ressortir.</Text>
          </View>
          <Switch
            value={discreet.enabled}
            onValueChange={(v) => discreet.setEnabled(v)}
            trackColor={{ false: '#374151', true: '#f43f5e' }}
            thumbColor="#fff"
          />
        </View>
        {discreet.enabled && (
          <TouchableOpacity onPress={discreet.activate} style={styles.discreetBtn} activeOpacity={0.8}>
            <Text style={styles.discreetBtnText}>🔒 Activer maintenant</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  header: {
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
  profileSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: '#065f46',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
  },
  username: {
    color: '#9ca3af',
    fontSize: 15,
    marginBottom: 12,
  },
  bio: {
    color: '#d1d5db',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#374151',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
  privacySection: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: { color: '#9ca3af', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  privacyLabel: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  privacyHint: { color: '#9ca3af', fontSize: 11, lineHeight: 16 },
  discreetBtn: { marginTop: 12, backgroundColor: '#f43f5e', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  discreetBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  logoutSection: {
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
