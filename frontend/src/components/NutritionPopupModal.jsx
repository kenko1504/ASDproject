import { useState, useEffect } from 'react';

export default function NutritionPopupModal({ isOpen, onClose, ingredients }) {
    const [nutrition, setNutrition] = useState({});

    // Calculate total nutritional values
    const calculateNutrition = () => {
        if (!ingredients) return {};

        const totals = {
            calories: 0,
            protein: 0,
            fat: 0,
            transFat: 0,
            carbohydrates: 0,
            sugar: 0,
            dietaryFiber: 0,
            cholesterol: 0,
            sodium: 0,
            calcium: 0,
            iron: 0,
            vitaminC: 0
        };

        ingredients.forEach(ingredient => {
            const food = ingredient.ingredient;
            const quantity = ingredient.quantity || 0;

            if (food) {
                const multiplier = quantity / 100;

                Object.keys(totals).forEach(nutrient => {
                    if (food[nutrient]) {
                        totals[nutrient] += food[nutrient] * multiplier;
                    }
                });
            }
        });

        return totals;
    };

    // Calculate nutrition only when modal opens
    useEffect(() => {
        if (isOpen) {
            setNutrition(calculateNutrition());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg !p-6 max-w-md w-full !mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center !mb-4">
                    <h3 className="text-xl font-semibold">Nutritional Breakdown</h3>
                </div>

                <div className="space-y-3">
                    {[
                        { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
                        { label: 'Protein', value: nutrition.protein, unit: 'g' },
                        { label: 'Fat', value: nutrition.fat, unit: 'g' },
                        { label: 'Trans Fat', value: nutrition.transFat, unit: 'g' },
                        { label: 'Carbohydrates', value: nutrition.carbohydrates, unit: 'g' },
                        { label: 'Sugar', value: nutrition.sugar, unit: 'g' },
                        { label: 'Dietary Fiber', value: nutrition.dietaryFiber, unit: 'g' },
                        { label: 'Cholesterol', value: nutrition.cholesterol, unit: 'mg' },
                        { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
                        { label: 'Calcium', value: nutrition.calcium, unit: 'mg' },
                        { label: 'Iron', value: nutrition.iron, unit: 'mg' },
                        { label: 'Vitamin C', value: nutrition.vitaminC, unit: 'mg' }
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center !py-2 border-b border-gray-200">
                            <span className="font-medium">{item.label}:</span>
                            <span>{item.value ? item.value.toFixed(2) : '0.00'} {item.unit}</span>
                        </div>
                    ))}
                </div>

                <div className="!mt-6">
                    <button
                        onClick={onClose}
                        className="w-full !py-2 hover:bg-[#A6C78A] rounded-full border-2 border-[#A6C78A] transition font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}