"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
    product_id: number;
    name: string;
}

interface Purchase {
    purchase_id: number;
    purchase_code: string;
    cost_price: number;
    total_cost: number;
    quantity: number;
    product_id: number;
    date: Date;
    product: string;
}

const PurchasePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Fetch token from localStorage on client-side
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/"); // Redirect to login if no token found
            return;
        }
        setToken(storedToken);
    }, [router]);

    // Fetch categories
    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:3010/api/products", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => setProducts(data))
            .catch((error) => {
                console.error("Error fetching categories:", error);
                if (error.message === "Unauthorized") router.push("/");
            });
    }, [token, router]);

    // Fetch products
    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:3010/api/purchases", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => setPurchases(data))
            .catch((error) => {
                console.error("Error fetching products:", error);
                if (error.message === "Unauthorized") router.push("/");
            });
    }, [token, router]);

    // Combine products with category names
    useEffect(() => {
        if (purchases.length && products.length) {
            const mappedData = purchases.map((purchase) => ({
                ...purchase,
                product_id:
                    products.find((cat) => cat.product_id === purchase.product_id)?.name || purchase.product_id,
            }));
            setDisplayData(mappedData);
        }
    }, [purchases, products]);

    const handleDelete = (id: number) => {
        if (!token) return;

        fetch(`http://localhost:3010/api/purchases/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setPurchases(purchases.filter((item) => item.purchase_id !== id));
                setDisplayData(displayData.filter((item) => item.purchase_id !== id));
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    const handleEdit = (item: Purchase) => {
        router.push(`/purchases/form?purchase_id=${item.purchase_id}`);
    };

    const handleView = (item: Purchase) => {
        router.push(`/purchases/view?purchase_id=${item.purchase_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/purchases/form")}
                    >
                        Create Purchase
                    </button>
                </div>
                <SimpleTable
                    endpoint="api/purchases"
                    data={displayData}
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

export default PurchasePage;
