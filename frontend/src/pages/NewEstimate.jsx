import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NewEstimate() {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedClient, setSelectedClient] = useState('');

    const [currentService, setCurrentService] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');

    const [lineItems, setLineItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({});

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
        const errors = {};

        if (!currentService) {
            errors.service = 'Select a service.';
        }

        if (!currentQuantity) {
            errors.quantity = 'Quantity is required.';
        } else {
            const qty = parseFloat(currentQuantity);
            if (isNaN(qty) || qty <= 0) {
                errors.quantity = 'Quantity must be a positive number.';
            }
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const service = services.find(s => s.id === parseInt(currentService));
        if (!service) return;

        const qty = parseFloat(currentQuantity);
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
        setFieldErrors({});
    };

    const handleRemoveLineItem = (tempId) => {
        setLineItems(lineItems.filter(item => item.tempId !== tempId));
    };

    const runningTotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const handleSave = async () => {
        const errors = {};

        if (!selectedClient) {
            errors.client = 'Select a client.';
        }

        if (lineItems.length === 0) {
            setError('Add at least one line item.');
            setFieldErrors(errors);
            return;
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setSaving(true);
        setError('');
        setFieldErrors({});

        try {
            const estimateRes = await api.post('/estimates/', {
                client: parseInt(selectedClient),
            });
            const estimateId = estimateRes.data.id;

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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">New Estimate</h2>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 max-w-3xl">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl">
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                    value={selectedClient}
                    onChange={(e) => {
                        setSelectedClient(e.target.value);
                        setFieldErrors({ ...fieldErrors, client: '' });
                    }}
                    className={`w-full max-w-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                        fieldErrors.client ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">-- Select a Client --</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
                {fieldErrors.client && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.client}</p>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Line Item</h3>
                <div className="flex flex-wrap gap-4 items-start">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                        <select
                            value={currentService}
                            onChange={(e) => {
                                setCurrentService(e.target.value);
                                setFieldErrors({ ...fieldErrors, service: '' });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                                fieldErrors.service ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">-- Select a Service --</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name} (${service.price_per_unit}/{service.unit_of_measurement})
                                </option>
                            ))}
                        </select>
                        {fieldErrors.service && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.service}</p>
                        )}
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={currentQuantity}
                            onChange={(e) => {
                                setCurrentQuantity(e.target.value);
                                setFieldErrors({ ...fieldErrors, quantity: '' });
                            }}
                            placeholder="e.g. 200"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.quantity ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.quantity && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.quantity}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddLineItem}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition cursor-pointer border-none font-medium mt-6"
                    >
                        Add
                    </button>
                </div>
            </div>

            {lineItems.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6 max-w-3xl">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price/Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Line Total</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {lineItems.map(item => (
                                <tr key={item.tempId} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-800">{item.serviceName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">${item.pricePerUnit.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{item.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">${item.lineTotal.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLineItem(item.tempId)}
                                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm transition cursor-pointer border-none font-medium"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 border-t border-gray-200">
                                <td colSpan="4" className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                                    Estimate Total:
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                    ${runningTotal.toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={saving || lineItems.length === 0 || !selectedClient}
                className={`px-6 py-2.5 rounded-md font-medium text-white border-none transition cursor-pointer ${
                    saving || lineItems.length === 0 || !selectedClient
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {saving ? 'Saving...' : 'Save Estimate'}
            </button>
        </div>
    );
}

