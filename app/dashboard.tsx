// app/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../services/api';
import dashboardStyles from '../styles/dashboardStyles';

export default function DashboardScreen() {
  const { adminId, selectedChildren } = useLocalSearchParams() as { adminId: string; selectedChildren?: string };
  const router = useRouter();

  const [schoolName, setSchoolName] = useState<string>('No school returned');
  const [children, setChildren] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/api/admins/${adminId}`);
        console.log('Dashboard raw response:', response.data);
        const { schoolName, managedChildren } = response.data || {};
        setSchoolName(schoolName || 'No school returned');
        let childrenData = (managedChildren || []).map((child: any) => ({
          id: child.id,
          name: child.name,
        }));
        // If teacher has selected children, filter the list accordingly
        if (selectedChildren) {
          const selectedArray = JSON.parse(selectedChildren) as number[];
            childrenData = childrenData.filter((child: { id: number; name: string }) => selectedArray.includes(child.id));
        }
        setChildren(childrenData);
      } catch (err: any) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    if (adminId) {
      fetchDashboard();
    }
  }, [adminId, selectedChildren]);

  if (loading) {
    return (
      <View style={dashboardStyles.loading}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={{ fontSize: 18, marginTop: 10, color: '#333' }}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={dashboardStyles.center}>
        <Text style={dashboardStyles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={dashboardStyles.container}>
      <View style={dashboardStyles.headerContainer}>
        <Text style={dashboardStyles.title}>Dashboard</Text>
        <Text style={dashboardStyles.subtitle}>School: {schoolName}</Text>
      </View>
      <View style={dashboardStyles.listContainer}>
        <Text style={dashboardStyles.subtitle}>Managed Children:</Text>
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/game-selection',
                  params: { adminId, childId: item.id.toString() },
                })
              }
            >
              <Text style={dashboardStyles.item}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        style={dashboardStyles.button}
        onPress={() => router.push({ pathname: '/child-selection', params: { adminId } })}
      >
        <Text style={dashboardStyles.buttonText}>Change Child Selections</Text>
      </TouchableOpacity>
    </View>
  );
}
