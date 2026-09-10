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
        return <p>Loading services...</p>;
    }

    return (
        <div>
            <h2>Manage Services</h2>

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
                <h3>{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Service Name
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
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Unit Type
                        </label>
                        <select
                            value={unitOfMeasurement}
                            onChange={(e) => setUnitOfMeasurement(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        >
                            <option value="sqft">Square Feet</option>
                            <option value="linft">Linear Feet</option>
                            <option value="unit">Per Unit</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                            Price Per Unit ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={pricePerUnit}
                            onChange={(e) => setPricePerUnit(e.target.value)}
                            required
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
                            {editingId ? 'Update Service' : 'Add Service'}
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

            <h3>Existing Services</h3>
            {services.length === 0 ? (
                <p>No services yet. Add one above.</p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    maxWidth: '800px',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Unit</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Price</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {service.name}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {service.unit_of_measurement}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    ${service.price_per_unit}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <button
                                        onClick={() => handleEdit(service)}
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
                                    <button
                                        onClick={() => handleDelete(service.id)}
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

