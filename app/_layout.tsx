
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Menyembunyikan header untuk stack navigation
      }}
    >
      <Stack.Screen name="index" options={{ title: 'NONTONKUSOCA' }} />
      <Stack.Screen name="MovieDetailScreen" options={{ title: 'Movie Details' }} />
    </Stack>
  );
}
