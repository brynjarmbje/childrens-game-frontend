// app/_layout.tsx
import { Slot } from 'expo-router';

export default function RootLayout() {
  // Simply return <Slot /> so the router can render the current route.
  return <Slot />;
}
