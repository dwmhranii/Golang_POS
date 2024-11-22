"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ExpensePage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null); // Token state
    const router = useRouter();

    // Fetch token and expenses
    useEffect(() => {
        const storedToken = localStorage.getItem("token"); // Access localStorage only in useEffect
        if (!storedToken) {
            router.push("/"); // Redirect to login if no token is found
            return;
        }
        setToken(storedToken);

        fetch("http://localhost:3010/api/expenses", {
            headers: { Authorization: `Bearer ${storedToken}` }, // Include JWT token in headers
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unauthorized");
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => {
                console.error("Error fetching data:", error);
                if (error.message === "Unauthorized") {
                    router.push("/"); // Redirect to login on unauthorized error
                }
            });
    }, [router]);

    const handleDelete = (expense_id: number) => {
        if (!token) return; // Ensure token is available
        fetch(`http://localhost:3010/api/expenses/${expense_id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }, // Include JWT token
        })
            .then(() => {
                setData(data.filter((item) => item.expense_id !== expense_id)); // Remove deleted expense from the state
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    const handleEdit = (item: any) => {
        router.push(`/expenses/form?expense_id=${item.expense_id}`);
    };

    const handleView = (item: any) => {
        router.push(`/expenses/view?expense_id=${item.expense_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/expenses/form")}
                    >
                        Create
                    </button>
                </div>
                <SimpleTable
                    endpoint="api/expenses"
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    token={token}
                    keyField="expense_id"
                />
            </div>
        </SidebarLayout>
    );
};

export default ExpensePage;
