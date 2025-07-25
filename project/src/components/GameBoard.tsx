import React from 'react';
import { GameState, BoardPosition } from '../types/game';
import { getBoardPositions } from '../utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
  onPieceClick: (pieceId: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onPieceClick }) => {
  const boardPositions = getBoardPositions();

  const getPieceAtPosition = (position: number) => {
    return gameState.players
      .flatMap(player => player.pieces)
      .filter(piece => piece.position === position && piece.isActive);
  };

  const renderPiece = (piece: any, index: number, totalAtPosition: number) => {
    const player = gameState.players[piece.playerId];
    const offset = totalAtPosition > 1 ? (index - (totalAtPosition - 1) / 2) * 8 : 0;
    const isMoveable = gameState.moveablePieces.includes(piece.id);
    
    return (
      <circle
        key={piece.id}
        cx={offset}
        cy={0}
        r="8"
        fill={player.color}
        stroke={isMoveable ? '#FFD700' : '#333'}
        strokeWidth={isMoveable ? "3" : "1"}
        className={`cursor-pointer transition-all duration-200 ${
          isMoveable ? 'animate-pulse' : ''
        }`}
        onClick={() => onPieceClick(piece.id)}
      />
    );
  };

  const renderHomePieces = (playerId: number) => {
    const player = gameState.players[playerId];
    const homePieces = player.pieces.filter(piece => piece.isInHome);
    const homePositions = [
      { x: 100, y: 100 }, { x: 130, y: 100 },
      { x: 100, y: 130 }, { x: 130, y: 130 }
    ];

    return homePieces.map((piece, index) => {
      const pos = homePositions[index];
      const isMoveable = gameState.moveablePieces.includes(piece.id);
      
      return (
        <circle
          key={piece.id}
          cx={pos.x + (playerId % 2) * 370}
          cy={pos.y + Math.floor(playerId / 2) * 370}
          r="12"
          fill={player.color}
          stroke={isMoveable ? '#FFD700' : '#333'}
          strokeWidth={isMoveable ? "3" : "2"}
          className={`cursor-pointer transition-all duration-200 ${
            isMoveable ? 'animate-pulse' : ''
          }`}
          onClick={() => onPieceClick(piece.id)}
        />
      );
    });
  };

  return (
    <div className="flex items-center justify-center">
      <svg width="600" height="600" className="border-4 border-gray-800 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100">
        {/* Board track */}
        {boardPositions.slice(0, 52).map((position) => {
          const piecesAtPosition = getPieceAtPosition(position.id);
          const isSafe = position.type === 'safe';
          const isStart = Object.values({ 0: 1, 1: 14, 2: 27, 3: 40 }).includes(position.id);
          
          return (
            <g key={position.id}>
              <circle
                cx={position.coordinates.x}
                cy={position.coordinates.y}
                r="15"
                fill={isSafe ? '#10B981' : isStart ? '#F59E0B' : '#E5E7EB'}
                stroke="#374151"
                strokeWidth="2"
              />
              {isSafe && (
                <circle
                  cx={position.coordinates.x}
                  cy={position.coordinates.y}
                  r="8"
                  fill="#059669"
                />
              )}
              <g transform={`translate(${position.coordinates.x}, ${position.coordinates.y})`}>
                {piecesAtPosition.map((piece, index) => 
                  renderPiece(piece, index, piecesAtPosition.length)
                )}
              </g>
            </g>
          );
        })}

        {/* Home areas */}
        {[0, 1, 2, 3].map(playerId => {
          const player = gameState.players[playerId];
          const homeX = (playerId % 2) * 370 + 115;
          const homeY = Math.floor(playerId / 2) * 370 + 115;
          
          return (
            <g key={`home-${playerId}`}>
              <rect
                x={homeX - 50}
                y={homeY - 50}
                width="100"
                height="100"
                fill={player.color}
                fillOpacity="0.3"
                stroke={player.color}
                strokeWidth="3"
                rx="10"
              />
              {renderHomePieces(playerId)}
            </g>
          );
        })}

        {/* Goal areas */}
        {boardPositions.slice(52).map((position) => {
          const piecesAtPosition = getPieceAtPosition(position.id);
          
          return (
            <g key={position.id}>
              <circle
                cx={position.coordinates.x}
                cy={position.coordinates.y}
                r="12"
                fill={position.color === 'red' ? '#EF4444' : 
                      position.color === 'blue' ? '#3B82F6' :
                      position.color === 'green' ? '#10B981' : '#F59E0B'}
                fillOpacity="0.7"
                stroke="#374151"
                strokeWidth="2"
              />
              <g transform={`translate(${position.coordinates.x}, ${position.coordinates.y})`}>
                {piecesAtPosition.map((piece, index) => 
                  renderPiece(piece, index, piecesAtPosition.length)
                )}
              </g>
            </g>
          );
        })}

        {/* Center decoration */}
        <circle cx="300" cy="300" r="40" fill="#F59E0B" stroke="#D97706" strokeWidth="3"/>
        <text x="300" y="310" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
          LUDO
        </text>
      </svg>
    </div>
  );
};

export default GameBoard;