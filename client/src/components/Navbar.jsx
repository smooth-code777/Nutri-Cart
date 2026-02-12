import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-green-600">NutriCart</Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-700 hover:text-green-600">Admin</Link>
                                )}
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User size={18} />
                                    <span>{user.username}</span>
                                </div>
                                <button onClick={handleLogout} className="text-gray-700 hover:text-red-500 flex items-center">
                                    <LogOut size={18} className="mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
                                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Register</Link>
                            </>
                        )}

                        {user && user.role !== 'admin' && (
                            <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
