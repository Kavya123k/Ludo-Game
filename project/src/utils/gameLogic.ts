import { GamePiece, Player, GameState, BoardPosition } from '../types/game';

export const BOARD_SIZE = 15;
export const SAFE_POSITIONS = [1, 9, 14, 22, 27, 35, 40, 48];
export const START_POSITIONS = { 0: 1, 1: 14, 2: 27, 3: 40 };
export const HOME_POSITIONS = { 0: [51, 52, 53, 54, 55], 1: [56, 57, 58, 59, 60], 2: [61, 62, 63, 64, 65], 3: [66, 67, 68, 69, 70] };

export const createInitialGameState = (): GameState => {
  const playerColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];
  const playerNames = ['Red', 'Blue', 'Green', 'Yellow'];

  const players: Player[] = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    name: playerNames[index],
    color: playerColors[index],
    pieces: Array.from({ length: 4 }, (_, pieceIndex) => ({
      id: `${index}-${pieceIndex}`,
      playerId: index,
      position: -1,
      isInHome: true,
      isInGoal: false,
      isActive: false,
    })),
    isActive: index === 0,
    hasWon: false,
  }));

  return {
    players,
    currentPlayer: 0,
    diceValue: 0,
    isRolling: false,
    gamePhase: 'waiting',
    winner: null,
    moveablePieces: [],
  };
};

export const canMovePiece = (piece: GamePiece, diceValue: number): boolean => {
  if (piece.isInGoal) return false;
  
  if (piece.isInHome) {
    return diceValue === 6;
  }

  const newPosition = piece.position + diceValue;
  const homeStart = Object.values(HOME_POSITIONS)[piece.playerId][0];
  
  if (newPosition >= homeStart && newPosition <= homeStart + 4) {
    return true;
  }
  
  if (newPosition >= 52) {
    return false;
  }

  return true;
};

export const getValidMoves = (player: Player, diceValue: number): string[] => {
  return player.pieces
    .filter(piece => canMovePiece(piece, diceValue))
    .map(piece => piece.id);
};

export const movePiece = (gameState: GameState, pieceId: string): GameState => {
  const newState = { ...gameState };
  const piece = newState.players
    .flatMap(p => p.pieces)
    .find(p => p.id === pieceId);

  if (!piece || !canMovePiece(piece, newState.diceValue)) {
    return gameState;
  }

  if (piece.isInHome) {
    piece.isInHome = false;
    piece.position = START_POSITIONS[piece.playerId as keyof typeof START_POSITIONS];
    piece.isActive = true;
  } else {
    const newPosition = piece.position + newState.diceValue;
    const homePositions = HOME_POSITIONS[piece.playerId as keyof typeof HOME_POSITIONS];
    
    if (newPosition >= homePositions[0] && newPosition <= homePositions[4]) {
      piece.position = newPosition;
      if (newPosition === homePositions[4]) {
        piece.isInGoal = true;
        piece.isActive = false;
      }
    } else if (newPosition >= 52) {
      const overflow = newPosition - 52;
      piece.position = homePositions[overflow];
      if (overflow === 4) {
        piece.isInGoal = true;
        piece.isActive = false;
      }
    } else {
      piece.position = newPosition % 52;
    }
  }

  // Check for captures
  const otherPieces = newState.players
    .flatMap(p => p.pieces)
    .filter(p => p.id !== pieceId && p.position === piece.position && p.isActive);

  otherPieces.forEach(capturedPiece => {
    if (!SAFE_POSITIONS.includes(capturedPiece.position)) {
      capturedPiece.isInHome = true;
      capturedPiece.position = -1;
      capturedPiece.isActive = false;
    }
  });

  // Check for win condition
  const currentPlayer = newState.players[newState.currentPlayer];
  if (currentPlayer.pieces.every(p => p.isInGoal)) {
    currentPlayer.hasWon = true;
    newState.winner = currentPlayer.id;
    newState.gamePhase = 'finished';
  } else {
    // Next turn logic
    if (newState.diceValue !== 6) {
      newState.currentPlayer = (newState.currentPlayer + 1) % 4;
      newState.players.forEach((p, i) => {
        p.isActive = i === newState.currentPlayer;
      });
    }
    newState.gamePhase = 'waiting';
  }

  newState.moveablePieces = [];
  return newState;
};

export const getBoardPositions = (): BoardPosition[] => {
  const positions: BoardPosition[] = [];
  
  // Create the main track positions
  for (let i = 0; i < 52; i++) {
    const angle = (i * 360) / 52;
    const radius = 180;
    const x = Math.cos((angle - 90) * Math.PI / 180) * radius + 300;
    const y = Math.sin((angle - 90) * Math.PI / 180) * radius + 300;
    
    positions.push({
      id: i,
      type: SAFE_POSITIONS.includes(i) ? 'safe' : 'normal',
      coordinates: { x, y },
    });
  }

  // Add home positions
  Object.entries(HOME_POSITIONS).forEach(([playerId, homePositions]) => {
    homePositions.forEach((pos, index) => {
      const playerIndex = parseInt(playerId);
      const homeRadius = 80 + (index * 15);
      const homeAngle = (playerIndex * 90) - 90;
      const x = Math.cos(homeAngle * Math.PI / 180) * homeRadius + 300;
      const y = Math.sin(homeAngle * Math.PI / 180) * homeRadius + 300;
      
      positions.push({
        id: pos,
        type: index === 4 ? 'goal' : 'home',
        color: ['red', 'blue', 'green', 'yellow'][playerIndex],
        coordinates: { x, y },
      });
    });
  });

  return positions;
};