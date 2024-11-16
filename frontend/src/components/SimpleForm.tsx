"use client";

import { FC, useState, useEffect } from "react";

interface SimpleFormProps {
  endpoint: string;
  token: string;
  data: any; // Data yang diedit
  onSubmitSuccess: () => void; // Callback untuk sukses submit
}

const SimpleForm: FC<SimpleFormProps> = ({ endpoint, token, data, onSubmitSuccess }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${endpoint}/${formData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error updating product");
      }

      onSubmitSuccess(); // Callback sukses
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium">Category</label>
        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => setFormData(data)} // Reset form to initial data
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SimpleForm;
