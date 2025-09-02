import React, { useEffect, useState } from "react";
import axios from "axios";

const ACCESS_OPTIONS = [
  "transaction",
  "games",
  "withdraw-requests",
  "telegram",
  "admin-management",
  "qr-code",
];

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedAdmin, setEditedAdmin] = useState({});

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/get-admin`
      );
      setAdmins(res.data.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedAdmin({ ...admins[index] });
  };

  // Save edited admin
  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/update-admin`,
        editedAdmin
      );
      setEditIndex(null);
      fetchAdmins();
      alert("✅ Admin updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update admin.");
    }
  };

  // Delete admin
  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/delete-admin`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: { email },
        }
      );
      fetchAdmins();
      alert("🗑️ Admin deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to delete admin.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Existing Admins</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Access Pages</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin._id} className="border-t border-gray-600">
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedAdmin.fullName}
                      onChange={(e) =>
                        setEditedAdmin({
                          ...editedAdmin,
                          fullName: e.target.value,
                        })
                      }
                      className="bg-gray-900 text-white p-1 rounded w-full"
                    />
                  ) : (
                    admin.fullName
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="email"
                      value={editedAdmin.email}
                      onChange={(e) =>
                        setEditedAdmin({
                          ...editedAdmin,
                          email: e.target.value,
                        })
                      }
                      className="bg-gray-900 text-white p-1 rounded w-full"
                    />
                  ) : (
                    admin.email
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedAdmin.phoneNumber}
                      onChange={(e) =>
                        setEditedAdmin({
                          ...editedAdmin,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="bg-gray-900 text-white p-1 rounded w-full"
                    />
                  ) : (
                    admin.phoneNumber
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <div className="flex flex-wrap gap-2">
                      {ACCESS_OPTIONS.map((page) => {
                        const isActive =
                          editedAdmin.accessPages?.includes(page);
                        return (
                          <button
                            key={page}
                            type="button"
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              isActive
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300"
                            }`}
                            onClick={() => {
                              const currentAccess =
                                editedAdmin.accessPages || [];
                              const updatedAccess = isActive
                                ? currentAccess.filter((p) => p !== page)
                                : [...currentAccess, page];

                              setEditedAdmin({
                                ...editedAdmin,
                                accessPages: updatedAccess,
                              });
                            }}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {admin.accessPages?.map((page) => (
                        <span
                          key={page}
                          className="bg-blue-700 text-white px-2 py-1 rounded"
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-2 text-center">
                  {editIndex === index ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(admin.email)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-400">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
