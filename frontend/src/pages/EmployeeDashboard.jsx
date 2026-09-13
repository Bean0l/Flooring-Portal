import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Employee Dashboard</h2>
            <p className="text-gray-500 mb-6">Welcome, {user?.username}.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                <Link to="/my-clients" className="no-underline">
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">My Clients</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">View All</p>
                    </div>
                </Link>

                <Link to="/estimates" className="no-underline">
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">My Estimates</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">View All</p>
                    </div>
                </Link>

                <Link to="/new-estimate" className="no-underline">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600 hover:shadow-md transition">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Action</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">+ New Estimate</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

