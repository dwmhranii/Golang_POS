"use client";

import React, { useState, useEffect } from 'react';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'password' | 'select' | 'email' | 'number';
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
        onSubmit(formData);
        setFormData({}); // Reset form data
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
