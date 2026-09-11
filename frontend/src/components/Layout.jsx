import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h3 style={{ margin: 0 }}>
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                            Flooring Portal
                        </Link>
                    </h3>

                    <Link to="/new-estimate" style={{ color: '#ccc', textDecoration: 'none' }}>
                        New Estimate
                    </Link>

                    <Link to="/estimates" style={{ color: '#ccc', textDecoration: 'none' }}>
                        Estimates
                    </Link>

                    <Link to="/my-clients" style={{ color: '#ccc', textDecoration: 'none' }}>
                        My Clients
                    </Link>

                    {(user?.role === 'manager' || user?.role === 'admin') && (
                        <Link to="/manage-services" style={{ color: '#ccc', textDecoration: 'none' }}>
                            Manage Services
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/manage-users" style={{ color: '#ccc', textDecoration: 'none' }}>
                            Manage Users
                        </Link>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>{user?.username} ({user?.role})</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
}

