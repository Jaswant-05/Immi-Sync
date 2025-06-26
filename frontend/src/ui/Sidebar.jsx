// Updated Sidebar component - receives open state as props
import { Home, Users, FileCheck2, BarChart3, Settings, LogOut, Menu } from 'lucide-react';
import { SideItem } from './SideItem';

export const Sidebar = ({ open, setOpen }) => {
  return (
    <div className={`${open ? 'w-64' : 'w-20'} h-screen fixed top-0 left-0 bg-indigo-700 text-white transition-all duration-300 z-10`}>
      <div className="p-4 flex justify-between items-center">
        {open && <h2 className="text-xl font-bold">IMMI-SYNC</h2>}
        <button onClick={() => setOpen(!open)} className="p-2 hover:bg-indigo-600 rounded-lg">
          <Menu size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <SideItem icon={<Home size={24} />} text="Dashboard" active expanded={open} />
        <SideItem icon={<FileCheck2 size={24} />} text="Applications" expanded={open} />
        <SideItem icon={<BarChart3 size={24} />} text="Checklists" expanded={open} />
        <SideItem icon={<Settings size={24} />} text="Settings" expanded={open} />
        <SideItem icon={<LogOut size={24} />} text="Logout" expanded={open} />
      </nav>
    </div>
  );
};