// app/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../services/api';

export default function Dashboard() {
  // Use useLocalSearchParams to extract URL parameters.
  const { adminId } = useLocalSearchParams() as { adminId: string };
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get(`/api/admins/${adminId}`);
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      }
    }
    if (adminId) {
      fetchDashboard();
    }
  }, [adminId]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.center}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>School: {dashboardData.schoolName}</Text>

      <Text style={styles.subtitle}>Managed Children:</Text>
      <FlatList
        data={dashboardData.managedChildren}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />

      <Text style={styles.subtitle}>Available Children:</Text>
      <FlatList
        data={dashboardData.availableChildren}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />

      {/* Example: Button to start a game for a specific child */}
      <Button
        title="Start Game for Child 1"
        onPress={() =>
          router.push({
            pathname: '/game',
            params: { adminId, childId: '1', gameType: 'letters' },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 15 },
  item: { fontSize: 16, marginVertical: 5 },
  error: { color: 'red' },
});
