import { Clock, TrendingUp } from 'lucide-react';

const GameHeader = ({ period, timeLeft }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-400';
    if (timeLeft <= 30) return 'text-yellow-400';
    return 'text-white';
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          <span className="text-lg font-bold">Color Game</span>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-80">Balance</div>
          <div className="text-lg font-bold">₹10,000</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs opacity-80 mb-1">Time to stop</div>
          <div className={`text-xl font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs opacity-80 mb-1">Period</div>
          <div className="text-lg font-bold">
            {period.slice(-6) || '---'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;