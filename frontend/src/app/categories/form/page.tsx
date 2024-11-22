"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SimpleForm from '@/src/component/SimpleForm';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

const CategoryFormPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', description: ''});
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const idCategory = searchParams.get('category_id');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login if no token is found
            return;
        }

        if (idCategory) {
            fetch(`http://localhost:3010/api/categories/${idCategory}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => response.json())
                .then(data => {
                    setFormData({name: data.name, description: data.description});
                    setIsEditMode(true);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [idCategory, token, router]);

    const handleFormSubmit = (formData: { [key: string]: any }) => {
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `http://localhost:3010/api/categories/${idCategory}` : 'http://localhost:3010/api/categories';
    
        // Ensure to send all form data, even if it's unchanged.
        const payload = {
            category_id: formData.category_id, // Assuming user_id is passed for update
            name: formData.name || '',  // Ensure values are not undefined or null
            description: formData.description || '',
            category_code: formData.category_code || '',
        };
    
        fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
        .then(() => router.push('/categories'))
        .catch(error => console.error('Error submitting form:', error));
    };
    

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="category-form-page">
        <div className="form-container p-6">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Category' : 'Create New Category'}</h2>
            <SimpleForm
                fields={[
                    { name: "name", label: "Name", type: "text", defaultValue: formData.name },
                    { name: "description", label: "Description", type: "text", defaultValue: formData.description},
                ]}
                onSubmit={handleFormSubmit}
            />
        </div>
    </div></SidebarLayout>
        
    );
};

export default CategoryFormPage;
