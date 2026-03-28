import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withRepeat,
  Easing 
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';

export const Dice = () => {
  const { rollDice, diceValue, hasRolledDice, currentTurn, winner } = useGameStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const rotation = useSharedValue(0);

  const handlePress = () => {
    if (hasRolledDice || isAnimating || winner) return;

    setIsAnimating(true);
    // Start spin animation
    rotation.value = withSequence(
      withTiming(rotation.value + 360 * 3, { duration: 600, easing: Easing.out(Easing.quad) }),
    );

    setTimeout(() => {
      rollDice();
      setIsAnimating(false);
    }, 600);
  };

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  // Render dots based on dice value
  const renderDots = () => {
    // If not rolled or animating, maybe show a fast changing number or nothing
    let val = diceValue || 1; 

    // just a simple number for placeholder, but better as dots:
    return (
      <View style={styles.dotContainer}>
         <Text style={styles.diceText}>{val}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
       <Text style={styles.turnText}>Turn: {currentTurn}</Text>
       <TouchableOpacity onPress={handlePress} disabled={hasRolledDice || isAnimating || !!winner}>
          <Animated.View style={[styles.diceContainer, animStyle, { opacity: hasRolledDice ? 0.5 : 1 }]}>
             {renderDots()}
          </Animated.View>
       </TouchableOpacity>
       {winner && <Text style={styles.winnerText}>{winner} WINS!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  turnText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  diceContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  dotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 15,
  }
});
