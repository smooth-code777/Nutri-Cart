import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState('products'); // 'products' or 'orders'
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', description: '', image_url: '', stock: '',
        is_vegetarian: 1, calories: '', protein: '', sugar: '', warnings: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const fetchOrders = async () => {
        const res = await api.get('/orders');
        setOrders(res.data);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        await api.delete(`/products/${id}`);
        fetchProducts();
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        await api.post('/products', newProduct);
        setNewProduct({
            name: '', price: '', description: '', image_url: '', stock: '',
            is_vegetarian: 1, calories: '', protein: '', sugar: '', warnings: ''
        });
        fetchProducts();
    };

    // Simple edit handling could be added here, currently just listing and adding

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setView('products')}
                    className={`px-4 py-2 rounded ${view === 'products' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Manage Products
                </button>
                <button
                    onClick={() => setView('orders')}
                    className={`px-4 py-2 rounded ${view === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    View Orders
                </button>
            </div>

            {view === 'products' ? (
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" className="border p-2 rounded" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                            <input type="text" placeholder="Image URL" className="border p-2 rounded" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} />
                            <input type="number" placeholder="Price" className="border p-2 rounded" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} required />
                            <input type="number" placeholder="Stock" className="border p-2 rounded" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} required />
                            <textarea placeholder="Description" className="border p-2 rounded col-span-2" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                            <div className="flex items-center">
                                <label className="mr-2">Vegetarian?</label>
                                <select className="border p-2 rounded" value={newProduct.is_vegetarian} onChange={e => setNewProduct({ ...newProduct, is_vegetarian: parseInt(e.target.value) })}>
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                            <input type="number" placeholder="Calories" className="border p-2 rounded" value={newProduct.calories} onChange={e => setNewProduct({ ...newProduct, calories: parseInt(e.target.value) })} />
                            <input type="number" placeholder="Protein (g)" className="border p-2 rounded" value={newProduct.protein} onChange={e => setNewProduct({ ...newProduct, protein: parseFloat(e.target.value) })} />
                            <input type="number" placeholder="Sugar (g)" className="border p-2 rounded" value={newProduct.sugar} onChange={e => setNewProduct({ ...newProduct, sugar: parseFloat(e.target.value) })} />
                            <input type="text" placeholder="Warnings (comma separated)" className="border p-2 rounded col-span-2" value={newProduct.warnings} onChange={e => setNewProduct({ ...newProduct, warnings: e.target.value })} />
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-2 hover:bg-green-700">Add Product</button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Product List</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Order List</h2>
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="border p-4 rounded bg-gray-50">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold">Order #{order.id}</span>
                                    <span className="text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">User: {order.username}</div>
                                <ul className="list-disc list-inside text-sm mb-2">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>{item.name} x {item.quantity}</li>
                                    ))}
                                </ul>
                                <div className="font-bold text-right">Total: ₹{order.total_amount.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
