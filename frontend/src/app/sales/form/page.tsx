"use client";

import SimpleForm from "@/src/component/SimpleForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SaleForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const saleId = searchParams.get("sale_id");
    const token = localStorage.getItem("token");
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        if (!token) {
            router.push("/");
            return;
        }

        const fetchSale = async () => {
            if (saleId) {
                const response = await fetch(
                    `http://localhost:3010/api/sales/${saleId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await response.json();

                setFields([
                    { name: "sale_code", label: "Sale Code", type: "text", defaultValue: data.sale_code },
                    { name: "date", label: "Date", type: "date", defaultValue: data.date.split("T")[0] },
                    { name: "total_amount", label: "Total Amount", type: "number", defaultValue: data.total_amount },
                    { name: "profit", label: "Profit", type: "number", defaultValue: data.profit },
                ]);
            } else {
                setFields([
                    { name: "sale_code", label: "Sale Code", type: "text" },
                    { name: "date", label: "Date", type: "date" },
                    { name: "total_amount", label: "Total Amount", type: "number" },
                    { name: "profit", label: "Profit", type: "number" },
                ]);
            }
        };

        fetchSale();
    }, [saleId, token, router]);

    const handleSubmit = async (formData: any) => {
        const method = saleId ? "PUT" : "POST";
        const url = saleId
            ? `http://localhost:3010/api/sales/${saleId}`
            : `http://localhost:3010/api/sales`;

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        router.push("/sales");
    };

    return (
        <div className="p-6">
            <SimpleForm fields={fields} onSubmit={handleSubmit} />
        </div>
    );
};

export default SaleForm;
