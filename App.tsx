import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PlayerSelection } from './src/screens/PlayerSelection';
import { GameScreen } from './src/screens/GameScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Only needed if using strict react-native-reanimated configs
import 'react-native-reanimated';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {!isPlaying ? (
          <PlayerSelection onStart={() => setIsPlaying(true)} />
        ) : (
          <GameScreen onExit={() => setIsPlaying(false)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
