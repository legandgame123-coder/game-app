import { useState } from 'react';

const HistorySection = ({ activeTab, setActiveTab, gameHistory, lastResult }) => {
  const tabs = [
    { id: 'history', label: 'Game History' },
    { id: 'chart', label: 'Chart' },
    { id: 'my', label: 'My History' }
  ];

  const getResultColor = (number) => {
    if ([1, 3, 7, 9].includes(number)) return 'text-green-600';
    if ([2, 4, 6, 8].includes(number)) return 'text-red-600';
    return 'text-purple-600';
  };

  const getResultBg = (number) => {
    if ([1, 3, 7, 9].includes(number)) return 'bg-green-100';
    if ([2, 4, 6, 8].includes(number)) return 'bg-red-100';
    return 'bg-purple-100';
  };

  const formatPeriod = (period) => {
    return period ? period.slice(-6) : '---';
  };

  return (
    <div className="bg-white border-t">
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
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
        {activeTab === 'history' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 pb-2 border-b">
              <div>Period</div>
              <div className="text-center">Number</div>
              <div className="text-center">Result</div>
            </div>
            
            {lastResult && (
              <div className="grid grid-cols-3 gap-4 py-2 bg-yellow-50 rounded-lg animate-pulse">
                <div className="text-sm font-medium">
                  {formatPeriod(lastResult.period)}
                </div>
                <div className="text-center">
                  <span className={`inline-block w-8 h-8 rounded-full text-white font-bold text-sm leading-8 ${
                    [1, 3, 7, 9].includes(lastResult.winningNumber) ? 'bg-green-500' :
                    [2, 4, 6, 8].includes(lastResult.winningNumber) ? 'bg-red-500' : 'bg-purple-500'
                  }`}>
                    {lastResult.winningNumber}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getResultBg(lastResult.winningNumber)} ${getResultColor(lastResult.winningNumber)}`}>
                    {lastResult.size.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {gameHistory.map((round) => (
              <div key={round._id} className="grid grid-cols-3 gap-4 py-2 hover:bg-gray-50 rounded">
                <div className="text-sm font-medium">
                  {formatPeriod(round.period)}
                </div>
                <div className="text-center">
                  <span className={`inline-block w-8 h-8 rounded-full text-white font-bold text-sm leading-8 ${
                    [1, 3, 7, 9].includes(round.winningNumber) ? 'bg-green-500' :
                    [2, 4, 6, 8].includes(round.winningNumber) ? 'bg-red-500' : 'bg-purple-500'
                  }`}>
                    {round.winningNumber}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getResultBg(round.winningNumber)} ${getResultColor(round.winningNumber)}`}>
                    {round.size.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}

            {gameHistory.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No game history available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📊</div>
            <div>Chart view coming soon</div>
          </div>
        )}

        {activeTab === 'my' && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">👤</div>
            <div>My betting history</div>
            <div className="text-sm mt-2">Login to view your bets</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySection;