import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('sqft');
    const [pricePerUnit, setPricePerUnit] = useState('');

    const [editingId, setEditingId] = useState(null);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services/');
            setServices(response.data);
        } catch (err) {
            setError('Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setUnitOfMeasurement('sqft');
        setPricePerUnit('');
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            name,
            description,
            unit_of_measurement: unitOfMeasurement,
            price_per_unit: pricePerUnit,
        };

        try {
            if (editingId) {
                await api.put(`/services/${editingId}/`, payload);
            } else {
                await api.post('/services/', payload);
            }
            resetForm();
            fetchServices();
        } catch (err) {
            setError('Failed to save service. Check your inputs.');
        }
    };

    const handleEdit = (service) => {
        setName(service.name);
        setDescription(service.description);
        setUnitOfMeasurement(service.unit_of_measurement);
        setPricePerUnit(service.price_per_unit);
        setEditingId(service.id);
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await api.delete(`/services/${id}/`);
            fetchServices();
        } catch (err) {
            setError('Failed to delete service.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg">Loading services...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Services</h2>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 max-w-xl">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-8 max-w-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {editingId ? 'Edit Service' : 'Add New Service'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Type
                        </label>
                        <select
                            value={unitOfMeasurement}
                            onChange={(e) => setUnitOfMeasurement(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="sqft">Square Feet</option>
                            <option value="linft">Linear Feet</option>
                            <option value="unit">Per Unit</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Per Unit ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={pricePerUnit}
                            onChange={(e) => setPricePerUnit(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition cursor-pointer border-none font-medium"
                        >
                            {editingId ? 'Update Service' : 'Add Service'}
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

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Services</h3>

            {services.length === 0 ? (
                <p className="text-gray-500">No services yet. Add one above.</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-800">{service.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{service.unit_of_measurement}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">${service.price_per_unit}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm transition cursor-pointer border-none font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm transition cursor-pointer border-none font-medium"
                                            >
                                                Delete
                                            </button>
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

