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
        return <p>Loading users...</p>;
    }

    return (
        <div>
            <h2>Manage Users</h2>

            {error && (
                <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
            )}

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    maxWidth: '800px',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>ID</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Username</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Email</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Role</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {u.id}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {u.username}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {u.email || '-'}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {u.id === currentUser.id ? (
                                        <span>{u.role}</span>
                                    ) : (
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="manager">Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {u.id === currentUser.id ? (
                                        <span style={{ color: '#999' }}>You</span>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(u.id, u.username)}
                                            style={{
                                                padding: '4px 10px',
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

