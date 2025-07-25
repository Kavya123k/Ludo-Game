import React, { useState, useCallback } from 'react';
import { GameState } from './types/game';
import { createInitialGameState, getValidMoves, movePiece } from './utils/gameLogic';
import GameBoard from './components/GameBoard';
import PlayerPanel from './components/PlayerPanel';
import GameStatus from './components/GameStatus';
import Dice from './components/Dice';
import { Gamepad2, RotateCcw } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleDiceRoll = useCallback(() => {
    if (gameState.gamePhase !== 'waiting' || gameState.isRolling) return;

    setGameState(prevState => ({
      ...prevState,
      isRolling: true,
      gamePhase: 'rolling'
    }));

    // Simulate dice roll with animation
    setTimeout(() => {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = gameState.players[gameState.currentPlayer];
      const validMoves = getValidMoves(currentPlayer, diceValue);

      setGameState(prevState => ({
        ...prevState,
        diceValue,
        isRolling: false,
        gamePhase: validMoves.length > 0 ? 'moving' : 'waiting',
        moveablePieces: validMoves,
        currentPlayer: validMoves.length === 0 && diceValue !== 6 
          ? (prevState.currentPlayer + 1) % 4 
          : prevState.currentPlayer,
        players: validMoves.length === 0 && diceValue !== 6
          ? prevState.players.map((p, i) => ({
              ...p,
              isActive: i === (prevState.currentPlayer + 1) % 4
            }))
          : prevState.players
      }));
    }, 1000);
  }, [gameState.gamePhase, gameState.isRolling, gameState.players, gameState.currentPlayer]);

  const handlePieceClick = useCallback((pieceId: string) => {
    if (gameState.gamePhase !== 'moving' || !gameState.moveablePieces.includes(pieceId)) {
      return;
    }

    const newGameState = movePiece(gameState, pieceId);
    setGameState(newGameState);
  }, [gameState]);

  const handleNewGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const canRoll = gameState.gamePhase === 'waiting' && !gameState.isRolling && !currentPlayer.hasWon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ludo Master
            </h1>
            <Gamepad2 className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg">Classic board game for 4 players</p>
        </header>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Panel - Game Controls */}
            <div className="xl:col-span-1 space-y-6">
              <GameStatus gameState={gameState} onNewGame={handleNewGame} />
              
              <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Game Controls
                </h3>
                <div className="flex flex-col items-center space-y-4">
                  <Dice
                    value={gameState.diceValue}
                    isRolling={gameState.isRolling}
                    onRoll={handleDiceRoll}
                    disabled={!canRoll}
                  />
                  <button
                    onClick={handleNewGame}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New Game</span>
                  </button>
                </div>
              </div>

              <PlayerPanel
                players={gameState.players}
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
              />
            </div>

            {/* Center Panel - Game Board */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                <GameBoard gameState={gameState} onPieceClick={handlePieceClick} />
              </div>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Basic Rules:</h4>
              <ul className="space-y-1">
                <li>• Roll 6 to move pieces out of home</li>
                <li>• Move pieces clockwise around the board</li>
                <li>• Land on opponents to send them home</li>
                <li>• Safe squares (green) protect your pieces</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Winning:</h4>
              <ul className="space-y-1">
                <li>• Get all 4 pieces to the center goal</li>
                <li>• Roll 6 to get an extra turn</li>
                <li>• First player to finish wins!</li>
                <li>• Yellow squares indicate starting positions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React & TypeScript • Enjoy the classic Ludo experience!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;