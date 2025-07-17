import { BarChart3, FileCheck2, Home, LogOut, Menu, Settings } from "lucide-react";
import { SideItem } from "./SideItem";
import { useLocation, useNavigate } from "react-router-dom";

export const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('application')) return 'applications';
    if (path.includes('checklist')) return 'checklists';
    return 'dashboard';
  };

  const handleNavigation = (view) => {
    switch(view) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'applications':
        navigate('/application');
        break;
      case 'checklists':
        navigate('/checklist');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className={`${open ? 'w-64' : 'w-20'} h-screen fixed top-0 left-0 bg-indigo-700 text-white transition-all duration-300 z-10`}>
      <div className="p-4 flex justify-between items-center">
        {open && <h2 className="text-xl font-bold">IMMI-SYNC</h2>}
        <button onClick={() => setOpen(!open)} className="p-2 hover:bg-indigo-600 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <SideItem 
          icon={<Home size={24} />} 
          text="Dashboard" 
          active={getCurrentView() === 'dashboard'}
          expanded={open}
          onClick={() => handleNavigation('dashboard')}
        />
        <SideItem 
          icon={<FileCheck2 size={24} />} 
          text="Applications" 
          active={getCurrentView() === 'applications'}
          expanded={open}
          onClick={() => handleNavigation('applications')}
        />
        <SideItem 
          icon={<BarChart3 size={24} />} 
          text="Checklists" 
          active={getCurrentView() === 'checklists'}
          expanded={open}
          onClick={() => handleNavigation('checklists')}
        />
        <SideItem 
          icon={<Settings size={24} />} 
          text="Settings" 
          active={getCurrentView() === 'settings'}
          expanded={open}
          onClick={() => {}}
        />
        <SideItem 
          icon={<LogOut size={24} />} 
          text="Logout" 
          expanded={open}
          onClick={() => {}}
        />
      </nav>
    </div>
  );
};
