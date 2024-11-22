"use client";

import React, { useState, useEffect } from 'react';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'password' | 'select' | 'email' | 'number' | 'date';
    defaultValue?: string | number;
    options?: { label: string; value: string }[]; // Options for select fields
}

interface SimpleFormProps {
    fields: FormField[];
    onSubmit: (formData: { [key: string]: any }) => void;
}

const SimpleForm: React.FC<SimpleFormProps> = ({ fields, onSubmit }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        // Initialize form data with default values if provided
        const initialData: { [key: string]: any } = {};
        fields.forEach(field => {
            initialData[field.name] = field.defaultValue || '';
        });
        setFormData(initialData);
    }, [fields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Konversi data form sesuai tipe yang diinginkan
        const convertedData = { ...formData };
    
        // Pastikan amount menjadi number (float atau int)
        if (convertedData.amount) {
            convertedData.amount = parseFloat(convertedData.amount); // Bisa juga menggunakan parseInt() jika integer
        }
    
        // Pastikan date menjadi objek Date atau string format yang sesuai
        if (convertedData.date) {
            convertedData.date = new Date(convertedData.date); // Bisa juga gunakan format khusus jika dibutuhkan
        }
    
        // Panggil onSubmit dengan data yang sudah dikonversi
        onSubmit(convertedData);
    
        // Reset form data
        setFormData({});
    };
    

    const formatDate = (date: string) => {
        // Format the date to a readable string (e.g., 'YYYY-MM-DD')
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2-digit month
        const day = ('0' + d.getDate()).slice(-2); // Ensure 2-digit day
        return `${year}-${month}-${day}`;
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {fields.map((field, index) => (
                <div key={index} className="mb-4">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                    </label>

                    {/* Conditional rendering for different field types */}
                    {field.type === 'select' ? (
                        <select
                            name={field.name}
                            id={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black"
                        >
                            {field.options &&
            field.options.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.label}
                </option>
            ))}
                        </select>
                    ) : field.type === 'date' ? (
                        <input
                            type="date"
                            name={field.name}
                            id={field.name}
                            value={formatDate(formData[field.name] || '')} // Format date
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black"
                        />
                    ) : (
                        <input
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black"
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >
                Submit
            </button>
        </form>
    );
};

export default SimpleForm;
