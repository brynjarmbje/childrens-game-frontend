import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import api from '../services/api';
import gameStyles from '../styles/gameStyles';
import ConfettiCannon from 'react-native-confetti-cannon';

const BASE_URL = api.defaults.baseURL;

interface GameData {
  adminId: number;
  childId: number;
  gameType: number;
  correctId: number;
  optionIds: number[];
  message: string;
}

type RouteParams = {
  Game: {
    adminId: number;
    childId: number;
    gameType: string;
  };
};

interface OptionButtonProps {
  id: number;
  onPress: (id: number) => void;
  imageUri: string;
  style: any;
}

const AnimatedOptionButton: React.FC<OptionButtonProps> = ({ id, onPress, imageUri, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress(id);
    });
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={style} onPress={handlePress}>
        <Image source={{ uri: imageUri }} style={gameStyles.optionImage} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const Game: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'Game'>>();
  const { adminId, childId, gameType } = route.params;
  const navigation = useNavigation();

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'wrong' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchGame();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/api/admins/${adminId}/children/${childId}/games`, {
        params: { gameType },
      });
      setGameData(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load the game: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Plays audio for the dedicated "Hlusta" button (correct letter)
  const playCorrectAudio = async () => {
    if (!gameData) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: `${BASE_URL}/playAudio?id=${gameData.correctId}&adminId=${adminId}&childId=${childId}`,
      });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      Alert.alert('Audio Error', 'Failed to play audio.');
    }
  };

  // Plays audio for a given letter (option buttons)
  const playLetterAudio = async (id: number) => {
    try {
      const { sound: letterSound } = await Audio.Sound.createAsync({
        uri: `${BASE_URL}/playAudio?id=${id}&adminId=${adminId}&childId=${childId}`,
      });
      letterSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          letterSound.unloadAsync();
        }
      });
      await letterSound.playAsync();
    } catch (error) {
      console.log('Error playing letter audio', error);
    }
  };

  // Handle option press with visual feedback
  const handleOptionPress = async (id: number) => {
    if (!gameData) return;
    await playLetterAudio(id);
    setSelectedOption(id);
    if (id === gameData.correctId) {
      setFeedbackStatus('correct');
      setShowConfetti(true);
      // Instead of shifting layout, show a modal
      setModalVisible(true);
    } else {
      setFeedbackStatus('wrong');
      Alert.alert('Rangt svar!', 'Try again!');
    }
  };

  // Called when modal button is pressed
  const handleNextQuestion = () => {
    setModalVisible(false);
    setSelectedOption(null);
    setFeedbackStatus(null);
    setShowConfetti(false);
    // Load a new question without shifting layout
    fetchGame();
  };

  if (isLoading) {
    return (
      <View style={gameStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }

  if (!gameData || !gameData.optionIds) {
    return (
      <View style={gameStyles.container}>
        <Text style={{ color: '#FFF' }}>Error loading game data.</Text>
      </View>
    );
  }

  return (
    <View style={gameStyles.container}>
      {/* Back Button */}
      <TouchableOpacity style={gameStyles.backButton} onPress={() => navigation.goBack()}>
        <Text style={gameStyles.backButtonText}>⬅️ Til baka</Text>
      </TouchableOpacity>

      <Text style={gameStyles.header}>Stafa leitin!</Text>
      <Text style={gameStyles.instruction}>Ýttu stafinn sem þú heyrir í!</Text>

      {/* Dedicated Hlusta Button */}
      <TouchableOpacity style={gameStyles.audioButton} onPress={playCorrectAudio}>
        <Text style={gameStyles.audioButtonText}>Hlusta</Text>
      </TouchableOpacity>

      {/* Option Buttons */}
      <View style={gameStyles.optionsContainer}>
        {gameData.optionIds.map((id: number) => {
          let buttonStyle = [gameStyles.optionButton];
          if (selectedOption === id && feedbackStatus === 'correct') {
            buttonStyle.push(gameStyles.optionButtonCorrect);
          } else if (selectedOption === id && feedbackStatus === 'wrong') {
            buttonStyle.push(gameStyles.optionButtonWrong);
          }
          return (
            <AnimatedOptionButton
              key={id}
              id={id}
              onPress={handleOptionPress}
              imageUri={`${BASE_URL}/getImage?id=${id}&adminId=${adminId}&childId=${childId}`}
              style={buttonStyle}
            />
          );
        })}
      </View>

      {/* Confetti Animation for celebration */}
      {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />}

      {/* Modal for correct answer */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={gameStyles.modalContainer}>
          <View style={gameStyles.modalContent}>
            <TouchableOpacity style={gameStyles.modalButton} onPress={handleNextQuestion}>
              <Text style={gameStyles.modalButtonText}>Húrra!</Text>
              <Text style={gameStyles.modalButtonText}>Finnum annan staf!</Text>

            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Game;
