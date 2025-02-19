// GameScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';

const GameScreen = () => {
  // Retrieve variables from navigation params or set defaults
  const route = useRoute();
  const navigation = useNavigation();
  const { 
    correctId = 42, 
    optionIds = [41, 42, 43], 
    adminId = '1', 
    childId = '1' 
  } = route.params || {};

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showNextGame, setShowNextGame] = useState(false);

  // Function to play audio using expo-av
  const playAudio = async () => {
    const audioUrl = `http://your-backend-url/playAudio?id=${correctId}` +
      (adminId !== 'null' ? `&adminId=${adminId}` : '') +
      (childId !== 'null' ? `&childId=${childId}` : '');
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Error', 'Unable to play audio.');
    }
  };

  // Clean up the sound when component unmounts or sound changes
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Function to check the user's answer
  const checkAnswer = (selectedId: number) => {
    if (selectedId === correctId) {
      Alert.alert('Húrra! Vel gert!');
      setShowNextGame(true);
    } else {
      Alert.alert('Reyndu aftur!');
    }
  };

  // Reset game state for a new game
  const handleNextGame = () => {
    // You could trigger a new game fetch here. For now, we just hide the button.
    setShowNextGame(false);
    // Optionally, reset any other state variables or re-fetch game data.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Stafa leitin!</Text>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>⬅️ Til baka</Text>
      </TouchableOpacity>

      <Text style={styles.instruction}>Ýttu stafinn sem þú heyrir í!</Text>

      {/* Play Audio Button */}
      <TouchableOpacity style={styles.playButton} onPress={playAudio}>
        <Text style={styles.playButtonText}>Hlusta</Text>
      </TouchableOpacity>

      {/* Options rendered dynamically */}
      <View style={styles.optionsContainer}>
        {optionIds.map((id: number) => (
          <TouchableOpacity 
            key={id} 
            style={styles.optionButton} 
            onPress={() => checkAnswer(id)}
          >
            <Image
              style={styles.optionImage}
              source={{ uri: `http://localhost8080/getImage?id=${id}` +
                (adminId !== 'null' ? `&adminId=${adminId}` : '') +
                (childId !== 'null' ? `&childId=${childId}` : '')
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Game Button */}
      {showNextGame && (
        <TouchableOpacity style={styles.nextGameButton} onPress={handleNextGame}>
          <Text style={styles.nextGameButtonText}>Aftur!</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  backButtonText: {
    fontSize: 18
  },
  instruction: {
    fontSize: 18,
    marginBottom: 10
  },
  playButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  optionButton: {
    margin: 5
  },
  optionImage: {
    width: 100,
    height: 100
  },
  nextGameButton: {
    marginTop: 20,
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5
  },
  nextGameButtonText: {
    color: '#fff',
    fontSize: 16
  }
});

export default GameScreen;
