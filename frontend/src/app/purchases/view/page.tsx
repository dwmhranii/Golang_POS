"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import SimpleView from '@/src/component/SimpleView';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

const PurchaseViewPage: React.FC = () => {
    const searchParams = useSearchParams();
    const idPurchase = searchParams.get('purchase_id');
    const token = localStorage.getItem('token');

    if (!idPurchase || !token) {
        return <div>Invalid User ID or Missing Token</div>;
    }

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="purchase-view-page">
            <div className="dashboard-content flex">
            <div className="main-content flex-1 p-6">
                <SimpleView 
                    endpoint={`api/purchases/${idPurchase}`} 
                    token={token}
                    viewPageType="purchase"
                />
            </div>
        </div>
    </div></SidebarLayout>
        
    );
};

export default PurchaseViewPage;
