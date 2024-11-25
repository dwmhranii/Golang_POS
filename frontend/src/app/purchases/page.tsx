"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PurchasesPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Ensure localStorage is only accessed client-side
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (!storedToken) {
            router.push("/");
            return;
        }
        setToken(storedToken);
    }, [router]);

    useEffect(() => {
        if (!token) return;

        const fetchPurchases = async () => {
            try {
                const response = await fetch("http://localhost:3010/api/purchases", {
                    method: "GET", // Explicitly set method
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch purchases");
                }

                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                console.error("Error fetching purchases:", error);
                router.push("/");
            }
        };

        fetchPurchases();
    }, [token, router]);

    const handleDelete = async (purchase_id: number) => {
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3010/api/purchases/${purchase_id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete purchase");
            }

            setData(data.filter((item) => item.purchase_id !== purchase_id));
        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/purchases/form?purchase_id=${item.purchase_id}`);
    };

    const handleView = (item: any) => {
        router.push(`/purchases/view?purchase_id=${item.purchase_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
                        onClick={() => router.push("/purchases/form")}
                    >
                        Create
                    </button>
                </div>
                <SimpleTable
                    endpoint="api/purchases"
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    token={token}
                    keyField="purchase_id"
                />
            </div>
        </SidebarLayout>
    );
};

export default PurchasesPage;