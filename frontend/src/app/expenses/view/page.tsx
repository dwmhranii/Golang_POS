"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleView from "@/src/component/SimpleView";
import { useRouter, useSearchParams } from "next/navigation";

const ExpenseView: React.FC = () => {
    const searchParams = useSearchParams();
    const idExpense = searchParams.get('expense_id');
    const token = localStorage.getItem('token');

    if (!idExpense || !token) {
        return <div>Invalid User ID or Missing Token</div>;
    }

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="user-view-page">
            <div className="dashboard-content flex">
            <div className="main-content flex-1 p-6">
                <SimpleView 
                    endpoint={`api/expenses/${idExpense}`} 
                    token={token}
                />
            </div>
        </div>
    </div></SidebarLayout>
    )
};

export default ExpenseView;
