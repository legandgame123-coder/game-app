import { useState } from "react";
import WithdrawalTabs from "./WithdrawalTabs";
import WithdrawalFormINR from "./WithdrawalFormINR";
import WithdrawalFormUSDT from "./WithdrawalFormUSDT";
import WithdrawalFormETH from "./WithdrawalFormETH";

const WithdrawalContainer = () => {
  const [selectedMethod, setSelectedMethod] = useState("INR");

  return (
    <div className="p-6 bg-zinc-900 text-white min-h-screen flex flex-col items-center">
      <WithdrawalTabs selected={selectedMethod} onSelect={setSelectedMethod} />
      <div className="mt-6">
        {selectedMethod === "INR" && <WithdrawalFormINR />}
        {selectedMethod === "USDT" && <WithdrawalFormUSDT />}
        {selectedMethod === "ETH" && <WithdrawalFormETH />}
      </div>
    </div>
  );
};

export default WithdrawalContainer;
