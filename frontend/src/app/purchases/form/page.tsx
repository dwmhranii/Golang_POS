"use client";

import Breadcrumbs from "@/src/component/Breadcrumbs";
import SidebarLayout from "@/src/component/sidebarLayout";
import SimpleForm from "@/src/component/SimpleForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PurchaseForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const purchaseId = searchParams.get("purchase_id");
    const [fields, setFields] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({
        product_id: "",
        quantity: 0,
        cost_price: 0,
        date: "",
    });
    const [products, setProducts] = useState<any[]>([]);
    const [purchaseCode, setPurchaseCode] = useState<string>("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!token) {
            router.push("/");
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3010/api/products", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data);

                setFields((prevFields) =>
                    prevFields.map((field) =>
                        field.name === "product_id"
                            ? {
                                  ...field,
                                  options: data.map((product: any) => ({
                                      label: product.name,
                                      value: product.id,
                                  })),
                              }
                            : field
                    )
                );
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("Error fetching products. Please try again.");
            }
        };

        const fetchPurchase = async () => {
            if (purchaseId) {
                try {
                    const response = await fetch(
                        `http://localhost:3010/api/purchases/${purchaseId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (!response.ok) throw new Error("Failed to fetch purchase");

                    const data = await response.json();
                    setFormData(data); // Pastikan formData di-bind langsung
                    setFields([
                        { name: "purchase_code", label: "Purchase Code", type: "text", defaultValue: data.purchase_code, readOnly: true },
                        { name: "product_id", label: "Product", type: "select", options: [], defaultValue: data.product_id },
                        { name: "quantity", label: "Quantity", type: "number", defaultValue: data.quantity },
                        { name: "cost_price", label: "Cost Price", type: "number", defaultValue: data.cost_price },
                        { name: "date", label: "Date", type: "date", defaultValue: data.date.split("T")[0] },
                    ]);
                } catch (error) {
                    console.error("Error fetching purchase:", error);
                    alert("Error fetching purchase. Please try again.");
                }
            } else {
                const today = new Date();
                const formattedDate = today.toISOString().split("T")[0]; // Format YYYY-MM-DD
                const newCode = `PUR-${formattedDate.replace(/-/g, "")}-${Math.floor(Math.random() * 10000)}`;
                setPurchaseCode(newCode);
                setFields([
                    { name: "purchase_code", label: "Purchase Code", type: "text", defaultValue: newCode, readOnly: true },
                    { name: "product_id", label: "Product", type: "select", options: [], defaultValue: "" },
                    { name: "quantity", label: "Quantity", type: "number", defaultValue: 0 },
                    { name: "cost_price", label: "Cost Price", type: "number", defaultValue: 0 },
                    { name: "date", label: "Date", type: "date", defaultValue: formattedDate },
                ]);
                setFormData({ purchase_code: newCode, date: formattedDate });
            }
        };

        fetchProducts();
        fetchPurchase();
    }, [purchaseId, token, router]);

    const handleFieldChange = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const requiredFields = ["product_id", "quantity", "cost_price", "date"];
        const isValid = requiredFields.every((field) => formData[field] !== "" && formData[field] !== 0);

        if (!isValid) {
            alert("Please fill in all required fields!");
            return;
        }

        const method = purchaseId ? "PUT" : "POST";
        const url = purchaseId
            ? `http://localhost:3010/api/purchases/${purchaseId}`
            : `http://localhost:3010/api/purchases`;

        const payload = {
            ...formData,
            purchase_code: purchaseCode || formData.purchase_code,
        };

        console.log("Submitting payload:", payload);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                alert(`Error: ${errorData.error || "Failed to submit form"}`);
            } else {
                router.push("/purchases");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    if (!fields.length || (fields.find((f) => f.name === "product_id")?.options || []).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
                <SimpleForm
                    fields={fields.map((field) => ({
                        ...field,
                        value: formData[field.name] || field.defaultValue || "",
                        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                            handleFieldChange(field.name, e.target.value),
                    }))}
                    onSubmit={handleSubmit}
                />
            </div>
        </SidebarLayout>
    );
};

export default PurchaseForm;
