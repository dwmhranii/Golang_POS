"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null); // Token state
    const router = useRouter();

    // Fetch token and categories
    useEffect(() => {
        const storedToken = localStorage.getItem("token"); // Access localStorage only in useEffect
        if (!storedToken) {
            router.push("/"); // Redirect to login if no token is found
            return;
        }
        setToken(storedToken);

        fetch("http://localhost:3010/api/categories", {
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

    const handleDelete = (category_id: number) => {
        if (!token) return; // Ensure token is available
        fetch(`http://localhost:3010/api/categories/${category_id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }, // Include JWT token
        })
            .then(() => {
                setData(data.filter((item) => item.category_id !== category_id)); // Remove deleted category from the state
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    const handleEdit = (item: any) => {
        router.push(`/categories/form?category_id=${item.category_id}`);
    };

    const handleView = (item: any) => {
        router.push(`/categories/view?category_id=${item.category_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/categories/form")}
                    >
                        Create
                    </button>
                </div>
                <SimpleTable
                    endpoint="api/categories"
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    token={token}
                    keyField="category_id"
                />
            </div>
        </SidebarLayout>
    );
};

export default CategoryPage;
