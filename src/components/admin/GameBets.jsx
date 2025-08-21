import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const GameBets = ({ userId }) => {
  const [userBets, setUserBets] = useState([]);  
  const [selectedGameType, setSelectedGameType] = useState('aviator');  // Default to "aviator"
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);

  const fetchUserBets = async (gameType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/game-history/${userId}/${gameType}`);
      setUserBets(response.data.data || []);  // Ensure response.data contains the data field
    } catch (err) {
      setError('Failed to fetch data');
      console.error('API Error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const formatTransactionType = (bet) => bet.payoutAmount > 0 ? 'Period Win' : 'Join Period';

  const getAmount = (bet) => {
  // Format the amount with two decimal places
  const amount = bet.payoutAmount > 0 ? bet.payoutAmount : bet.betAmount;
  return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)}`;
};


  const getAmountStyle = (bet) => ({
    color: bet.payoutAmount > 0 ? 'green' : 'red',
    fontWeight: 'bold',
  });

  useEffect(() => {
    fetchUserBets(selectedGameType);
  }, [selectedGameType]);

  return (
    <div className="transaction-history text-white flex flex-col gap-8">
      <div className="game-type-selector flex gap-8">
        <label htmlFor="gameType">Select Game Type: </label>
        <select
          id="gameType"
          value={selectedGameType}
          onChange={(e) => setSelectedGameType(e.target.value)}
          className='bg-gray-800'
        >
          <option value="aviator">aviator</option>
          <option value="mining">mining</option>
          <option value="chicken">chicken</option>
          <option value="color">color</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {userBets.map((bet, index) => (
            bet ? (
              <li
                key={bet._id || index}
                style={{
                  marginBottom: '10px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '10px',
                }}
                className="flex justify-between items-center text-white w-full"
              >
                <div>
                  <p className="font-medium">{formatTransactionType(bet)}</p>
                  <div>{moment(bet?.createdAt).local().format('YYYY-MM-DD hh:mm A')}</div>
                </div>
                <div style={getAmountStyle(bet)}>{getAmount(bet)}</div>
              </li>
            ) : null
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameBets;