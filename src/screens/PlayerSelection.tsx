import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { GameMode } from '../types';
import { useGameStore } from '../store/useGameStore';

export const PlayerSelection = ({ onStart }: { onStart: () => void }) => {
  const resetGame = useGameStore(s => s.resetGame);

  const handleStart = (mode: GameMode) => {
    resetGame(mode);
    onStart();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ludo Pro</Text>
      
      <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.button} onPress={() => handleStart(GameMode.ONE_PLAYER)}>
           <Text style={styles.buttonText}>1 Player (vs AI)</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.button, {backgroundColor: '#4CAF50'}]} onPress={() => handleStart(GameMode.TWO_PLAYER)}>
           <Text style={styles.buttonText}>2 Players</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.button, {backgroundColor: '#FFEB3B'}]} onPress={() => handleStart(GameMode.THREE_PLAYER)}>
           <Text style={[styles.buttonText, {color: '#333'}]}>3 Players</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.button, {backgroundColor: '#F44336'}]} onPress={() => handleStart(GameMode.FOUR_PLAYER)}>
           <Text style={styles.buttonText}>4 Players</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
