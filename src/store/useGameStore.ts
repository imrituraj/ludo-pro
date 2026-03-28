import { create } from 'zustand';
import { GameState, GameMode, PlayerColor, Player, Token, TokenStatus } from '../types';
import { LudoEngine, LUDO_CONFIG } from '../engine/LudoEngine';

const initTokens = (color: PlayerColor): Token[] => {
  return [1, 2, 3, 4].map(id => ({
    id: `${color}_${id}`,
    color,
    status: TokenStatus.IN_YARD,
    position: -1,
  }));
};

const setupPlayers = (mode: GameMode): Record<PlayerColor, Player> => {
  const allColors = [PlayerColor.RED, PlayerColor.GREEN, PlayerColor.YELLOW, PlayerColor.BLUE];
  const activeCount = mode === GameMode.ONE_PLAYER ? 2 : 
                      mode === GameMode.TWO_PLAYER ? 2 : 
                      mode === GameMode.THREE_PLAYER ? 3 : 4;
                      
  const players: Partial<Record<PlayerColor, Player>> = {};
  allColors.forEach((color, index) => {
    players[color] = {
      color,
      isAi: mode === GameMode.ONE_PLAYER && color !== PlayerColor.RED,
      tokens: initTokens(color),
      isActive: index < activeCount,
    };
  });
  return players as Record<PlayerColor, Player>;
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: GameMode.TWO_PLAYER,
  players: setupPlayers(GameMode.TWO_PLAYER),
  currentTurn: PlayerColor.RED,
  diceValue: null,
  hasRolledDice: false,
  winner: null,

  rollDice: () => {
    const { hasRolledDice, currentTurn, players } = get();
    if (hasRolledDice || get().winner) return;

    const val = Math.floor(Math.random() * 6) + 1;
    // For testing/debugging, you might sometimes want '6' more often, but standard is random.
    set({ diceValue: val, hasRolledDice: true });

    // Auto switch turn if no valid moves
    const activeTokens = players[currentTurn].tokens;
    const canMoveAny = activeTokens.some(t => LudoEngine.canMoveToken(t, val));
    if (!canMoveAny) {
      setTimeout(() => get().switchTurn(), 800);
    } else {
       // If it's an AI turn, make the move automatically
       if (players[currentTurn].isAi) {
          setTimeout(() => {
            const allTokens = Object.values(players).flatMap(p => p.tokens);
            const bestMovable = LudoEngine.getBestAIMove(activeTokens, val, allTokens);
            if (bestMovable) {
              get().moveToken(bestMovable.id);
            } else {
              get().switchTurn();
            }
          }, 1000);
       }
    }
  },

  moveToken: (tokenId: string) => {
    const { players, currentTurn, diceValue, hasRolledDice } = get();
    if (!hasRolledDice || !diceValue || get().winner) return;

    const currentPlayer = players[currentTurn];
    const token = currentPlayer.tokens.find(t => t.id === tokenId);
    
    if (!token || token.color !== currentTurn) return;
    if (!LudoEngine.canMoveToken(token, diceValue)) return;

    let newPosition = token.position;
    let newStatus = token.status;

    if (token.status === TokenStatus.IN_YARD && diceValue === 6) {
      newPosition = 0;
      newStatus = TokenStatus.ACTIVE;
    } else {
      newPosition += diceValue;
      if (newPosition >= 57) {
        newPosition = 57;
        newStatus = TokenStatus.HOME;
      }
    }

    // Check Capture
    const allTokens = Object.values(players).flatMap(p => p.tokens);
    const targetGlobalPos = LudoEngine.getGlobalPosition(token.color, newPosition);
    const capturedTokenId = LudoEngine.checkCapture(token.color, targetGlobalPos, allTokens);

    set((state) => {
      const newPlayers = { ...state.players };
      
      // Move this token
      const myTokens = [...newPlayers[currentTurn].tokens];
      const tIndex = myTokens.findIndex(t => t.id === tokenId);
      myTokens[tIndex] = { ...myTokens[tIndex], position: newPosition, status: newStatus };
      newPlayers[currentTurn] = { ...newPlayers[currentTurn], tokens: myTokens };

      // Update captured token
      if (capturedTokenId) {
        const capturedColor = capturedTokenId.split('_')[0] as PlayerColor;
        const enemyTokens = [...newPlayers[capturedColor].tokens];
        const eIndex = enemyTokens.findIndex(t => t.id === capturedTokenId);
        enemyTokens[eIndex] = { ...enemyTokens[eIndex], position: -1, status: TokenStatus.IN_YARD };
        newPlayers[capturedColor] = { ...newPlayers[capturedColor], tokens: enemyTokens };
      }

      return { players: newPlayers };
    });

    get().checkWinCondition();
    
    // Switch turns unless player scored a 6 or got a capturedToken
    if (diceValue !== 6 && !capturedTokenId && get().winner === null) {
      setTimeout(() => get().switchTurn(), 500);
    } else {
      set({ hasRolledDice: false }); // Let them roll again
      if (currentPlayer.isAi) {
         setTimeout(() => get().rollDice(), 1000);
      }
    }
  },

  switchTurn: () => {
    if (get().winner) return;
    const order = [PlayerColor.RED, PlayerColor.GREEN, PlayerColor.YELLOW, PlayerColor.BLUE];
    let currentIndex = order.indexOf(get().currentTurn);
    let nextTurn = order[(currentIndex + 1) % 4];

    // Find next active player
    while (!get().players[nextTurn].isActive) {
      currentIndex++;
      nextTurn = order[(currentIndex + 1) % 4];
    }

    set({ currentTurn: nextTurn, diceValue: null, hasRolledDice: false });

    // Auto roll for AI
    if (get().players[nextTurn].isAi) {
      setTimeout(() => get().rollDice(), 1000);
    }
  },

  checkWinCondition: () => {
    const { players, currentTurn } = get();
    const myTokens = players[currentTurn].tokens;
    const allHome = myTokens.every(t => t.status === TokenStatus.HOME);
    if (allHome) {
      set({ winner: currentTurn });
    }
  },

  resetGame: (mode: GameMode) => {
    set({
      mode,
      players: setupPlayers(mode),
      currentTurn: PlayerColor.RED, // Red always starts
      diceValue: null,
      hasRolledDice: false,
      winner: null,
    });
  }
}));
