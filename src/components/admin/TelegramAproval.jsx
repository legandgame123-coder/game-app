import React, { useEffect, useState } from "react";
import axios from "axios";
import { data } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}/my-channels`;

const TelegramApproval = ({ isOpen, onClose, transaction }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [transactions, setTransactions] = useState([]);

  console.log("newChannel", newChannel);
  console.log("res", channels);
  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      console.log("res", res.data.channels);
      setChannels(res.data.channels || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const updateWithdrawalStatus = async (
    transactionId,
    status,
    userId,
    amount,
    channelId
  ) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/wallet/telegram/update-deposite-transaction-status`,
        {
          status,
          id: transactionId,
          userId,
          amount,
          channelId,
        }
      );

      console.log("first", response.data);

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === transactionId
              ? { ...transaction, status }
              : transaction
          )
        );

        alert(response.data.message);
      } else {
        console.log("Failed to update status.");
      }
    } catch (error) {
      alert(error.message);
      console.log("Error updating status:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded p-6 w-full max-w-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
        >
          ×
        </button>

        <h1 className="text-2xl font-bold mb-4">Telegram Channels</h1>

        {channels.length > 0 ? (
          <div className="mb-6">
            <label htmlFor="channelSelect" className="block mb-2 font-medium">
              Select a Channel:
            </label>
            <select
              id="channelSelect"
              className="w-full p-2 border rounded"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
            >
              <option value="">-- Select a channel --</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>No channels found.</p>
        )}
        <div className="flex mt-2 space-x-4">
          <button
            onClick={() =>
              updateWithdrawalStatus(
                transaction._id,
                "approved",
                transaction.userId,
                transaction.amount,
                parseInt(newChannel)
              )
            }
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() =>
              updateWithdrawalStatus(
                transaction._id,
                "rejected",
                transaction.userId,
                transaction.amount,
                parseInt(newChannel)
              )
            }
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramApproval;
