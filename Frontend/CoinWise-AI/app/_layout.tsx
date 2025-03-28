import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === 'sign-in' || segments[0] === 'sign-up';
    const inAppGroup = segments[0] === '(app)';

    if (!isSignedIn && !inAuthGroup) {
      // Redirect to the sign-in page if not signed in
      router.replace('/sign-in');
    } else if (isSignedIn) {
      if (inAuthGroup) {
        // If signed in and in auth group, check setup and redirect accordingly
        checkSetupAndRedirect();
      } else if (!inAppGroup) {
        // If signed in but not in app group, redirect to app
        checkSetupAndRedirect();
      }
    }
  }, [isSignedIn, segments, isLoaded]);

  const checkSetupAndRedirect = async () => {
    try {
      const userSalary = await AsyncStorage.getItem('userSalary');
      const userGoals = await AsyncStorage.getItem('userGoals');

      if (!userSalary) {
        router.replace('/(app)/salary-setup');
      } else if (!userGoals) {
        router.replace('/(app)/financial-goals');
      } else {
        router.replace('/(app)/home');
      }
    } catch (error) {
      console.error('Error checking setup:', error);
      router.replace('/(app)/home');
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !isLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="investment-details" 
          options={{ 
            headerShown: true,
            title: 'Investment Details',
            headerBackTitle: 'Back'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}
