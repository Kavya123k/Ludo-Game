export interface Position {
  x: number;
  y: number;
}

export interface GamePiece {
  id: string;
  playerId: number;
  position: number;
  isInHome: boolean;
  isInGoal: boolean;
  isActive: boolean;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  pieces: GamePiece[];
  isActive: boolean;
  hasWon: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  diceValue: number;
  isRolling: boolean;
  gamePhase: 'waiting' | 'rolling' | 'moving' | 'finished';
  winner: number | null;
  moveablePieces: string[];
}

export interface BoardPosition {
  id: number;
  type: 'normal' | 'safe' | 'start' | 'home' | 'goal';
  color?: string;
  coordinates: Position;
}