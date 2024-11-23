"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleTable from "@/src/component/SimpleTable";
import SidebarLayout from "@/src/component/sidebarLayout";
import Breadcrumbs from "@/src/component/Breadcrumbs";

const TransactionPage = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const token = localStorage.getItem("token"); // JWT token untuk autentikasi

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:3010/api/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
        console.log("Fetched Data:", result); // Log full result
        setData(result.data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleView = (item: any) => {
    router.push(`/sales/view?sale_id=${item.sale_id}`);
  };

  const handleEdit = (item: any) => {
    router.push(`/sales/form?sale_id=${item.sale_id}`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await fetch(`http://localhost:3010/api/sales/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTransactions();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  console.log("Transaction Data:", data); // Add this line to log the data before passing to SimpleTable

  return (
    <SidebarLayout>
      <Breadcrumbs />
      <div>
        <div className="flex justify-end mb-4">
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
            onClick={() => router.push("/sales/form")}
          >
            Create Transaction
          </button>
        </div>

        <SimpleTable
          data={data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          token={token}
          keyField="sale_id"
          endpoint={"api/sales"}
        />
      </div>
    </SidebarLayout>
  );
};

export default TransactionPage;
