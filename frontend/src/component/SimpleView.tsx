"use client";

import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { Card } from 'flowbite-react';
import { useRouter } from 'next/navigation';

interface SimpleViewProps {
    endpoint: string;
    token?: string;
    title?: string;
    excludeFields?: string[];  // Fields to exclude from display
    formatters?: {
        [key: string]: (value: any) => string;  // Custom formatters for specific fields
    };
    onBack?: () => void;
    viewPageType?: 'category' | 'product' | 'purchase'; // Prop to determine page type
}

const SimpleView: React.FC<SimpleViewProps> = ({
    endpoint,
    token,
    title,
    excludeFields = ['id', 'created_at', 'updated_at'],
    formatters = {},
    onBack,
    viewPageType = 'category' // Default to 'category'
}) => {
    const router = useRouter();
    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const [category, setCategory] = useState<string | null>(null);  // State for category name (only for view product)
    const [product, setProduct] = useState<string | null>(null);  // State for product name (only for view purchase)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3010/${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await response.json();
                setData(result);

                // Fetch category name only if in the product view
                if (viewPageType === 'product' && result.category_id) {
                    const categoryResponse = await fetch(`http://localhost:3010/api/categories/${result.category_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (categoryResponse.ok) {
                        const categoryData = await categoryResponse.json();
                        setCategory(categoryData.name);  // Assuming category data has 'name'
                    } else {
                        setError('Failed to fetch category data');
                    }
                }

                // Fetch product name only if in the purchase view
                if (viewPageType === 'purchase' && result.product_id) {
                    const productResponse = await fetch(`http://localhost:3010/api/products/${result.product_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (productResponse.ok) {
                        const productData = await productResponse.json();
                        setProduct(productData.name);  // Assuming product data has 'name'
                    } else {
                        setError('Failed to fetch product data');
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, token, viewPageType]);

    const formatValue = (key: string, value: any): string => {
        // Use custom formatter if provided
        if (formatters[key]) {
            return formatters[key](value);
        }

        if (value === null || value === undefined) return 'N/A';
        
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        
        if (value instanceof Date) return value.toLocaleDateString();
        
        if (typeof value === 'number') {
            if (key.includes('price') || key.includes('amount') || key.includes('cost')) {
                return `$${value.toFixed(2)}`;
            }
            return value.toString();
        }
        
        return String(value);
    };

    const formatLabel = (key: string): string => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const displayTitle = title || `${endpoint.split('/')[1].charAt(0).toUpperCase() + endpoint.split('/')[1].slice(1)} Details`;

    const filteredEntries = data ? 
        Object.entries(data).filter(([key]) => !excludeFields.includes(key)) : 
        [];

    // Split entries into two columns
    const midpoint = Math.ceil(filteredEntries.length / 2);
    const leftColumnEntries = filteredEntries.slice(0, midpoint);
    const rightColumnEntries = filteredEntries.slice(midpoint);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{displayTitle}</h1>
                <Button onClick={onBack}>Back to List</Button>
            </div>
            <Card className="max-w-4xl mx-auto">
                <Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {leftColumnEntries.map(([key, value]) => (
                                <div key={key}>
                                    <Label className="mb-2 block">
                                        {formatLabel(key)}
                                    </Label>
                                    <TextInput
                                        value={key === 'product_id' && viewPageType === 'purchase' && product ? product : formatValue(key, value)} // Show product name in purchase view
                                        disabled
                                        className="w-full" />
                                </div>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {rightColumnEntries.map(([key, value]) => (
                                <div key={key}>
                                    <Label className="mb-2 block">
                                        {formatLabel(key)}
                                    </Label>
                                    <TextInput
                                        value={key === 'category_id' && viewPageType === 'product' && category ? category : formatValue(key, value)} // Show category name in product view
                                        disabled
                                        className="w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Label>
            </Card>
        </div>
    );
};

export default SimpleView;
