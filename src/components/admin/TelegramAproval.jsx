import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TelegramApproval = ({
  isOpen,
  onClose,
  transaction,
  channels,
  fetchTransactionHistory,
}) => {
  const [newChannel, setNewChannel] = useState("");
  const [loading, setLoading] = useState(false);

  const updateWithdrawalStatus = async (status) => {
    if (!transaction?._id) {
      toast.error("Transaction data missing.");
      return;
    }

    if (!newChannel) {
      toast.error("Please select a channel before continuing.");
      return;
    }

    const channelId = parseInt(newChannel, 10);
    if (isNaN(channelId)) {
      toast.error("Invalid channel ID.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/wallet/telegram/update-deposite-transaction-status`,
        {
          status: status,
          id: transaction._id,
          userId: transaction?.userId,
          amount: transaction?.amount,
          channelId: channelId,
        }
      );
      await fetchTransactionHistory();
      console.log(response);
      console.log("first ========");
      toast.success(response.data.message || "Status updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message || error.message || "Update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // Prevent modal from rendering when closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)] flex justify-center items-center z-50">
      <div className="bg-white text-black rounded p-6 w-full max-w-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3.5 cursor-pointer text-red-500 hover:text-red-700 text-xl font-bold"
        >
          ×
        </button>

        <h1 className="text-2xl font-bold mb-4">Telegram Channels</h1>

        {channels && channels.length > 0 ? (
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
            onClick={() => updateWithdrawalStatus("approved")}
            disabled={!newChannel || loading}
            className={`px-4 py-2 rounded-md text-white ${
              !newChannel || loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
          <button
            onClick={() => updateWithdrawalStatus("rejected")}
            disabled={!newChannel || loading}
            className={`px-4 py-2 rounded-md text-white ${
              !newChannel || loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramApproval;
