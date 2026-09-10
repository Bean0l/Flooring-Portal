import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user?.username}.</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '200px',
                }}>
                    <h3>All Clients</h3>
                    <p>0 clients</p>
                </div>
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '200px',
                }}>
                    <h3>All Estimates</h3>
                    <p>0 estimates</p>
                </div>
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '200px',
                }}>
                    <h3>Services</h3>
                    <p>0 services</p>
                </div>
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '200px',
                }}>
                    <h3>Users</h3>
                    <p>0 users</p>
                </div>
            </div>
        </div>
    );
}

