import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BOARD_SIZE, COMMON_PATH, HOME_STRETCH, YARD_POSITIONS } from '../constants/BoardMap';
import { PlayerColor, TokenStatus } from '../types';
import { LudoEngine, LUDO_CONFIG } from '../engine/LudoEngine';
import { useGameStore } from '../store/useGameStore';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width * 0.95) / BOARD_SIZE; 
const BOARD_WIDTH = CELL_SIZE * BOARD_SIZE;

const getColorHex = (color: PlayerColor | string) => {
  switch (color) {
    case PlayerColor.RED: return '#FF0000';
    case PlayerColor.GREEN: return '#00FF00';
    case PlayerColor.YELLOW: return '#FFD700';
    case PlayerColor.BLUE: return '#0000FF';
    default: return '#FFFFFF';
  }
};

const TokenComponent = ({ token, colorObj }: { token: any, colorObj: PlayerColor }) => {
  // calculate logical x and y
  let x = 0; let y = 0;
  
  if (token.status === TokenStatus.IN_YARD) {
    const idx = parseInt(token.id.split('_')[1], 10) - 1;
    const yardCell = YARD_POSITIONS[colorObj][idx];
    x = yardCell.x;
    y = yardCell.y;
  } else if (token.status === TokenStatus.ACTIVE) {
    const globalPos = LudoEngine.getGlobalPosition(colorObj, token.position);
    if (typeof globalPos === 'number') {
      const gCell = COMMON_PATH[globalPos];
      x = gCell.x;
      y = gCell.y;
    } else if (typeof globalPos === 'string' && globalPos.includes('HOME_')) {
      const stretchIdx = parseInt(globalPos.split('_')[2], 10) - 1;
      const stretchCell = HOME_STRETCH[colorObj][stretchIdx];
      x = stretchCell.x;
      y = stretchCell.y;
    }
  } else if (token.status === TokenStatus.HOME) {
    x = 7; // Home Center
    y = 7;
  }

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(x * CELL_SIZE) },
        { translateY: withSpring(y * CELL_SIZE) },
      ],
    };
  });

  const handlePress = () => {
    useGameStore.getState().moveToken(token.id);
  };

  return (
    <Animated.View style={[styles.tokenBase, animStyle]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={[styles.tokenInner, { backgroundColor: getColorHex(colorObj) }]} />
    </Animated.View>
  );
};

export const Board = () => {
  const players = useGameStore(state => state.players);

  // Generate background grid cells
  const cells = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      let isCommon = COMMON_PATH.find(p => p.x === c && p.y === r);
      let isHomeStretch = Object.keys(HOME_STRETCH).flatMap(k => 
         HOME_STRETCH[k as PlayerColor].map(pos => ({...pos, col: k}))
      ).find(p => p.x === c && p.y === r);
      
      let isSafe = false;
      if (isCommon) {
         const globalIdx = COMMON_PATH.findIndex(p => p.x === c && p.y === r);
         isSafe = LUDO_CONFIG.safeZones.includes(globalIdx);
      }

      let bgColor = '#fff';
      if (isHomeStretch) bgColor = getColorHex(isHomeStretch.col as PlayerColor) + '80'; // semi transparent
      if (isSafe) bgColor = '#e0e0e0';

      // Yard colors
      if ((r < 6 && c < 6)) bgColor = '#FF000020'; // Red Yard
      if ((r < 6 && c > 8)) bgColor = '#00FF0020'; // Green Yard
      if ((r > 8 && c < 6)) bgColor = '#0000FF20'; // Blue Yard
      if ((r > 8 && c > 8)) bgColor = '#FFD70020'; // Yellow Yard
      if (r > 5 && r < 9 && c > 5 && c < 9) bgColor = '#333333'; // Center

      cells.push(
        <View key={`cell-${r}-${c}`} style={[
          styles.cell, 
          { 
            left: c * CELL_SIZE, 
            top: r * CELL_SIZE,
            backgroundColor: bgColor 
          }
        ]}>
          {isSafe && <View style={styles.safeStar} />}
        </View>
      );
    }
  }

  return (
    <View style={styles.boardContainer}>
      <View style={styles.boardWrapper}>
        {cells}
        
        {/* Render Tokens */}
        {Object.values(players).map(p => 
          p.tokens.map(t => (
            <TokenComponent key={t.id} token={t} colorObj={p.color} />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  boardWrapper: {
    width: BOARD_WIDTH,
    height: BOARD_WIDTH,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  cell: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeStar: {
    width: CELL_SIZE * 0.4,
    height: CELL_SIZE * 0.4,
    backgroundColor: '#ffaa00',
    transform: [{ rotate: '45deg'}],
  },
  tokenBase: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tokenInner: {
    width: CELL_SIZE * 0.7,
    height: CELL_SIZE * 0.7,
    borderRadius: CELL_SIZE * 0.35,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2},
  }
});
