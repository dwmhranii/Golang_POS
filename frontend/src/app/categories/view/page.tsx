"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import SimpleView from '@/src/component/SimpleView';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

const CategoryViewPage: React.FC = () => {
    const searchParams = useSearchParams();
    const idCategory = searchParams.get('category_id');
    const token = localStorage.getItem('token');

    if (!idCategory || !token) {
        return <div>Invalid User ID or Missing Token</div>;
    }

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="category-view-page">
            <div className="dashboard-content flex">
            <div className="main-content flex-1 p-6">
                <SimpleView 
                    endpoint={`api/categories/${idCategory}`} 
                    token={token}
                    viewPageType="category"
                />
            </div>
        </div>
    </div></SidebarLayout>
        
    );
};

export default CategoryViewPage;
