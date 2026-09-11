import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewEstimate from './pages/NewEstimate';
import MyClients from './pages/MyClients';
import ManageServices from './pages/ManageServices';
import ManageUsers from './pages/ManageUsers';
import EstimateHistory from './pages/EstimateHistory';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="employee-dashboard" element={<EmployeeDashboard />} />
                        <Route path="manager-dashboard" element={<ManagerDashboard />} />
                        <Route path="admin-dashboard" element={<AdminDashboard />} />
                        <Route path="new-estimate" element={<NewEstimate />} />
                        <Route path="estimates" element={<EstimateHistory />} />
                        <Route path="my-clients" element={<MyClients />} />
                        <Route path="manage-services" element={<ManageServices />} />
                        <Route path="manage-users" element={<ManageUsers />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

