import { DarkThemeToggle } from "flowbite-react";
import MySidebar from "../components/sidebar";

export default function Home() {
  return (
    <div className="flex">
      <MySidebar />
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p>Your content goes here.</p>
        <DarkThemeToggle />
      </div>
    </div>
  );
}

