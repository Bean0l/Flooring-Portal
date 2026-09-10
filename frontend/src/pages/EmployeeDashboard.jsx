import { useAuth } from '../contexts/AuthContext';

export default function EmployeeDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h2>Employee Dashboard</h2>
            <p>Welcome, {user?.username}.</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '200px',
                }}>
                    <h3>My Clients</h3>
                    <p>0 clients</p>
                </div>
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '200px',
                }}>
                    <h3>My Estimates</h3>
                    <p>0 estimates</p>
                </div>
            </div>
        </div>
    );
}

