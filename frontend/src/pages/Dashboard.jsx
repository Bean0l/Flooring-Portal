import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    if (user.role === 'admin') {
        return <Navigate to="/admin-dashboard" />;
    }

    if (user.role === 'manager') {
        return <Navigate to="/manager-dashboard" />;
    }

    return <Navigate to="/employee-dashboard" />;
}

