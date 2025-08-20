import { useEffect, useState } from 'react';
import TransactionHistory from './TransactionHistory';

const HistorySection = ({ activeTab, setActiveTab, liveBets, userBets }) => {
  const tabs = [
    { id: 'bets', label: 'All Bets' },
    { id: 'my', label: 'My History' },
    { id: 'top', label: 'Top' }
  ];
  const [sortedBets, setSortedBets] = useState([])
  // console.log(liveBets)

  useEffect(() => {
    setSortedBets([...liveBets].sort((a, b) => b.betAmount - a.betAmount))
  }, [liveBets])

  return (
    <div className="bg-white border-t w-full text-black">
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'bets' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 pb-2 border-b">
              <div>User</div>
              <div className="text-center">Bet Amount</div>
              <div className="text-center">Cashed Out</div>
            </div>

            {liveBets.map((bet, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 py-2 hover:bg-gray-50 rounded">
                <div className="text-sm font-medium">
                  {bet.userId}
                </div>
                <div className="text-sm font-medium">
                  {bet.amount}
                </div>
                <div className="text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium`}>
                    {bet.cashedOut ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}

            {liveBets.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No Bets available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'top' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 pb-2 border-b">
              <div>User</div>
              <div className="text-center">Bet Amount</div>
              <div className="text-center">Cashed Out</div>
            </div>

            {sortedBets.map((bet, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 py-2 hover:bg-gray-50 rounded">
                <div className="text-sm font-medium">
                  {bet.userId}
                  {console.log(bet, "adfdsfsakmk")}
                </div>
                <div className="text-sm font-medium">
                  {bet.amount}
                </div>
                <div className="text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium`}>
                    {bet.cashedOut ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}

            {sortedBets.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No Bets available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div>
            <TransactionHistory userBets={userBets} />
            {
              userBets.length === 0 && <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">👤</div>
                <div>My betting history</div>
                <div className="text-sm mt-2">Login to view your bets</div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySection;