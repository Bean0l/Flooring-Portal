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

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Estimates</h2>

            <Link to="/new-estimate">
                <button style={{ marginBottom: '15px' }}>+ New Estimate</button>
            </Link>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {estimates.length === 0 ? (
                <p>No estimates yet.</p>
            ) : (
                <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Status</th>
                            <th>Line Items</th>
                            <th>Total</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimates.map(est => (
                            <tr key={est.id}>
                                <td>
                                    <Link to={`/estimates/${est.id}`}>
                                        #{est.id}
                                    </Link>
                                </td>
                                <td>{est.client_name}</td>
                                <td>{est.status}</td>
                                <td>{est.line_items.length}</td>
                                <td>${parseFloat(est.estimate_total).toFixed(2)}</td>
                                <td>{new Date(est.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

