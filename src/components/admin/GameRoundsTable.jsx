import React, { useEffect, useState } from "react";
import axios from "axios";

const GameRoundsTable = () => {
  const [rounds, setRounds] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedRound, setEditedRound] = useState({});
  const [formData, setFormData] = useState({
    gameType: "chicken",
    multipliers: "1.02,1.1,1.25,1.5,2,0",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch game rounds
  const fetchRounds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/telegram/game-rounds`);
      setRounds(res.data.data || []);
    } catch (err) {
      console.error("Error fetching rounds:", err);
      alert("❌ Failed to fetch game rounds");
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRound({ ...rounds[index] });
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedRound({});
  };

  const handleInputChange = (field, value) => {
    setEditedRound((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/telegram/update-round/${editedRound._id}`, editedRound);
      setEditIndex(null);
      fetchRounds();
      alert("✅ Round updated successfully");
    } catch (err) {
      console.error("Error saving round:", err);
      alert("❌ Failed to update round");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this round?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/telegram/delete-round/${id}`);
      fetchRounds();
      alert("🗑️ Round deleted successfully");
    } catch (err) {
      console.error("Error deleting round:", err);
      alert("❌ Failed to delete round");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      multipliers: formData.multipliers.split(",").map(Number),
    };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/telegram/round`, payload);
      setShowModal(false);
      fetchRounds();
      setFormData({ gameType: "chicken", multipliers: "", startTime: "", endTime: "" });
    } catch (err) {
      console.error("Failed to add game round", err);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">🎮 Game Rounds</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Add New Game Round
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Game Type</th>
              <th className="p-2 text-left">Multipliers</th>
              <th className="p-2 text-left">Start Time</th>
              <th className="p-2 text-left">End Time</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
              <tr key={round._id} className="border-t border-gray-600">
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      value={editedRound.gameType}
                      onChange={(e) => handleInputChange("gameType", e.target.value)}
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    round.gameType
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      value={editedRound.multipliers.join(",")}
                      onChange={(e) =>
                        handleInputChange("multipliers", e.target.value.split(",").map(Number))
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    round.multipliers.join(", ")
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="datetime-local"
                      value={new Date(editedRound.startTime).toLocaleString("sv-SE", {
                        timeZone: "Asia/Kolkata"
                      }).replace(" ", "T")}

                      onChange={(e) => handleInputChange("startTime", new Date(e.target.value).toISOString())}
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    new Date(round.startTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="datetime-local"
                      vvalue={new Date(editedRound.endTime).toLocaleString("sv-SE", {
                        timeZone: "Asia/Kolkata"
                      }).replace(" ", "T")}

                      onChange={(e) => handleInputChange("endTime", new Date(e.target.value).toISOString())}
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    new Date(round.endTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">{round.status}</td>
                <td className="p-2 text-center">
                  {editIndex === index ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(round._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {rounds.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No game rounds found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-bold text-white mb-2">Add Game Round</h3>

            <input
              type="text"
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              placeholder="Game Type (e.g. chicken)"
              required
            />
            <input
              type="text"
              name="multipliers"
              value={formData.multipliers}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              placeholder="Multipliers (comma separated)"
              required
            />
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameRoundsTable;
