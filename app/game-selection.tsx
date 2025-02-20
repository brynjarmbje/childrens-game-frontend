// app/game-selection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import selectionStyles from '../styles/selectionStyles';

const availableGames = [
  { id: 'letters', name: 'Letters' },
  { id: 'numbers', name: 'Numbers' },
  { id: 'locate', name: 'Locate' },
];

export default function GameSelectionScreen() {
  const { adminId, childId } = useLocalSearchParams() as { adminId: string; childId: string };
  const router = useRouter();

  const handleGameSelect = (gameType: string) => {
    router.push({
      pathname: '/game',
      params: { adminId, childId, gameType },
    });
  };

  return (
    <View style={selectionStyles.container}>
      <Text style={selectionStyles.header}>Select a Game</Text>
      <FlatList
        data={availableGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={selectionStyles.button} onPress={() => handleGameSelect(item.id)}>
            <Text style={selectionStyles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={selectionStyles.backButton} onPress={() => router.back()}>
        <Text style={selectionStyles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
