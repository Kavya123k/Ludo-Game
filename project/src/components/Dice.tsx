import React, { useState, useEffect } from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, disabled }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setDisplayValue(value);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [isRolling, value]);

  const getDiceDots = (num: number) => {
    const dotPositions: { [key: number]: string[] } = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
    };

    return dotPositions[num] || [];
  };

  const getDotPosition = (position: string) => {
    const positions: { [key: string]: string } = {
      'top-left': 'top-2 left-2',
      'top-right': 'top-2 right-2',
      'middle-left': 'top-1/2 left-2 -translate-y-1/2',
      'middle-right': 'top-1/2 right-2 -translate-y-1/2',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'bottom-left': 'bottom-2 left-2',
      'bottom-right': 'bottom-2 right-2',
    };
    return positions[position] || '';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-20 h-20 bg-white border-4 border-gray-800 rounded-xl shadow-lg cursor-pointer transform transition-all duration-200 ${
          isRolling ? 'animate-spin' : 'hover:scale-110'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={!disabled && !isRolling ? onRoll : undefined}
      >
        {getDiceDots(displayValue).map((position, index) => (
          <div
            key={index}
            className={`absolute w-3 h-3 bg-gray-800 rounded-full ${getDotPosition(position)}`}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-gray-600">
        {isRolling ? 'Rolling...' : disabled ? 'Wait your turn' : 'Click to roll'}
      </p>
    </div>
  );
};

export default Dice;