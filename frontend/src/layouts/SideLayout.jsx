import { Sidebar } from "../ui/Sidebar";

export const SideLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
