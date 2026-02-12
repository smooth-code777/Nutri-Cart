import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        setLoading(true);
        try {
            await api.post('/orders', {
                items: cart,
                total_amount: total
            });
            alert('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart is Empty</h1>
                <button onClick={() => navigate('/')} className="text-green-600 hover:text-green-500">Go to Menu</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {cart.map(item => (
                        <li key={item.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img src={item.image_url} alt={item.name} className="h-16 w-16 object-cover rounded" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500">₹{item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 hover:bg-gray-100"
                                    >-</button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 hover:bg-gray-100"
                                    >+</button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xl font-bold">Total: ₹{total.toFixed(2)}</span>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
