"use client";
import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Spinner, Alert} from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarLayout from '@/src/component/sidebarLayout';
import Breadcrumbs from '@/src/component/Breadcrumbs';

interface Sale {
    sale_id: number;
    sale_code: string;
    date: string;
    total_amount: number;
    profit: number;
    items: Array<{
        product_id: number;
        quantity: number;
        unit_price: number;
        total_price: number;
    }>;
}

interface Product {
    product_id: number;
    name: string;
}

export default function TransaksiView() {
    const [isClient, setIsClient] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams();
    const saleId = searchParams.get('sale_id');
    
    const [sale, setSale] = useState<Sale | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true)
        const loadData = async () => {
            if (!saleId) {
                setError('Sale ID is required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                router.push('/login');
                return;
            }

            try {
                // Fetch sale data first
                const saleResponse = await fetch(`http://localhost:3010/api/sales/${saleId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!saleResponse.ok) {
                    throw new Error(`Failed to fetch sale: ${saleResponse.statusText}`);
                }

                const saleData = await saleResponse.json();
                setSale(saleData);

                // Fetch products data
                const productsResponse = await fetch(`http://localhost:3010/api/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!productsResponse.ok) {
                    throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
                }

                const productsData = await productsResponse.json();
                console.log('Products Data:', productsData); // Debug log

                // Check if productsData has the expected structure
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                } else if (productsData.data && Array.isArray(productsData.data)) {
                    setProducts(productsData.data);
                } else {
                    console.error('Unexpected products data structure:', productsData);
                    setProducts([]);
                }

            } catch (error) {
                console.error('Error loading data:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [saleId, router]);

    // Helper function untuk mendapatkan nama produk
    const getProductName = (productId: number): string => {
        console.log('Finding product for ID:', productId); // Debug log
        console.log('Available products:', products); // Debug log
        
        if (!products || products.length === 0) {
            console.log('No products available');
            return 'Unknown Product';
        }
        
        const product = products.find(p => {
            console.log('Comparing:', p.product_id, productId); // Debug log
            return p.product_id === productId;
        });
        
        if (!product) {
            console.log('Product not found');
            return 'Unknown Product';
        }
        
        return product.name;
    };

    if (loading) {
        return (
            <SidebarLayout>
                <div className="flex items-center justify-center h-screen">
                    <Spinner className="w-8 h-8" />
                </div>
            </SidebarLayout>
        );
    }

    if (error) {
        return (
            <SidebarLayout>
                <div className="p-4">
                    <Alert >
                       {error}
                    </Alert>
                    <Button
                        className="mt-4"
                        onClick={() => router.push('/sales')}
                    >
                        Back to Sales List
                    </Button>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <Breadcrumbs />
            <div className="p-4 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Transaction Details</h1>
                    <Button 
                       
                        onClick={() => router.push('/sales')}
                    >
                        Back to List
                    </Button>
                </div>

                <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block">Sale Code</Label>
                            <TextInput
                                value={sale?.sale_code || 'N/A'}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Date</Label>
                            <TextInput
                                value={sale?.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}
                                disabled
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block">Items</Label>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product</th>
                                        <th className="px-4 py-3 text-right">Quantity</th>
                                        <th className="px-4 py-3 text-right">Unit Price</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale?.items && sale.items.length > 0 ? (
                                        sale.items.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="px-4 py-3">
                                                    {getProductName(item.product_id)}
                                                </td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">
                                                    ${item.unit_price?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    ${item.total_price?.toFixed(2) || '0.00'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                                                No items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block">Total Amount</Label>
                            <TextInput
                                value={`$${sale?.total_amount?.toFixed(2) || '0.00'}`}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Profit</Label>
                            <TextInput
                                value={`$${sale?.profit?.toFixed(2) || '0.00'}`}
                                disabled
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}