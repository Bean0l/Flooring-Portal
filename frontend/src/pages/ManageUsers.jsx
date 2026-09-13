import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export default function ManageUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setError('');
        try {
            await api.patch(`/users/${userId}/`, { role: newRole });
            fetchUsers();
        } catch (err) {
            setError('Failed to update role.');
        }
    };

    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete ${username}?`)) {
            return;
        }

        setError('');
        try {
            await api.delete(`/users/${userId}/`);
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg">Loading users...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 max-w-3xl">
                    {error}
                </div>
            )}

            {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden max-w-4xl">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-600">{u.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{u.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{u.email || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {u.id === currentUser.id ? (
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {u.role}
                                            </span>
                                        ) : (
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="employee">Employee</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.id === currentUser.id ? (
                                            <span className="text-sm text-gray-400">You</span>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(u.id, u.username)}
                                                className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm transition cursor-pointer border-none font-medium"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

