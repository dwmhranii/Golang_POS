"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SimpleForm from "@/src/component/SimpleForm";
import SidebarLayout from "@/src/component/sidebarLayout";
import Breadcrumbs from "@/src/component/Breadcrumbs";

const PurchaseFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    purchase_code: "",
    product_id: "",
    quantity: 1,
    cost_price: 0,
    total_cost: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // List of products
  const router = useRouter();
  const searchParams = useSearchParams();
  const idPurchase = searchParams.get("purchase_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/"); // Redirect to login if no token is found
      return;
    }

    // Fetch products for the dropdown
    fetch("http://localhost:3010/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));

    // If editing, fetch purchase details
    if (idPurchase) {
      fetch(`http://localhost:3010/api/purchases/${idPurchase}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            purchase_code: data.purchase_code,
            product_id: data.product_id.toString(),
            quantity: data.quantity,
            cost_price: data.cost_price,
            total_cost: data.total_cost,
            date: new Date(data.date).toISOString().split('T')[0]
          });
          setIsEditMode(true);
        })
        .catch((error) => console.error("Error fetching purchase data:", error));
    }
  }, [idPurchase, token, router]);

  const handleFormSubmit = (formData: { [key: string]: any }) => {
    console.log("Form Data Submitted:", formData);

    if (!formData.product_id) {
      console.error("Product is required");
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:3010/api/purchases/${idPurchase}`
      : "http://localhost:3010/api/purchases";

    // Calculate total cost
    const quantity = parseInt(formData.quantity, 10);
    const costPrice = parseFloat(formData.cost_price);
    const totalCost = quantity * costPrice;

    // Prepare payload
    const payload = {
      purchase_code: formData.purchase_code || `PO-${Date.now()}`, // Generate if not exists
      product_id: parseInt(formData.product_id, 10),
      quantity: quantity,
      cost_price: costPrice,
      total_cost: totalCost,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
    };

    console.log("Payload to submit:", payload);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            console.error("Server Error:", error);
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(() => {
        console.log("Form submitted successfully");
        router.push("/purchases");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);

        // Send log error to backend
        fetch("http://localhost:3010/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            error_message: error.message || "Unknown error",
            context: {
              formData,
              url,
              method,
              additionalInfo: "Error occurred during purchase form submission",
            },
          }),
        }).catch((logError) => {
          console.error("Failed to send error log to backend:", logError);
        });
      });
  };

  return (
    <SidebarLayout>
      <Breadcrumbs />
      <div className="purchase-form-page">
        <div className="form-container p-6">
          <h2 className="text-2xl font-bold mb-4">
            {isEditMode ? "Edit Purchase" : "Create New Purchase"}
          </h2>
          <SimpleForm
            fields={[
              {
                name: "product_id",
                label: "Product",
                type: "select",
                options: products.map((product) => ({
                  value: product.product_id.toString(),
                  label: product.name,
                })),
                defaultValue: formData.product_id || (products[0]?.product_id?.toString()),
              },
              {
                name: "quantity",
                label: "Quantity",
                type: "number",
                defaultValue: formData.quantity,
              },
              {
                name: "cost_price",
                label: "Cost Price",
                type: "number",
                defaultValue: formData.cost_price,
              },
              {
                name: "date",
                label: "Purchase Date",
                type: "date",
                defaultValue: formData.date,
              }
            ]}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PurchaseFormPage;