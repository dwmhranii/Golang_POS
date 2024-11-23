"use client";
import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Select, Spinner } from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

interface Product {
  product_id: number;
  name: string;
  selling_price: number;
  stock: number;
}

interface SaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const SalesFormPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleId = searchParams.get('sale_id');
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SaleItem[]>([{
    product_id: 0,
    quantity: 1,
    unit_price: 0,
    total_price: 0
  }]);
  const [uangDibayar, setUangDibayar] = useState<number>(0); // New state for uang dibayar
  const [kembalian, setKembalian] = useState<number>(0); // New state for kembalian
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token'); // Get the JWT token from localStorage

  useEffect(() => {
    if (!token) {
      router.push("/"); // Redirect to login if no token is found
      return;
    }

    // Fetch categories for the dropdown
    fetch("http://localhost:3010/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));

    // If editing, fetch product details
    if (saleId) {
      fetch(`http://localhost:3010/api/sales/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setItems(data.items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price
          })));
          setUangDibayar(data.uang_dibayar || 0); // Set uang dibayar if editing
          setKembalian(data.kembalian || 0); // Set kembalian if editing
          setIsEditMode(true);
        })
        .catch((error) => console.error("Error fetching product data:", error));
    }
  }, [saleId, token, router]); // Added retryCount to dependencies

  const handleAddItem = () => {
    setItems([...items, {
      product_id: 0,
      quantity: 1,
      unit_price: 0,
      total_price: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, idx) => idx !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'product_id') {
      const product = products.find(p => p.product_id === parseInt(value));
      if (product) {
        item.product_id = product.product_id;
        item.unit_price = product.selling_price;
        item.total_price = product.selling_price * item.quantity;
      }
    } else if (field === 'quantity') {
      item.quantity = parseInt(value) || 0;
      item.total_price = item.unit_price * item.quantity;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const generateSaleCode = () => {
    const date = new Date();
    const prefix = 'SL';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${date.getFullYear()}${random}`;
  };

  const handleSubmit = async () => {
    try {
      const saleData = {
        sale_code: generateSaleCode(),
        uang_dibayar: uangDibayar,
        kembalian: kembalian,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      const url = saleId 
        ? `http://localhost:3010/api/sales/${saleId}`
        : 'http://localhost:3010/api/sales';
      
      const response = await fetch(url, {
        method: saleId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) throw new Error('Failed to save transaction');
      router.push('/sales');
    } catch (error) {
      console.error('Error saving sale:', error);
      setError('Failed to save transaction. Please try again.');
    }
  };

  const handleUangDibayarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setUangDibayar(value);
    setKembalian(value - calculateTotalPrice()); // Calculate change
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  return (
    <SidebarLayout>
      <Breadcrumbs />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {saleId ? 'Edit Transaction' : 'Create New Transaction'}
        </h1>

        <div className="space-y-4">
          <div>
            <Label>Transaction Date</Label>
            <TextInput
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
            />
          </div>

          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Product</Label>
                <Select
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id.toString()}>
                      {product.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="w-24">
                <Label>Quantity</Label>
                <TextInput
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                />
              </div>
              <div className="w-32">
                <Label>Unit Price</Label>
                <TextInput
                  type="number"
                  value={item.unit_price}
                  disabled
                />
              </div>
              <div className="w-32">
                <Label>Total</Label>
                <TextInput
                  type="number"
                  value={item.total_price}
                  disabled
                />
              </div>
              {items.length > 1 && (
                <Button
                  color="failure"
                  onClick={() => handleRemoveItem(index)}
                  className="ml-2"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          
          <Button onClick={handleAddItem}>Add Item</Button>

          <div className="mt-4">
            <Label>Total Price</Label>
            <TextInput
              type="number"
              value={calculateTotalPrice()}
              disabled
            />
          </div>

          <div className="mt-4">
            <Label>Amount Paid</Label>
            <TextInput
              type="number"
              value={uangDibayar}
              onChange={handleUangDibayarChange}
            />
          </div>

          <div className="mt-4">
            <Label>Change</Label>
            <TextInput
              type="number"
              value={kembalian}
              disabled
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button onClick={handleSubmit}>Save Transaction</Button>
          <Button color="gray" onClick={() => router.push('/sales')}>
            Cancel
          </Button>
        </div>

        {error && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default SalesFormPage;
