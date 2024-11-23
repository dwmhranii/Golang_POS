"use client";

import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput, Spinner, Alert } from 'flowbite-react';
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
}

const SimpleView: React.FC<SimpleViewProps> = ({
    endpoint,
    token,
    title,
    excludeFields = ['id', 'created_at', 'updated_at'],
    formatters = {},
    onBack
}) => {
    const router = useRouter();
    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const [category, setCategory] = useState<string | null>(null); // New state for category name
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

                // Fetch category name based on category_id
                if (result.category_id) {
                    const categoryResponse = await fetch(`http://localhost:3010/api/categories/${result.category_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (categoryResponse.ok) {
                        const categoryData = await categoryResponse.json();
                        setCategory(categoryData.name); // Assuming category data has 'name'
                    } else {
                        setError('Failed to fetch category data');
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, token]);

    const formatValue = (key: string, value: any): string => {
        // If there's a custom formatter for this field, use it
        if (formatters[key]) {
            return formatters[key](value);
        }

        // Default formatting based on value type
        if (value === null || value === undefined) return 'N/A';
        
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        
        if (value instanceof Date) return value.toLocaleDateString();
        
        if (typeof value === 'number') {
            // Check if it looks like a currency value
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

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center h-64">
    //             <Spinner className="w-8 h-8" />
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="p-4">
    //             <Alert>
    //                 {error}
    //             </Alert>
    //             {onBack && (
    //                 <Button
    //                     className="mt-4"
    //                     onClick={onBack}
    //                 >
    //                     Back
    //                 </Button>
    //             )}
    //         </div>
    //     );
    // }

    const displayTitle = title || `${endpoint.split('/')[1].charAt(0).toUpperCase() + endpoint.split('/')[1].slice(1)} Details`;

    const filteredEntries = data ? 
        Object.entries(data).filter(([key]) => !excludeFields.includes(key)) : 
        [];

    // Split entries into two columns
    const midpoint = Math.ceil(filteredEntries.length / 2);
    const leftColumnEntries = filteredEntries.slice(0, midpoint);
    const rightColumnEntries = filteredEntries.slice(midpoint);

    return (
        <><div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{displayTitle}</h1>
            <Button

                onClick={onBack}
            >
                Back to List
            </Button>
        </div>
        </div>
        <Card className="max-w-4xl mx-auto">
                {/* <Label>
    
    </Label> */}
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
                                        value={key === 'category_id' && category ? category : formatValue(key, value)}
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
                                        value={key === 'category_id' && category ? category : formatValue(key, value)}
                                        disabled
                                        className="w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Label>
            </Card></>
    );
};

export default SimpleView;
