"use client";

import React from 'react';

interface SimpleTableProps {
    endpoint: string;
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: number, token: string | null) => void;
    onView: (item: any) => void;
    token: string | null;
    keyField: string; // New prop for the identifier field (e.g., "id", "category_id", "product_id")
}

const SimpleTable: React.FC<SimpleTableProps> = ({ data, onEdit, onDelete, onView, token, keyField }) => {
    // Get headers based on the keys of the first item in the data
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg w-2/3">
            <table className="w-full text-left border-collapse bg-white rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        {headers.map((header) => (
                            <th 
                                key={header} 
                                className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
                            >
                                {header.replace('_', ' ')}
                            </th>
                        ))}
                        <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={item[keyField]} className="hover:bg-gray-50"> {/* Use the keyField here */}
                            {headers.map((header) => (
                                <td key={header} className="p-4 text-sm text-gray-900">
                                    {/* Check if the header is 'category_name' and display the category name */}
                                    {header === "category_name" ? item.category_name : item[header]}
                                </td>
                            ))}
                            <td className="p-4 text-sm font-medium">
                                <button 
                                    className="bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-700 mr-2"
                                    onClick={() => onView(item)}
                                >
                                    View
                                </button>
                                <button 
                                    className="bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-700 mr-2"
                                    onClick={() => onEdit(item)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-700"
                                    onClick={() => onDelete(item[keyField], token)} // Pass the correct keyField here
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SimpleTable;