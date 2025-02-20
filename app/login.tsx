import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import loginStyles from '../styles/loginStyles';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { username, password });
      if (response.status === 200) {
        // Navigate to Dashboard, passing the adminId as a query parameter.
        router.push({ pathname: '/dashboard', params: { adminId: response.data.adminId } });
      }
    } catch (err) {
      setError('Login failed. Please check credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Lærilærlær</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="Notendanafn"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={loginStyles.input}
        placeholder="Lykilorð"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={loginStyles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : (
        <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
          <Text style={loginStyles.buttonText}>Innskrá</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
