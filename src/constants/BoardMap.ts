import { Coordinate, PlayerColor } from '../types';

export const BOARD_SIZE = 15;

// The exact (x, y) coordinates for all 52 common path tiles.
// Index 0 represents the Red Start point, proceeding clockwise.
export const COMMON_PATH: Coordinate[] = [
  // RED path segment (0 to 4)
  {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6},
  // Moving UP (5 to 10)
  {x: 6, y: 5}, {x: 6, y: 4}, {x: 6, y: 3}, {x: 6, y: 2}, {x: 6, y: 1}, {x: 6, y: 0},
  // Top curve (11 to 12)
  {x: 7, y: 0}, {x: 8, y: 0},
  // GREEN Start and path segment (13 to 17)
  {x: 8, y: 1}, {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5},
  // Moving RIGHT (18 to 23)
  {x: 9, y: 6}, {x: 10, y: 6}, {x: 11, y: 6}, {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6},
  // Right curve (24 to 25)
  {x: 14, y: 7}, {x: 14, y: 8},
  // YELLOW Start and path segment (26 to 30)
  {x: 13, y: 8}, {x: 12, y: 8}, {x: 11, y: 8}, {x: 10, y: 8}, {x: 9, y: 8},
  // Moving DOWN (31 to 36)
  {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13}, {x: 8, y: 14},
  // Bottom curve (37 to 38)
  {x: 7, y: 14}, {x: 6, y: 14},
  // BLUE Start and path segment (39 to 43)
  {x: 6, y: 13}, {x: 6, y: 12}, {x: 6, y: 11}, {x: 6, y: 10}, {x: 6, y: 9},
  // Moving LEFT (44 to 49)
  {x: 5, y: 8}, {x: 4, y: 8}, {x: 3, y: 8}, {x: 2, y: 8}, {x: 1, y: 8}, {x: 0, y: 8},
  // Left curve (50 to 51)
  {x: 0, y: 7}, {x: 0, y: 6}
];

export const HOME_STRETCH: Record<PlayerColor, Coordinate[]> = {
  [PlayerColor.RED]:    [{x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}],
  [PlayerColor.GREEN]:  [{x: 7, y: 1}, {x: 7, y: 2}, {x: 7, y: 3}, {x: 7, y: 4}, {x: 7, y: 5}],
  [PlayerColor.YELLOW]: [{x: 13, y: 7}, {x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}, {x: 9, y: 7}],
  [PlayerColor.BLUE]:   [{x: 7, y: 13}, {x: 7, y: 12}, {x: 7, y: 11}, {x: 7, y: 10}, {x: 7, y: 9}]
};

export const HOME_CENTER: Coordinate = { x: 7, y: 7 };

export const YARD_POSITIONS: Record<PlayerColor, Coordinate[]> = {
  [PlayerColor.RED]:    [{x: 2, y: 2}, {x: 2, y: 3}, {x: 3, y: 2}, {x: 3, y: 3}],
  [PlayerColor.GREEN]:  [{x: 11, y: 2}, {x: 11, y: 3}, {x: 12, y: 2}, {x: 12, y: 3}],
  [PlayerColor.YELLOW]: [{x: 11, y: 11}, {x: 11, y: 12}, {x: 12, y: 11}, {x: 12, y: 12}],
  [PlayerColor.BLUE]:   [{x: 2, y: 11}, {x: 2, y: 12}, {x: 3, y: 11}, {x: 3, y: 12}]
};
