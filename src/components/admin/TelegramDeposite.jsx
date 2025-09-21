import React, { useState, useEffect } from "react";
import { ListCollapse } from "lucide-react";
import TelegramApproval from "./TelegramAproval";
import { toast } from "react-toastify";
import axios from "axios";

const Deposite = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isTelegramAOpen, setIsTelegramAOpen] = useState(false);
  const [filterMethod, setFilterMethod] = useState("telegram");

  // Fetch deposit transactions
  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/wallet/history/deposit`
      );
      const data = await res.json();
      setTransactions(data?.data?.deposit || []);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const toggleDetails = (index) => {
    setTransactions((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, showDetails: !t.showDetails } : t
      )
    );
  };

  const fetchChannels = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-channels`
      );
      setChannels(res?.data?.channels || []);
      return true;
    } catch (err) {
      console.error("Fetch channels error:", err);
      toast.error("Failed to fetch Telegram channels.");
      return false;
    }
  };

  const handleApproveClick = async (transaction) => {
    const fetched = await fetchChannels();
    if (!fetched) return;

    setSelectedTransaction(transaction);
    setIsTelegramAOpen(true);
  };

  const filteredTransactions = filterMethod
    ? transactions.filter(
        (t) => t?.method?.toLowerCase() === filterMethod?.toLowerCase()
      )
    : transactions;

  const handleFilterClick = (method) => {
    setFilterMethod((prev) => (prev === method ? "" : method));
  };

  console.log("filteredTransactions", filteredTransactions.slice(0, 5));

  return (
    <div className="md:min-w-lg w-full max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">
        Telegram Subscriptions
      </h2>

      {/* Optional Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleFilterClick("telegram")}
          className={`px-4 py-2 rounded-md ${
            filterMethod === "telegram"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Telegram
        </button>
        <button
          onClick={() => handleFilterClick("crypto")}
          className={`px-4 py-2 rounded-md ${
            filterMethod === "crypto"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Crypto
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-xl text-gray-300">Loading...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No transactions found.
          </div>
        ) : (
          // slice(0, 5)
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="font-semibold text-lg">
                      Amount: {transaction.amount}
                    </span>
                    <span className="text-gray-500">
                      {transaction.details?.gameName}
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
                        transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : transaction.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {transaction.status === "pending" && (
                      <button
                        onClick={() => handleApproveClick(transaction)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        toggleDetails(index), console.log(index);
                      }}
                      className="text-blue-500 hover:underline cursor-pointer"
                      aria-label="Toggle details"
                    >
                      <ListCollapse className="hover:scale-[90%] " />
                    </button>
                  </div>
                </div>
              </div>

              {transaction.showDetails && (
                <div className="p-4 bg-gray-50 text-sm">
                  <h4 className="font-semibold mb-2">Details</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {Object.entries(transaction.details || {}).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong className="capitalize">{key}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}

        {/* Telegram Approval Modal */}
        {selectedTransaction && (
          <TelegramApproval
            fetchTransactionHistory={fetchTransactionHistory}
            channels={channels}
            transaction={selectedTransaction}
            isOpen={isTelegramAOpen}
            onClose={() => {
              setIsTelegramAOpen(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Deposite;

// {
//   transaction.status === "pending" && (
//     <div className="flex mt-2 space-x-4">
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           fetchChannels();
//           setIsTelegramAOpen(true);
//         }}
//         className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//       >
//         <button

//                           onClick={() =>
//                             updateWithdrawalStatus(
//                               transaction._id,
//                               "approved",
//                               transaction.userId,
//                               transaction.amount
//                             )
//                           }
//                           className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                         >
//         Approve
//       </button>
//       <button
//                           onClick={() =>
//                             updateWithdrawalStatus(
//                               transaction._id,
//                               "rejected",
//                               transaction.userId,
//                               transaction.amount
//                             )
//                           }
//                           className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                         >
//                           Reject
//                         </button>
//     </div>
//   );
// }
