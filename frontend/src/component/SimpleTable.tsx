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
    const safeData = Array.isArray(data) ? data : [];
    const headers = safeData.length > 0 ? Object.keys(safeData[0]) : [];

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg w-2/3">
            <table className="w-full text-left border-collapse bg-white rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        {headers.map((header, index) => (
                            <th
                                key={`${header}-${index}`} // Ensure unique keys for headers
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
                    {safeData.map((item, index) => (
                        <tr key={item[keyField] || `row-${index}`} className="hover:bg-gray-50">
                            {headers.map((header, headerIndex) => (
                                <td key={`${header}-${headerIndex}`} className="p-4 text-sm text-gray-900">
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
                                    onClick={() => onDelete(item[keyField], token)}
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