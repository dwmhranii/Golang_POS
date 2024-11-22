"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PurchasesPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            router.push("/");
            return;
        }

        fetch("http://localhost:3010/api/purchases", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error(error);
                if (error.message === "Unauthorized") {
                    router.push("/");
                }
            });
    }, [token, router]);

    const handleDelete = (purchase_id: number) => {
        fetch(`http://localhost:3010/api/purchases/${purchase_id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => setData(data.filter((item) => item.purchase_id !== purchase_id)))
            .catch((error) => console.error(error));
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
