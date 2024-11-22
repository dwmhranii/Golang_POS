"use client";

import React, { useState } from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [activePage, setActivePage] = useState("");

  // Fungsi untuk toggle tema
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-900 h-screen transition-all duration-300 relative`}
      >
        <div className="flex flex-col justify-between text-white h-full w-full">
          {/* Logo */}
          <div className="flex items-center justify-center py-4" onClick={() => setActivePage("Dashboard")}>
            {isOpen && <span className="text-xl font-bold cursor-pointer">SILOG E-Proc</span>}
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 px-2">
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "Dashboard" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setActivePage("Dashboard")}
              >
                <span className="text-xl">📊</span>
                {isOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "Category" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/categories"
                className="flex items-center gap-2"
                onClick={() => setActivePage("Category")}
              >
                <span className="text-xl">🏷️</span>
                {isOpen && <span>Category</span>}
              </Link>
            </li>
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "Expanse" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/expanses"
                className="flex items-center gap-2"
                onClick={() => setActivePage("Expanse")}
              >
                <span className="text-xl">🏷️</span>
                {isOpen && <span>Expanse</span>}
              </Link>
            </li>
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "Purchase" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/purchases"
                className="flex items-center gap-2"
                onClick={() => setActivePage("Purchase")}
              >
                <span className="text-xl">🏷️</span>
                {isOpen && <span>Purchase</span>}
              </Link>
            </li>
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "Pruduct" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/products"
                className="flex items-center gap-2"
                onClick={() => setActivePage("Product")}
              >
                <span className="text-xl">🏷️</span>
                {isOpen && <span>Product</span>}
              </Link>
            </li>
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "Transaction" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/transactions"
                className="flex items-center gap-2"
                onClick={() => setActivePage("Transaction")}
              >
                <span className="text-xl">🏷️</span>
                {isOpen && <span>Transaction</span>}
              </Link>
            </li>
            <li
              className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                activePage === "User" ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href="/users"
                className="flex items-center gap-2"
                onClick={() => setActivePage("User")}
              >
                <span className="text-xl">🏷️</span>
                {isOpen && <span>User</span>}
              </Link>
            </li>
            {/* Tambahkan menu lainnya seperti Product, User, dll. */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-md px-4 py-3">
          {/* Nama Halaman */}
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">{activePage}</h1>

          {/* Tombol Tema & GitHub */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              {theme === "light" ? "🌞" : "🌙"}
            </button>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              🐙
            </a>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold">
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
