"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import SimpleView from '@/src/components/SimpleView';

const UserViewPage: React.FC = () => {
    const searchParams = useSearchParams();
    const idUser = searchParams.get('id');
    const token = localStorage.getItem('token');

    if (!idUser || !token) {
        return <div>Invalid User ID or Missing Token</div>;
    }

    return (
        <div className="user-view-page">
            <div className="dashboard-content flex">
                <div className="main-content flex-1 p-6">
                    <SimpleView 
                        endpoint={`api/users/${idUser}`} 
                        token={token}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserViewPage;
