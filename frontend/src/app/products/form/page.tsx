  "use client";

  import React, { useState, useEffect } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import SimpleForm from "@/src/component/SimpleForm";
  import SidebarLayout from "@/src/component/sidebarLayout";
  import Breadcrumbs from "@/src/component/Breadcrumbs";

  const ProductFormPage: React.FC = () => {
    const [formData, setFormData] = useState({
      name: "",
      cost_price: 0,
      selling_price: 0,
      stock: 0,
      category_id: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [categories, setCategories] = useState<any[]>([]); // List of categories
    const router = useRouter();
    const searchParams = useSearchParams();
    const idProduct = searchParams.get("product_id");
    const token = localStorage.getItem("token");

    useEffect(() => {
      if (!token) {
        router.push("/"); // Redirect to login if no token is found
        return;
      }

      // Fetch categories for the dropdown
      fetch("http://localhost:3010/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));

      // If editing, fetch product details
      if (idProduct) {
        fetch(`http://localhost:3010/api/products/${idProduct}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => response.json())
          .then((data) => {
            setFormData({
              name: data.name,
              cost_price: data.cost_price,
              selling_price: data.selling_price,
              stock: data.stock,
              category_id: data.category_id,
            });
            setIsEditMode(true);
          })
          .catch((error) => console.error("Error fetching product data:", error));
      }
    }, [idProduct, token, router]);
    

    const handleFormSubmit = (formData: { [key: string]: any }) => {
      console.log("Form Data Submitted:", formData);
    
      if (!formData.category_id) {
        console.error("Category is required");
        // Optionally, show an error message to the user
        return;
      }
    
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `http://localhost:3010/api/products/${idProduct}`
        : "http://localhost:3010/api/products";
    
      // Ensure the numeric fields are properly parsed
      const payload = {
        name: formData.name,
        cost_price: parseFloat(formData.cost_price), // Konversi ke float
        selling_price: parseFloat(formData.selling_price), // Konversi ke float
        stock: parseInt(formData.stock, 10), // Konversi ke integer
        category_id: parseInt(formData.category_id, 10), // Konversi ke integer
      };
    
      console.log("Payload to submit:", payload);
      console.log("Submitting payload to:", url);
      console.log("Method:", method);

    
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
            // If response is not OK, parse and throw an error
            return response.json().then((error) => {
              console.error("Server Error:", error);
              throw new Error(`HTTP error! status: ${response.status}`);
            });
          }
          return response.json();
        })
        .then(() => {
          console.log("Form submitted successfully");
          router.push("/products");
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
                additionalInfo: "Error occurred during form submission",
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
        <div className="product-form-page">
          <div className="form-container p-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h2>
            <SimpleForm
              fields={[
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                  defaultValue: formData.name,
                },
                {
                  name: "cost_price",
                  label: "Cost Price",
                  type: "number",
                  defaultValue: formData.cost_price,
                },
                {
                  name: "selling_price",
                  label: "Selling Price",
                  type: "number",
                  defaultValue: formData.selling_price,
                },
                {
                  name: "stock",
                  label: "Stock",
                  type: "number",
                  defaultValue: formData.stock,
                },
                {
                  name: "category_id",
                  label: "Category",
                  type: "select",
                  options: categories.map((category) => ({
                    value: category.category_id.toString(), // Ensure it's a string
                    label: category.name,
                  })),
                  defaultValue: (formData.category_id || categories[0]?.category_id)?.toString(),
                  // Ensure it's a string
                }
              ]} onSubmit={handleFormSubmit}            
            />
          </div>
        </div>
      </SidebarLayout>
    );
  };

  export default ProductFormPage;
