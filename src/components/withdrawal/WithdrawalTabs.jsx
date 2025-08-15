const methods = ["INR", "USDT", "ETH"];

const WithdrawalTabs = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-4 border-b border-zinc-700">
      {methods.map((method) => (
        <button
          key={method}
          onClick={() => onSelect(method)}
          className={`py-2 px-4 font-semibold transition ${
            selected === method
              ? "border-b-2 border-white text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {method}
        </button>
      ))}
    </div>
  );
};

export default WithdrawalTabs;
