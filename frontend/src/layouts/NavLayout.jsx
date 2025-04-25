import { Navbar } from "../ui/Navbar";

export const NavLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
};
