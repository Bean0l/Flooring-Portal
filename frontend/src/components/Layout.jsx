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
        <div className="min-h-screen bg-gray-50">
            <nav className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white shadow-lg">
                <div className="flex items-center gap-6">
                    <Link
                        to="/dashboard"
                        className="text-xl font-bold text-white hover:text-gray-300 no-underline"
                    >
                        Flooring Portal
                    </Link>

                    <Link to="/new-estimate" className="text-gray-300 hover:text-white no-underline text-sm">
                        New Estimate
                    </Link>

                    <Link to="/estimates" className="text-gray-300 hover:text-white no-underline text-sm">
                        Estimates
                    </Link>

                    <Link to="/my-clients" className="text-gray-300 hover:text-white no-underline text-sm">
                        My Clients
                    </Link>

                    {(user?.role === 'manager' || user?.role === 'admin') && (
                        <Link to="/manage-services" className="text-gray-300 hover:text-white no-underline text-sm">
                            Manage Services
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/manage-users" className="text-gray-300 hover:text-white no-underline text-sm">
                            Manage Users
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-300">
                        {user?.username} ({user?.role})
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer border-none"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    );
}

