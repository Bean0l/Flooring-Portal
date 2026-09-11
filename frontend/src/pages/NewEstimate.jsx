import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NewEstimate() {
    const navigate = useNavigate();

    // Data fetched on mount
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);

    // Estimate header
    const [selectedClient, setSelectedClient] = useState('');

    // Line item builder inputs
    const [currentService, setCurrentService] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');

    // Local line items array (not saved to backend yet)
    const [lineItems, setLineItems] = useState([]);

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes, servicesRes] = await Promise.all([
                    api.get('/clients/'),
                    api.get('/services/'),
                ]);
                setClients(clientsRes.data);
                setServices(servicesRes.data);
            } catch (err) {
                setError('Failed to load clients or services.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddLineItem = () => {
        if (!currentService || !currentQuantity) {
            setError('Select a service and enter a quantity.');
            return;
        }

        const qty = parseFloat(currentQuantity);
        if (isNaN(qty) || qty <= 0) {
            setError('Quantity must be a positive number.');
            return;
        }

        const service = services.find(s => s.id === parseInt(currentService));
        if (!service) return;

        const lineTotal = qty * parseFloat(service.price_per_unit);

        setLineItems([
            ...lineItems,
            {
                tempId: Date.now(),
                serviceId: service.id,
                serviceName: service.name,
                unit: service.unit_of_measurement,
                pricePerUnit: parseFloat(service.price_per_unit),
                quantity: qty,
                lineTotal: lineTotal,
            },
        ]);

        setCurrentService('');
        setCurrentQuantity('');
        setError('');
    };

    const handleRemoveLineItem = (tempId) => {
        setLineItems(lineItems.filter(item => item.tempId !== tempId));
    };

    const runningTotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const handleSave = async () => {
        if (!selectedClient) {
            setError('Select a client.');
            return;
        }
        if (lineItems.length === 0) {
            setError('Add at least one line item.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Phase 1: Create the estimate header
            const estimateRes = await api.post('/estimates/', {
                client: parseInt(selectedClient),
            });
            const estimateId = estimateRes.data.id;

            // Phase 2: Add each line item to the estimate
            for (const item of lineItems) {
                await api.post(`/estimates/${estimateId}/line-items/`, {
                    service: item.serviceId,
                    quantity: item.quantity,
                });
            }

            navigate('/estimates');
        } catch (err) {
            setError('Failed to save estimate. Check your inputs.');
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>New Estimate</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '20px' }}>
                <label>Client: </label>
                <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                >
                    <option value="">-- Select a Client --</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
                <h3>Add Line Item</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div>
                        <label>Service: </label>
                        <select
                            value={currentService}
                            onChange={(e) => setCurrentService(e.target.value)}
                        >
                            <option value="">-- Select a Service --</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name} (${service.price_per_unit}/{service.unit_of_measurement})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Quantity: </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={currentQuantity}
                            onChange={(e) => setCurrentQuantity(e.target.value)}
                            placeholder="e.g. 200"
                        />
                    </div>
                    <button type="button" onClick={handleAddLineItem}>
                        Add
                    </button>
                </div>
            </div>

            {lineItems.length > 0 && (
                <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Unit</th>
                            <th>Price/Unit</th>
                            <th>Quantity</th>
                            <th>Line Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map(item => (
                            <tr key={item.tempId}>
                                <td>{item.serviceName}</td>
                                <td>{item.unit}</td>
                                <td>${item.pricePerUnit.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${item.lineTotal.toFixed(2)}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLineItem(item.tempId)}
                                        style={{ color: 'red' }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Estimate Total:
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                                ${runningTotal.toFixed(2)}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            )}

            <button
                onClick={handleSave}
                disabled={saving || lineItems.length === 0 || !selectedClient}
                style={{ padding: '10px 20px', fontSize: '16px' }}
            >
                {saving ? 'Saving...' : 'Save Estimate'}
            </button>
        </div>
    );
}

