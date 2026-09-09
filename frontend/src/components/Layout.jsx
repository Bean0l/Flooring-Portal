import { Outlet, useNavigate } from 'react-router-dom';
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
                <h3 style={{ margin: 0 }}>Flooring Portal</h3>
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

