import React from 'react';
import moment from 'moment';

const TransactionHistory = ({ userBets }) => {
  console.log(userBets)
  const formatTransactionType = (bet) => {
      return (bet.winAmount > 0) ? 'Period Win' : 'Join Period';
  };

  const getAmount = (bet) => {
      return `+${bet.winAmount + bet.amount}`;
  };

  const getAmountStyle = (bet) => {
    return {
      color: bet.winAmount > 0 ? 'green' : 'red',
      fontWeight: 'bold'
    };
  };

  return (
    <div>
      <ul>
        {userBets.map((bet, index) => (
          <li key={bet._id || index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }} className='flex justify-between items-center text-black w-full'>
            <div>
              <p className='font-medium'>{formatTransactionType(bet)}</p>
            <div>{moment(bet?.createdAt).local().format('YYYY-MM-DD hh:mm A')}</div>
            </div>
            <div style={getAmountStyle(bet)}>{getAmount(bet)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;