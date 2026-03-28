// Core Enums
export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
}

export enum GameMode {
  ONE_PLAYER = 'ONE_PLAYER', // vs AI
  TWO_PLAYER = 'TWO_PLAYER',
  THREE_PLAYER = 'THREE_PLAYER',
  FOUR_PLAYER = 'FOUR_PLAYER',
}

export enum TokenStatus {
  IN_YARD = 'IN_YARD',
  ACTIVE = 'ACTIVE',
  HOME = 'HOME', // safely reached the center
}

// Token & Player Interfaces
export interface Token {
  id: string; // e.g., 'RED_1'
  color: PlayerColor;
  status: TokenStatus;
  position: number; // 0-51 for common path, 52-57 for home stretch. -1 if in yard.
}

export interface Player {
  color: PlayerColor;
  isAi: boolean;
  tokens: Token[];
  isActive: boolean; // Is it their turn?
}

// Game Engine State
export interface GameState {
  mode: GameMode;
  players: Record<PlayerColor, Player>; // Map of active players
  currentTurn: PlayerColor;
  diceValue: number | null;
  hasRolledDice: boolean;
  winner: PlayerColor | null;
  
  // Game Actions
  rollDice: () => void;
  moveToken: (tokenId: string) => void;
  switchTurn: () => void;
  checkWinCondition: () => void;
  resetGame: (mode: GameMode) => void;
}

// Board Layout & Mapping Interfaces
export interface Coordinate {
  x: number; // Grid column index
  y: number; // Grid row index
}

export interface BoardConfig {
  gridSize: number; // typically 15x15 perfect square
  safeZones: number[]; // e.g., [8, 13, 21, 26, 34, 39, 47, 0]
  playerStartIndices: Record<PlayerColor, number>; 
}
