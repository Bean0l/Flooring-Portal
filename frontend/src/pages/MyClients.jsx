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
    const [fieldErrors, setFieldErrors] = useState({});

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
        setFieldErrors({});
    };

    const validate = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Client name is required.';
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address.';
        }

        if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            errors.phone = 'Phone must be 10 digits.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

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
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg">Loading clients...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Clients</h2>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 max-w-xl">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-8 max-w-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {editingId ? 'Edit Client' : 'Add New Client'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setFieldErrors({ ...fieldErrors, name: '' });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.name && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setFieldErrors({ ...fieldErrors, phone: '' });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.phone && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldErrors({ ...fieldErrors, email: '' });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.email && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition cursor-pointer border-none font-medium"
                        >
                            {editingId ? 'Update Client' : 'Add Client'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition cursor-pointer border-none font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Client List</h3>
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
            </div>

            {filteredClients.length === 0 ? (
                <p className="text-gray-500">
                    {clients.length === 0
                        ? 'No clients yet. Add one above.'
                        : 'No clients match your search.'}
                </p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Added By</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{client.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{client.phone || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{client.email || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{client.created_by}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(client)}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm transition cursor-pointer border-none font-medium"
                                            >
                                                Edit
                                            </button>
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm transition cursor-pointer border-none font-medium"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
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

