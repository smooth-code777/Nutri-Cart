import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        diet_preference: 'non-veg',
        health_conditions: []
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const conditionsList = ['Diabetes', 'Hypertension', 'High Cholesterol', 'Heart Disease', 'Allergies'];

    const handleCheckboxChange = (condition) => {
        setFormData(prev => {
            if (prev.health_conditions.includes(condition)) {
                return { ...prev, health_conditions: prev.health_conditions.filter(c => c !== condition) };
            } else {
                return { ...prev, health_conditions: [...prev.health_conditions, condition] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            health_conditions: formData.health_conditions.join(',')
        };
        const res = await register(payload);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                name="username"
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Dietary Preference</label>
                            <select
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.diet_preference}
                                onChange={(e) => setFormData({ ...formData, diet_preference: e.target.value })}
                            >
                                <option value="non-veg">Non-Vegetarian</option>
                                <option value="veg">Vegetarian</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Health Conditions</label>
                            <div className="space-y-2">
                                {conditionsList.map(condition => (
                                    <div key={condition} className="flex items-center">
                                        <input
                                            id={condition}
                                            type="checkbox"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            checked={formData.health_conditions.includes(condition)}
                                            onChange={() => handleCheckboxChange(condition)}
                                        />
                                        <label htmlFor={condition} className="ml-2 block text-sm text-gray-900">
                                            {condition}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
