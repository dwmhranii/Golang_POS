"use client";

import React, { useState } from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex ${
        isOpen ? "w-64" : "w-16"
      } bg-gray-900 h-screen transition-all duration-300 relative`}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col justify-between text-white h-full w-full">
        {/* Logo */}
        <div className="flex items-center justify-center py-4">
          {isOpen && <span className="text-xl font-bold">SILOG E-Proc</span>}
        </div>

        {/* Menu Items */}
        <ul className="space-y-2 px-2">
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/categories" className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {isOpen && <span>Category</span>}
            </Link>
          </li>
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/products" className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {isOpen && <span>Product</span>}
            </Link>
          </li>
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/expanses" className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {isOpen && <span>Expanse</span>}
            </Link>
          </li>
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/purchases" className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {isOpen && <span>Purchase</span>}
            </Link>
          </li>
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/transactions" className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {isOpen && <span>Transactions</span>}
            </Link>
          </li>
          <li className="group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <Link href="/users" className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {isOpen && <span>User</span>}
            </Link>
          </li>
        </ul>

        {/* Footer */}
        <div className="p-4">
          <button className="flex items-center gap-2 w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            <span>🚪</span>
            {isOpen && <span>Sign out</span>}
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-5 top-4 p-2 bg-gray-700 text-white rounded-full shadow-md focus:outline-none hover:bg-gray-600"
      >
        {isOpen ? "←" : "→"}
      </button>
    </div>
  );
};

export default Sidebar;
