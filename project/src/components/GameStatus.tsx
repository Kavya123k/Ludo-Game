import React from 'react';
import { GameState } from '../types/game';
import { Trophy, Clock, Dice6 } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState;
  onNewGame: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState, onNewGame }) => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  if (gameState.winner !== null) {
    const winner = gameState.players[gameState.winner];
    return (
      <div className="text-center p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">Game Over!</h2>
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <p className="text-xl text-white mb-4">
          <span style={{ color: winner.color }} className="font-bold bg-white px-2 py-1 rounded">
            {winner.name}
          </span>
          <span className="ml-2">Wins! 🎉</span>
        </p>
        <button
          onClick={onNewGame}
          className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          New Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-white rounded-xl shadow-md border-2 border-gray-200 mb-6">
      <div className="flex items-center justify-center space-x-3 mb-3">
        <Clock className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Current Turn</h2>
      </div>
      
      <div className="flex items-center justify-center space-x-3">
        <div
          className="w-4 h-4 rounded-full border-2 border-gray-700"
          style={{ backgroundColor: currentPlayer.color }}
        />
        <span className="text-xl font-bold" style={{ color: currentPlayer.color }}>
          {currentPlayer.name}
        </span>
      </div>
      
      {gameState.diceValue > 0 && (
        <div className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-600">
          <Dice6 className="w-4 h-4" />
          <span>Rolled: {gameState.diceValue}</span>
        </div>
      )}
      
      <div className="mt-3 text-sm text-gray-500">
        {gameState.gamePhase === 'waiting' && 'Roll the dice to start your turn'}
        {gameState.gamePhase === 'rolling' && 'Rolling dice...'}
        {gameState.gamePhase === 'moving' && gameState.moveablePieces.length > 0 && 'Select a piece to move'}
        {gameState.gamePhase === 'moving' && gameState.moveablePieces.length === 0 && 'No valid moves available'}
      </div>
    </div>
  );
};

export default GameStatus;