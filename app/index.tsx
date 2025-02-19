// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Use a small delay to ensure the router is mounted before redirecting
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 100); // delay of 100ms

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}
