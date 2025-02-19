// app/game.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../services/api';

export default function Game() {
  // Use useLocalSearchParams to extract parameters.
  const { adminId, childId, gameType } = useLocalSearchParams() as {
    adminId: string;
    childId: string;
    gameType: string;
  };
  const router = useRouter();
  const [gameData, setGameData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGame() {
      try {
        const response = await api.get(
          `/api/admins/${adminId}/children/${childId}/games`,
          { params: { gameType } }
        );
        setGameData(response.data);
      } catch (err) {
        setError('Failed to load game data.');
        console.error(err);
      }
    }
    if (adminId && childId && gameType) {
      fetchGame();
    }
  }, [adminId, childId, gameType]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!gameData) {
    return (
      <View style={styles.center}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game: {gameData.gameName || gameType}</Text>
      <Text>Correct Option ID: {gameData.correctId}</Text>
      <Text>Options: {gameData.optionIds.join(', ')}</Text>
      {/* Add your game interaction logic here */}
      <Button title="Back to Dashboard" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  error: { color: 'red' },
});
