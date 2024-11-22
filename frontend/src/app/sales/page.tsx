"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SalesPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Fetch token and sales data
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/"); // Redirect to login if no token is found
            return;
        }

        setToken(storedToken);

        fetch("http://localhost:3010/api/sales", {
            headers: { Authorization: `Bearer ${storedToken}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error("Error fetching sales data:", error);
                if (error.message === "Unauthorized") {
                    router.push("/"); // Redirect to login on unauthorized error
                }
            });
    }, [router]);

    const handleDelete = (sale_id: number) => {
        if (!token) return;

        fetch(`http://localhost:3010/api/sales/${sale_id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setData(data.filter((item) => item.sale_id !== sale_id));
            })
            .catch((error) => console.error("Error deleting sale:", error));
    };

    const handleEdit = (item: any) => {
        router.push(`/sales/form?sale_id=${item.sale_id}`);
    };

    const handleView = (item: any) => {
        router.push(`/sales/view?sale_id=${item.sale_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/sales/form")}
                    >
                        Create
                    </button>
                </div>
                <SimpleTable
                    endpoint="api/sales"
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    token={token}
                    keyField="sale_id"
                />
            </div>
        </SidebarLayout>
    );
};

export default SalesPage;
