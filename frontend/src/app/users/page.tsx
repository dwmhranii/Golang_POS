"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SimpleTable from '@/src/components/SimpleTable';

const UserListPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    // Fetch all users
    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login if no token is found
            return;
        }

        fetch('http://localhost:3010/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }, // Include JWT token in headers
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unauthorized');
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error('Error fetching data:', error);
                if (error.message === 'Unauthorized') {
                    router.push('/'); // Redirect to login on unauthorized error
                }
            });
    }, [token, router]);

    const handleDelete = (id: number) => {
        // Send a DELETE request to the backend
        fetch(`http://localhost:3010/api/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }, // Include JWT token
        })
            .then(() => {
                setData(data.filter(item => item.id !== id)); // Remove deleted user from the state
            })
            .catch((error) => console.error('Error deleting item:', error));
    };

    const handleEdit = (item: any) => {
        // Navigate to the edit form with the user's ID
        router.push(`/users/form?id=${item.id}`);
    };

    const handleView = (item: any) => {
        // Navigate to the user view page with the user's ID
        router.push(`/users/view?id=${item.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700"
                        onClick={() => router.push('/users/form')}
                    >
                        Create New User
                    </button>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <SimpleTable
                        endpoint="api/users"
                        data={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        token={token}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
