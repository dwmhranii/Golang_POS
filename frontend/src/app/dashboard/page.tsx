import Breadcrumbs from "@/src/component/Breadcrumbs";
import MySidebar from "@/src/component/sidebar";
import SidebarLayout from "@/src/component/sidebarLayout";
import { DarkThemeToggle } from "flowbite-react";


export default function Home() {
  return (
    <SidebarLayout>
      <Breadcrumbs />
      <div className="flex">
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p>Your content goes here.</p>
      </div>
    </div>
    </SidebarLayout>
    
  );
}

