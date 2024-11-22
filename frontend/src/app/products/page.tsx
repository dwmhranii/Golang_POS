"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleTable from "@/src/component/SimpleTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
    category_id: number;
    name: string;
}

interface Product {
    product_id: number;
    product_code: string;
    name: string;
    cost_price: number;
    selling_price: number;
    stock: number;
    category_id: number;
    created_at: string;
    updated_at: string;
}

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
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

        fetch("http://localhost:3010/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => setCategories(data))
            .catch((error) => {
                console.error("Error fetching categories:", error);
                if (error.message === "Unauthorized") router.push("/");
            });
    }, [token, router]);

    // Fetch products
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
                console.error("Error fetching products:", error);
                if (error.message === "Unauthorized") router.push("/");
            });
    }, [token, router]);

    // Combine products with category names
    useEffect(() => {
        if (products.length && categories.length) {
            const mappedData = products.map((product) => ({
                ...product,
                category_id:
                    categories.find((cat) => cat.category_id === product.category_id)?.name || product.category_id,
            }));
            setDisplayData(mappedData);
        }
    }, [products, categories]);

    const handleDelete = (id: number) => {
        if (!token) return;

        fetch(`http://localhost:3010/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setProducts(products.filter((item) => item.product_id !== id));
                setDisplayData(displayData.filter((item) => item.product_id !== id));
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    const handleEdit = (item: Product) => {
        router.push(`/products/form?product_id=${item.product_id}`);
    };

    const handleView = (item: Product) => {
        router.push(`/products/view?product_id=${item.product_id}`);
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                        onClick={() => router.push("/products/form")}
                    >
                        Create Product
                    </button>
                </div>
                <SimpleTable
                    endpoint="api/products"
                    data={displayData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    token={token}
                    keyField="product_id"
                />
            </div>
        </SidebarLayout>
    );
};

export default ProductPage;
