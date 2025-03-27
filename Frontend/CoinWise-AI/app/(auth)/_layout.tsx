import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="phone-login">
      <Stack.Screen name="phone-login" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="sync-bank" />
    </Stack>
  );
}
