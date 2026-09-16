import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'employee',
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    };

    const validate = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required.';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Enter a valid email address.';
        }

        if (!formData.password) {
            errors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password.';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Phone must be 10 digits.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        try {
            const { confirmPassword, ...submitData } = formData;
            await API.post('/users/register/', submitData);
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                const newFieldErrors = {};
                const generalErrors = [];

                Object.entries(data).forEach(([key, value]) => {
                    const message = Array.isArray(value) ? value.join(' ') : value;
                    if (['username', 'email', 'password', 'phone', 'role'].includes(key)) {
                        newFieldErrors[key] = message;
                    } else {
                        generalErrors.push(message);
                    }
                });

                setFieldErrors(prev => ({ ...prev, ...newFieldErrors }));
                if (generalErrors.length > 0) {
                    setError(generalErrors.join(' '));
                }
            } else {
                setError('Registration failed.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.username && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.email && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.password && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {fieldErrors.phone && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition cursor-pointer border-none"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

