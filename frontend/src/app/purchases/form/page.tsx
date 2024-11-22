"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SimpleForm from '@/src/component/SimpleForm';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

const UserFormPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const idUser = searchParams.get('id');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login if no token is found
            return;
        }

        if (idUser) {
            fetch(`http://localhost:3010/api/users/${idUser}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => response.json())
                .then(data => {
                    setFormData({name: data.name, email: data.email, password: '', role: data.role });
                    setIsEditMode(true);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [idUser, token, router]);

    const handleFormSubmit = (formData: { [key: string]: any }) => {
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `http://localhost:3010/api/users/${idUser}` : 'http://localhost:3010/api/users';
    
        // Ensure to send all form data, even if it's unchanged.
        const payload = {
            user_id: formData.user_id, // Assuming user_id is passed for update
            name: formData.name || '',  // Ensure values are not undefined or null
            email: formData.email || '',
            role: formData.role || '',
            ...(formData.password ? { password: formData.password } : {}), // Send password only if it's changed
        };
    
        fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
        .then(() => router.push('/users'))
        .catch(error => console.error('Error submitting form:', error));
    };
    

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="user-form-page">
        <div className="form-container p-6">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit User' : 'Create New User'}</h2>
            <SimpleForm
                fields={[
                    { name: "name", label: "Name", type: "text", defaultValue: formData.name },
                    { name: "email", label: "Email", type: "email", defaultValue: formData.email },
                    { name: "password", label: "Password", type: "password", defaultValue: formData.password},
                    { name: "role", label: "Role", type: "select", options: ["admin", "cashier"], defaultValue: formData.role},
                ]}
                onSubmit={handleFormSubmit}
            />
        </div>
    </div></SidebarLayout>
        
    );
};

export default UserFormPage;
