"use client";

import SimpleForm from "@/src/component/SimpleForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/src/component/sidebarLayout";
import Breadcrumbs from "@/src/component/Breadcrumbs";

const ExpenseForm: React.FC = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [fields, setFields] = useState<any[]>([]);
    const router = useRouter();
    const token = localStorage.getItem("token");
    const expenseId = new URLSearchParams(window.location.search).get("expense_id");

    useEffect(() => {
        if (!token) {
            router.push("/"); // Redirect to login if no token is found
            return;
        }

        const formFields = [
            { name: "description", label: "Description", type: "text" },
            { name: "amount", label: "Amount", type: "number" },
            { name: "date", label: "Date", type: "date" },
        ];

        setFields(formFields);

        // If editing an expense, fetch the data to prefill the form
        if (expenseId) {
            fetch(`http://localhost:3010/api/expenses/${expenseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFields((prevFields) =>
                        prevFields.map((field) => ({
                            ...field,
                            defaultValue: data[field.name],
                        }))
                    );
                    setIsEditMode(true);
                })
                .catch((error) => console.error("Error fetching expense data:", error));
        }
    }, [expenseId, token, router]);

    const handleSubmit = (formData: any) => {
        console.log("Form Data Submitted:", formData);

        const method = expenseId ? "PUT" : "POST";
        const url = expenseId
            ? `http://localhost:3010/api/expenses/${expenseId}`
            : "http://localhost:3010/api/expenses";

        fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(() => router.push("/expenses"))
            .catch((error) => console.error("Error saving data:", error));
    };

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="expenses-form-page">
        <div className="form-container p-6">
          <h2 className="text-2xl font-bold mb-4">
            {isEditMode ? "Edit expense" : "Create New expense"}
          </h2>
        <SimpleForm fields={fields} onSubmit={handleSubmit} />
    </div>
    </div></SidebarLayout>
        
    );
};

export default ExpenseForm;
