import { useState } from 'react';

const BettingSection = ({
  selectedBet,
  setSelectedBet,
  betAmount,
  setBetAmount,
  multiplier,
  setMultiplier,
  onPlaceBet,
  disabled
}) => {
  const colorButtons = [
    { color: 'green', label: 'Green', bg: 'bg-green-500', multiplier: '2x' },
    { color: 'violet', label: 'Violet', bg: 'bg-purple-500', multiplier: '4.5x' },
    { color: 'red', label: 'Red', bg: 'bg-red-500', multiplier: '2x' }
  ];

  const numberButtons = [
    { num: 0, color: 'bg-red-500 text-white' },
    { num: 1, color: 'bg-green-500 text-white' },
    { num: 2, color: 'bg-red-500 text-white' },
    { num: 3, color: 'bg-green-500 text-white' },
    { num: 4, color: 'bg-red-500 text-white' },
    { num: 5, color: 'bg-green-500 text-white' },
    { num: 6, color: 'bg-red-500 text-white' },
    { num: 7, color: 'bg-green-500 text-white' },
    { num: 8, color: 'bg-red-500 text-white' },
    { num: 9, color: 'bg-green-500 text-white' }
  ];

  // Correct the color mapping based on game rules
  const getNumberColor = (num) => {
    if ([1, 3, 7, 9].includes(num)) return 'bg-green-500 text-white';
    if ([2, 4, 6, 8].includes(num)) return 'bg-red-500 text-white';
    return 'bg-purple-500 text-white'; // 0, 5
  };

  const multiplierButtons = [1, 5, 10, 50, 100];
  
  const sizeButtons = [
    { size: 'small', label: 'Small', desc: '0-4' },
    { size: 'big', label: 'Big', desc: '5-9' }
  ];

  const handleBetSelect = (type, value) => {
    setSelectedBet({ type, value });
  };

  const isSelected = (type, value) => {
    return selectedBet?.type === type && selectedBet?.value === value;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Color Betting */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Select Color</h3>
        <div className="grid grid-cols-3 gap-2">
          {colorButtons.map(({ color, label, bg, multiplier: mult }) => (
            <button
              key={color}
              onClick={() => handleBetSelect('color', color)}
              className={`${bg} text-white py-3 px-4 rounded-lg font-medium relative transition-all ${
                isSelected('color', color) ? 'ring-2 ring-blue-400 ring-offset-2' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              disabled={disabled}
            >
              <div>{label}</div>
              <div className="text-xs opacity-90">{mult}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Number Betting */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Select Number</h3>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleBetSelect('number', num.toString())}
              className={`${getNumberColor(num)} py-3 px-4 rounded-lg font-bold text-lg transition-all ${
                isSelected('number', num.toString()) ? 'ring-2 ring-blue-400 ring-offset-2' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              disabled={disabled}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Size Betting */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Select Size</h3>
        <div className="grid grid-cols-2 gap-2">
          {sizeButtons.map(({ size, label, desc }) => (
            <button
              key={size}
              onClick={() => handleBetSelect('size', size)}
              className={`border-2 py-3 px-4 rounded-lg font-medium transition-all ${
                isSelected('size', size) 
                  ? 'border-blue-400 bg-blue-50 text-blue-600' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              <div className="font-bold">{label}</div>
              <div className="text-xs opacity-70">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bet Amount */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Bet Amount</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
            className="px-3 py-2 bg-gray-200 rounded-lg font-medium"
            disabled={disabled}
          >
            -
          </button>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 text-center py-2 border border-gray-300 rounded-lg font-medium"
            min="1"
            disabled={disabled}
          />
          <button
            onClick={() => setBetAmount(betAmount + 10)}
            className="px-3 py-2 bg-gray-200 rounded-lg font-medium"
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>

      {/* Multiplier */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Multiplier</h3>
        <div className="flex gap-2">
          {multiplierButtons.map((mult) => (
            <button
              key={mult}
              onClick={() => setMultiplier(mult)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                multiplier === mult
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={disabled}
            >
              x{mult}
            </button>
          ))}
        </div>
      </div>

      {/* Place Bet Button */}
      <button
        onClick={onPlaceBet}
        disabled={!selectedBet || disabled}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          !selectedBet || disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
        }`}
      >
        {disabled 
          ? 'Betting Closed' 
          : selectedBet 
            ? `Place Bet ₹${betAmount * multiplier}`
            : 'Select Your Bet'
        }
      </button>

      {selectedBet && (
        <div className="text-center text-sm text-gray-600">
          Selected: {selectedBet.type} - {selectedBet.value} | Amount: ₹{betAmount * multiplier}
        </div>
      )}
    </div>
  );
};

export default BettingSection;