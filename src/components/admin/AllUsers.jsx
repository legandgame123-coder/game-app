import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/`); // adjust the endpoint as needed
            setUsers(response.data.users);
            setError(null);
        } catch (err) {
            setError("Failed to fetch users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleonClick = (user) => {
        console.log(user._id)
    }

    if (loading) return <div className="text-center text-xl mt-10">Loading users...</div>;
    if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

    return (
        <div className="mx-auto p-4 text-white max-w-screen overflow-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>
            {users.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
            ) : (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="border border-gray-300 p-2 text-left">Name</th>
                            <th className="border border-gray-300 p-2 text-left">Email</th>
                            <th className="border border-gray-300 p-2 text-left">Role</th>
                            <th className="border border-gray-300 p-2 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-100 hover:text-black cursor-pointer" onClick={() => handleonClick(user)}>
                                <td className="border border-gray-300 p-2">{user.fullName || "N/A"}</td>
                                <td className="border border-gray-300 p-2">{user.email || "N/A"}</td>
                                <td className="border border-gray-300 p-2 capitalize">{user.role || "user"}</td>
                                <td className="border border-gray-300 p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllUsers;
