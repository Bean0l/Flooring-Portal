import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function EstimateHistory() {
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEstimates = async () => {
        try {
            const response = await api.get('/estimates/');
            setEstimates(response.data);
        } catch (err) {
            setError('Failed to load estimates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstimates();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg">Loading estimates...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Estimates</h2>
                <Link
                    to="/new-estimate"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition no-underline font-medium text-sm"
                >
                    + New Estimate
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {estimates.length === 0 ? (
                <p className="text-gray-500">No estimates yet.</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Line Items</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {estimates.map(est => (
                                <tr key={est.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm">
                                        <Link to={`/estimates/${est.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                            #{est.id}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{est.client_name}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            est.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : est.status === 'sent'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {est.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{est.line_items.length}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">${parseFloat(est.estimate_total).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(est.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

