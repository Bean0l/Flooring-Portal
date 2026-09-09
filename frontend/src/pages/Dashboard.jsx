import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.username}. You are logged in as {user?.role}.</p>
        </div>
    );
}