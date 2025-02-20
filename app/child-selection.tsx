// app/child-selection.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../services/api';
import selectionStyles from '../styles/selectionStyles';

interface Child {
  id: number;
  name: string;
}

export default function ChildSelectionScreen() {
  const { adminId } = useLocalSearchParams() as { adminId: string };
  const router = useRouter();
  const [allChildren, setAllChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // Assumed endpoint to return all children for the teacher’s school
        const response = await api.get(`/api/admins/${adminId}/children/all`);
        setAllChildren(response.data);
      } catch (err: any) {
        console.error('Error fetching children:', err);
        setError('Failed to load children.');
      } finally {
        setLoading(false);
      }
    };

    if (adminId) {
      fetchChildren();
    }
  }, [adminId]);

  const toggleSelection = (childId: number) => {
    const newSet = new Set(selectedChildren);
    if (newSet.has(childId)) {
      newSet.delete(childId);
    } else {
      newSet.add(childId);
    }
    setSelectedChildren(newSet);
  };

  const handleSave = () => {
    if (selectedChildren.size === 0) {
      Alert.alert('No Selection', 'Please select at least one child.');
      return;
    }
    // Convert the set to an array and pass it as a JSON string
    const selectedArray = Array.from(selectedChildren);
    router.push({
      pathname: '/dashboard',
      params: { adminId, selectedChildren: JSON.stringify(selectedArray) },
    });
  };

  if (loading) {
    return (
      <View style={selectionStyles.loading}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={selectionStyles.loadingText}>Loading children...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={selectionStyles.center}>
        <Text style={selectionStyles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={selectionStyles.container}>
      <Text style={selectionStyles.header}>Select Children for Dashboard</Text>
      <FlatList
        data={allChildren}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedChildren.has(item.id);
          return (
            <TouchableOpacity
              style={[selectionStyles.item, isSelected && selectionStyles.itemSelected]}
              onPress={() => toggleSelection(item.id)}
            >
              <Text style={selectionStyles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity style={selectionStyles.button} onPress={handleSave}>
        <Text style={selectionStyles.buttonText}>Save Selections</Text>
      </TouchableOpacity>
      <TouchableOpacity style={selectionStyles.backButton} onPress={() => router.back()}>
        <Text style={selectionStyles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
