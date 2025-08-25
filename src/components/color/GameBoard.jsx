import { useState, useEffect } from 'react';
import GameHeader from './GameHeader';
import BettingSection from './BettingSection';
import HistorySection from './HistorySection';
import { useSocket } from '../../context/SocketContext.jsx';
import { placeBet, getGameHistory, getUserBets } from '../../services/colorAPI.js';
import { useAuth } from '../../context/AuthContext.jsx';

const GameBoard = () => {
  const { currentRound, timeLeft, lastResult } = useSocket();
  const [selectedBet, setSelectedBet] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [gameHistory, setGameHistory] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [activeTab, setActiveTab] = useState('history');
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user._id

  useEffect(() => {
    fetchGameHistory();
    fetchUserBets();
  }, [lastResult]);

  const fetchGameHistory = async () => {
    try {
      const response = await getGameHistory();
      if (response.data.success) {
        setGameHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
    }
  };

  const fetchUserBets = async () => {
    try {
      const response = await getUserBets(userId);
      if (response.data.success) {
        setUserBets(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedBet || !currentRound) {
      alert('Please select a bet and wait for the next round');
      return;
    }

    try {
      const betData = {
        period: currentRound.period,
        betType: selectedBet.type,
        betValue: selectedBet.value,
        amount: betAmount,
        multiplier: multiplier,
        userId: userId
      };

      const response = await placeBet(betData);
      if (response.data.success) {
        alert('Bet placed successfully!');
        setSelectedBet(null);
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-transparent shadow-xl shadow-red-950 min-h-screen">
      <GameHeader 
        period={currentRound?.period || '---'}
        timeLeft={timeLeft}
      />
      
      <BettingSection
        selectedBet={selectedBet}
        setSelectedBet={setSelectedBet}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        onPlaceBet={handlePlaceBet}
        disabled={timeLeft < 10}
      />

      <HistorySection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gameHistory={gameHistory}
        lastResult={lastResult}
        userBets={userBets}
      />
    </div>
  );
};

export default GameBoard;