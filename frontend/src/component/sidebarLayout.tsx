"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarLayoutProps = {
  children: React.ReactNode;
};

const MENU_ITEMS = [
  { name: "Dashboard", icon: "📊", href: "/dashboard" },
  { name: "Category", icon: "🏷️", href: "/categories" },
  { name: "Expense", icon: "💰", href: "/expenses" },
  { name: "Purchase", icon: "🛒", href: "/purchases" },
  { name: "Product", icon: "🔧", href: "/products" },
  { name: "Sale", icon: "💳", href: "/sales" },
  { name: "User", icon: "👤", href: "/users" },
];

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  // Inisialisasi state dengan membaca dari localStorage
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarOpen');
      return savedState !== null ? JSON.parse(savedState) : true;
    }
    return true;
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme as "dark" | "light" || "light";
    }
    return "light";
  });
  
  const pathname = usePathname();
  
  // Efek untuk menyimpan state sidebar ke localStorage setiap kali berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
    }
  }, [isOpen]);

  // Efek untuk menyimpan tema ke localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const getCurrentPageName = () => {
    const currentMenuItem = MENU_ITEMS.find(item => item.href === pathname);
    return currentMenuItem?.name || "Dashboard";
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebar = () => {
    setIsOpen((prev: any) => !prev);
  };

  return (
    <div className={`flex h-screen max-w-screen ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-900 h-screen transition-all duration-300 relative`}
      >
        <div className="flex flex-col justify-between text-white h-full w-full">
          {/* Logo */}
          <div className="flex items-center justify-center py-4">
            {isOpen && <span className="text-xl font-bold cursor-pointer">SILOG E-Proc</span>}
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 px-2">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.name}
                className={`group flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md ${
                  pathname === item.href ? "bg-gray-700" : ""
                }`}
              >
                <Link href={item.href} className="flex items-center gap-2 w-full">
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
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
          onClick={toggleSidebar}
          className="absolute -right-5 top-4 p-2 bg-gray-700 text-white rounded-full shadow-md focus:outline-none hover:bg-gray-600"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-md px-4 py-3">
          {/* Page Title */}
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            {getCurrentPageName()}
          </h1>

          {/* Theme & GitHub Button */}
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
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;