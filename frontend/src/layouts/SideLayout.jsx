import { useState } from "react";
import { Sidebar } from "../ui/Sidebar";
import { Outlet } from "react-router-dom";
import { ActiveApplicationSelector } from "../ui/ActiveApplicationSelector";
import { useAuth } from "../hooks/useAuth";

export const SideLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { role } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
      />
      <main
        className={`flex-1 overflow-auto transition-all duration-300 bg-gray-50 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {role ==="client" && <ActiveApplicationSelector />}
        <Outlet />
      </main>
    </div>
  );
};