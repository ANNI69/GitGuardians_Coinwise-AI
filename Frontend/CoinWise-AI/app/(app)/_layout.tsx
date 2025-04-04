import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="salary-setup" />
      <Stack.Screen name="financial-goals" />
      <Stack.Screen name="home" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}