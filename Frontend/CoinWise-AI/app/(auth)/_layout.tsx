import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack initialRouteName="phone-login">
      <Stack.Screen
        name="phone-login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-otp"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sync-bank"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
