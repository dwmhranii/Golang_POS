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
    const token = localStorage.getItem("token");
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        if (!token) {
            router.push("/");
            return;
        }

        // Fetch fields dynamically based on edit or create
        const fetchPurchase = async () => {
            if (purchaseId) {
                const response = await fetch(
                    `http://localhost:3010/api/purchases/${purchaseId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await response.json();

                setFields([
                    { name: "purchase_code", label: "Purchase Code", type: "text", defaultValue: data.purchase_code },
                    { name: "product_id", label: "Product ID", type: "number", defaultValue: data.product_id },
                    { name: "quantity", label: "Quantity", type: "number", defaultValue: data.quantity },
                    { name: "cost_price", label: "Cost Price", type: "number", defaultValue: data.cost_price },
                    { name: "total_cost", label: "Total Cost", type: "number", defaultValue: data.total_cost },
                    { name: "date", label: "Date", type: "date", defaultValue: data.date.split("T")[0] },
                ]);
            } else {
                setFields([
                    { name: "purchase_code", label: "Purchase Code", type: "text" },
                    { name: "product_id", label: "Product ID", type: "number" },
                    { name: "quantity", label: "Quantity", type: "number" },
                    { name: "cost_price", label: "Cost Price", type: "number" },
                    { name: "total_cost", label: "Total Cost", type: "number" },
                    { name: "date", label: "Date", type: "date" },
                ]);
            }
        };

        fetchPurchase();
    }, [purchaseId, token, router]);

    const handleSubmit = async (formData: any) => {
        const method = purchaseId ? "PUT" : "POST";
        const url = purchaseId
            ? `http://localhost:3010/api/purchases/${purchaseId}`
            : "http://localhost:3010/api/purchases";

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        router.push("/purchases");
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-6">
            <SimpleForm fields={fields} onSubmit={handleSubmit} />
        </div>
        </SidebarLayout>
        
    );
};

export default PurchaseForm;
