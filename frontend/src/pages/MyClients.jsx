import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export default function MyClients() {
    const { user } = useAuth();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [editingId, setEditingId] = useState(null);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients/');
            setClients(response.data);
        } catch (err) {
            setError('Failed to load clients.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const resetForm = () => {
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = { name, phone, email, address };

        try {
            if (editingId) {
                await api.put(`/clients/${editingId}/`, payload);
            } else {
                await api.post('/clients/', payload);
            }
            resetForm();
            fetchClients();
        } catch (err) {
            setError('Failed to save client. Check your inputs.');
        }
    };

    const handleEdit = (client) => {
        setName(client.name);
        setPhone(client.phone);
        setEmail(client.email);
        setAddress(client.address);
        setEditingId(client.id);
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client?')) {
            return;
        }

        try {
            await api.delete(`/clients/${id}/`);
            fetchClients();
        } catch (err) {
            setError('Failed to delete client.');
        }
    };

    const filteredClients = clients.filter((client) => {
        const term = searchTerm.toLowerCase();
        return (
            client.name.toLowerCase().includes(term) ||
            client.phone.toLowerCase().includes(term) ||
            client.email.toLowerCase().includes(term) ||
            client.address.toLowerCase().includes(term)
        );
    });

    const canDelete = user?.role === 'manager' || user?.role === 'admin';

    if (loading) {
        return <p>Loading clients...</p>;
    }

    return (
        <div>
            <h2>My Clients</h2>

            {error && (
                <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
            )}

            <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px',
                maxWidth: '500px',
            }}>
                <h3>{editingId ? 'Edit Client' : 'Add New Client'}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Client Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Phone
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            {editingId ? 'Update Client' : 'Add Client'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#888',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h3>Client List</h3>

            <div style={{ marginBottom: '15px', maxWidth: '400px' }}>
                <input
                    type="text"
                    placeholder="Search by name, phone, email, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            {filteredClients.length === 0 ? (
                <p>
                    {clients.length === 0
                        ? 'No clients yet. Add one above.'
                        : 'No clients match your search.'}
                </p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Phone</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Email</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Added By</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client) => (
                            <tr key={client.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {client.name}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {client.phone || '-'}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {client.email || '-'}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {client.created_by}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <button
                                        onClick={() => handleEdit(client)}
                                        style={{
                                            padding: '4px 10px',
                                            marginRight: '8px',
                                            backgroundColor: '#2196F3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(client.id)}
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

