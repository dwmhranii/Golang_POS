"use client";

import { Sidebar } from "flowbite-react";
import { HiHome, HiUser, HiCog, HiLogout } from "react-icons/hi";
import { FC } from "react";

const MySidebar: FC = () => {
  return (
    <div className="h-screen w-64">
      <Sidebar aria-label="Sidebar Navigation">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/" icon={HiHome}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="/profile" icon={HiUser}>
              Profile
            </Sidebar.Item>
            <Sidebar.Item href="/settings" icon={HiCog}>
              Settings
            </Sidebar.Item>
            <Sidebar.Item href="/logout" icon={HiLogout}>
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default MySidebar;
