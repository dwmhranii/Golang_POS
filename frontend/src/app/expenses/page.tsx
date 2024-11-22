"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    // Fetch all users
    useEffect(() => {
        if (!token) {
            router.push("/"); // Redirect to login if no token is found
            return;
        }

        fetch("http://localhost:3010/api/expense", {
            headers: { Authorization: `Bearer ${token}` }, // Include JWT token in headers
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
    }, [token, router]);

    const handleDelete = (id: number) => {
        // Send a DELETE request to the backend
        fetch(`http://localhost:3010/api/expense/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }, // Include JWT token
        })
            .then(() => {
                setData(data.filter((item) => item.id !== id)); // Remove deleted user from the state
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    const handleEdit = (item: any) => {
        // Navigate to the edit form with the user's ID
        router.push(`/expense/form?expense_id=${item.expense_id}`);
    };

    const handleView = (item: any) => {
        // Navigate to the user view page with the user's ID
        router.push(`/expense/view?expense_id=${item.expense_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs/>
            {/* Container for the button and table */}
            <div className="p-6">
                {/* Create Button */}
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/expense/form")}
                    >
                        Create
                    </button>
                </div>
                {/* Table */}
                <SimpleTable
                    endpoint="api/expense"
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

export default UserPage;
