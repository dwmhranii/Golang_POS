"use client";

import React, { useEffect, useState } from 'react';

interface SimpleViewProps {
    endpoint: string;
    token?: string;  // Accept token as an optional prop
}

const SimpleView: React.FC<SimpleViewProps> = ({ endpoint, token }) => {
    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3010/${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the Authorization header
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Missing token');
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError("Missing token");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, token]);

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const title = `${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} Details`.replace(/_/g, " ");

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{title}</h2>
            {data && (
                <div className="space-y-4">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">{key.replace(/_/g, " ")}:</span>
                            <span className="text-gray-900">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimpleView;
