"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserPage: React.FC = () => {
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

    // Fetch all users
    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:3010/api/users", {
            headers: { Authorization: `Bearer ${token}` },
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
        if (!token) return;

        fetch(`http://localhost:3010/api/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setData(data.filter((item) => item.id !== id)); // Remove deleted user from the state
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    const handleEdit = (item: any) => {
        router.push(`/users/form?id=${item.id}`);
    };

    const handleView = (item: any) => {
        router.push(`/users/view?id=${item.id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                {/* Create Button */}
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/users/form")}
                    >
                        Create
                    </button>
                </div>
                {/* Table */}
                <SimpleTable
                    endpoint="api/users"
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    token={token}
                    keyField="id"
                />
            </div>
        </SidebarLayout>
    );
};

export default UserPage;
