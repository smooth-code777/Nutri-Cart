import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AlertTriangle, Info } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();

    // Health Warning Logic
    const getWarnings = () => {
        if (!user) return [];
        const warnings = [];
        const userConditions = user.health_conditions ? user.health_conditions.split(',') : [];

        // Check for Diabetes
        if (userConditions.includes('Diabetes')) {
            if (product.sugar > 10 || (product.warnings && product.warnings.toLowerCase().includes('sugar'))) {
                warnings.push('High Sugar - Not recommended for Diabetics');
            }
        }

        // Check for Hypertension
        if (userConditions.includes('Hypertension')) {
            if (product.warnings && product.warnings.toLowerCase().includes('sodium')) { // Assuming we had sodium or using warnings field
                warnings.push('High Sodium - Watch out');
            }
        }

        // General warnings from DB
        if (product.warnings && product.warnings.length > 0) {
            // warnings.push(product.warnings); // Optional: always show general warnings or just specific ones? 
        }

        // Diet Mismatch
        if (user.diet_preference === 'veg' && product.is_vegetarian === 0) {
            warnings.push('Non-Vegetarian Item');
        }

        return warnings;
    };

    const warnings = getWarnings();
    const isSafe = warnings.length === 0;

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${!isSafe ? 'border-2 border-red-200' : ''}`}>
            <img src={product.image_url} alt={product.name} className="h-48 w-full object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-green-600 font-bold">₹{product.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1 mb-2">{product.description}</p>

                <div className="mt-auto space-y-2">
                    <div className="flex space-x-2 text-xs text-gray-400">
                        <span>Cal: {product.calories}</span>
                        <span>Prot: {product.protein}g</span>
                        <span>Sug: {product.sugar}g</span>
                    </div>

                    {warnings.length > 0 && (
                        <div className="bg-red-50 p-2 rounded text-xs text-red-700 space-y-1">
                            {warnings.map((w, idx) => (
                                <div key={idx} className="flex items-start">
                                    <AlertTriangle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                    <span>{w}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {product.warnings && (
                        <div className="text-xs text-orange-500 flex items-center">
                            <Info size={12} className="mr-1" />
                            <span>Contains: {product.warnings}</span>
                        </div>
                    )}

                    <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
