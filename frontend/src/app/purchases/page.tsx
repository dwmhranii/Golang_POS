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

    // Fetch token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/"); // Redirect to login if no token is found
            return;
        }
        setToken(storedToken);
    }, [router]);

    // Fetch purchase data
    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:3010/api/purchases", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error("Error fetching purchases:", error);
                if (error.message === "Unauthorized") {
                    router.push("/"); // Redirect to login on unauthorized error
                }
            });
    }, [token, router]);

    const handleDelete = (purchase_id: number) => {
        if (!token) return;

        fetch(`http://localhost:3010/api/purchases/${purchase_id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => setData(data.filter((item) => item.purchase_id !== purchase_id)))
            .catch((error) => console.error("Error deleting purchase:", error));
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
