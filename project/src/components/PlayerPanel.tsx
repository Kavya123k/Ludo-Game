import React from 'react';
import { Player } from '../types/game';

interface PlayerPanelProps {
  players: Player[];
  currentPlayer: number;
  winner: number | null;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ players, currentPlayer, winner }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {players.map((player) => {
        const activePieces = player.pieces.filter(p => p.isActive || p.isInGoal).length;
        const goalPieces = player.pieces.filter(p => p.isInGoal).length;
        const isActive = player.id === currentPlayer;
        const hasWon = player.hasWon;

        return (
          <div
            key={player.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              isActive 
                ? 'border-yellow-400 bg-yellow-50 shadow-lg transform scale-105' 
                : 'border-gray-300 bg-white'
            } ${hasWon ? 'bg-green-100 border-green-400' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-700"
                style={{ backgroundColor: player.color }}
              />
              <div className="flex-1">
                <h3 className={`font-bold ${isActive ? 'text-yellow-700' : 'text-gray-700'}`}>
                  {player.name}
                  {hasWon && ' 🏆'}
                  {isActive && !hasWon && ' ⭐'}
                </h3>
                <div className="text-sm text-gray-600">
                  <span>Active: {activePieces}/4</span>
                  <span className="ml-2">Goal: {goalPieces}/4</span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: player.color,
                  width: `${(goalPieces / 4) * 100}%`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerPanel;