import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Board } from '../components/Board';
import { Dice } from '../components/Dice';
import { useGameStore } from '../store/useGameStore';

export const GameScreen = ({ onExit }: { onExit: () => void }) => {
  const mode = useGameStore(s => s.mode);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onExit}>
          <Text style={styles.backText}>{'< Exit'}</Text>
        </TouchableOpacity>
        <Text style={styles.modeText}>Mode: {(mode).replace('_', ' ')}</Text>
      </View>

      <View style={styles.boardWrapper}>
         <Board />
      </View>

      <View style={styles.diceWrapper}>
         <Dice />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: 90,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  modeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#555',
  },
  boardWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  }
});
