import { PlayerColor, Token, TokenStatus, BoardConfig } from '../types';

export const LUDO_CONFIG: BoardConfig = {
  gridSize: 15,
  safeZones: [0, 8, 13, 21, 26, 34, 39, 47],
  playerStartIndices: {
    [PlayerColor.RED]: 0,     // Red starts at global index 0
    [PlayerColor.GREEN]: 13,   // Green starts at global index 13
    [PlayerColor.YELLOW]: 26,  // Yellow starts at global index 26
    [PlayerColor.BLUE]: 39,    // Blue starts at global index 39
  },
};

export const LudoEngine = {
  /**
   * Retrieves the global board index (0-51) based on a token's relative position (0-56).
   * If the token is in the home stretch (51-56) or HOME (57), it returns a specific 
   * string/number that indicates it's off the common path.
   */
  getGlobalPosition(color: PlayerColor, relativePosition: number): number | string {
    if (relativePosition < 0) return 'YARD';
    if (relativePosition > 56) return 'HOME';

    if (relativePosition > 50) {
      // In the home stretch. We can return a string like 'RED_HOME_1'
      const stepsInStretch = relativePosition - 50; 
      return `${color}_HOME_${stepsInStretch}`;
    }

    const startIndex = LUDO_CONFIG.playerStartIndices[color];
    return (startIndex + relativePosition) % 52;
  },

  /**
   * Checks if a move is valid for a given token.
   */
  canMoveToken(token: Token, diceValue: number): boolean {
    if (token.status === TokenStatus.IN_YARD) {
      return diceValue === 6; // Can only leave yard on a 6
    }
    
    if (token.status === TokenStatus.HOME) {
      return false; // Already home
    }

    // Ensure we don't overshoot HOME (which is at relative position 57)
    if (token.position + diceValue > 57) {
      return false; 
    }

    return true;
  },

  /**
   * Evaluates if a token lands on an opponent's token and captures it, given a list of all tokens.
   * Returns the ID of the captured token, or null if no capture.
   */
  checkCapture(tokenColor: PlayerColor, targetGlobalPos: number | string, allTokens: Token[]): string | null {
    // Cannot capture in the yard, home stretch, or home
    if (typeof targetGlobalPos === 'string') return null;

    // Cannot capture in a safe zone
    if (LUDO_CONFIG.safeZones.includes(targetGlobalPos)) {
      return null;
    }

    // Find any opponent token at the exact same global position
    const opponent = allTokens.find(t => {
      if (t.color === tokenColor) return false;
      if (t.status !== TokenStatus.ACTIVE) return false;
      
      const pos = this.getGlobalPosition(t.color, t.position);
      return pos === targetGlobalPos;
    });

    return opponent ? opponent.id : null;
  },

  /**
   * A basic AI algorithm picking the "best" token to move for a 1-player mode
   */
  getBestAIMove(tokens: Token[], diceValue: number, allTokens: Token[]): Token | null {
    const movableTokens = tokens.filter(t => this.canMoveToken(t, diceValue));
    if (movableTokens.length === 0) return null;

    // Prioritize capturing an opponent
    for (const token of movableTokens) {
      const nextRelativePos = token.position === -1 ? 0 : token.position + diceValue;
      const targetPos = this.getGlobalPosition(token.color, nextRelativePos);
      
      if (this.checkCapture(token.color, targetPos, allTokens)) {
        return token; // Moving this token captures someone!
      }
    }

    // Prioritize moving token out of yard
    const yardToken = movableTokens.find(t => t.status === TokenStatus.IN_YARD);
    if (yardToken) return yardToken;

    // Prioritize getting a token closer to HOME
    let bestToken = movableTokens[0];
    for (const token of movableTokens) {
      const isCloserToHome = (token.position > bestToken.position && token.status !== TokenStatus.IN_YARD);
      if (isCloserToHome) {
        bestToken = token;
      }
    }

    return bestToken;
  }
};
