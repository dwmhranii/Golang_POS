"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import SimpleView from '@/src/component/SimpleView';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

const SalesDetailPage: React.FC = () => {
    const searchParams = useSearchParams();
    const idSale = searchParams.get('sale_id');
    const token = localStorage.getItem('token');

    if (!idSale || !token) {
        return <div>Invalid User ID or Missing Token</div>;
    }

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="category-view-page">
            <div className="dashboard-content flex">
            <div className="main-content flex-1 p-6">
                <SimpleView 
                    endpoint={`api/sales/${idSale}`} 
                    token={token}
                />
            </div>
        </div>
    </div></SidebarLayout>
        
    );
};

export default SalesDetailPage;
