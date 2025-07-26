import { BarChart3, FileCheck2, Home, LogOut, Menu, Notebook, Settings, Upload } from "lucide-react";
import { SideItem } from "./SideItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut, role } = useAuth();

  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('consultancy/dashboard')) return 'consultancy/dashboard';
    if (path.includes('consultancy/application')) return 'consultancy/applications';
    if (path.includes('consultancy/checklist')) return 'consultancy/checklists';
    if (path.includes('consultancy/settings')) return 'consultancy/settings';
    if (path.includes('client/dashboard')) return 'client/dashboard'
    if (path.includes('client/application')) return 'client/application'
    if (path.includes('client/documents')) return 'client/documents'
    if (path.includes('client/tasks')) return 'client/tasks'
    if (path.includes('client/settings')) return 'client/settings'
    return role ==='consultancy' ? 'consultancy/dashboard' : 'client/dashboard';
  };

  const handlelogOut = () => {
    logOut();
    navigate('/')
  };

  const handleNavigation = (view) => {
    switch(view) {
      case '/consultancy/dashboard':
        navigate('/consultancy/dashboard');
        break;
      case '/consultancy/applications':
        navigate('/consultancy/application');
        break;
      case '/consultancy/checklist':
        navigate('/consultancy/checklist');
        break;
      case '/consultancy/settings':
        navigate('/consultancy/settings');
        break;
      case '/client/dashboard':
        navigate('/client/dashboard');
        break;
      case '/client/application':
        navigate('/client/application');
        break;
      case '/client/documents':
        navigate('/client/documents');
        break;
      case '/client/tasks':
        navigate('/client/tasks');
        break;
      case '/client/settings':
        navigate('/client/settings');
        break;
      default:
        role === "consultancy" ? navigate('/consultancy/dashboard') : navigate('/client/dashboard');
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
      {role === "consultancy" ? 
        <nav className="mt-8">
          <SideItem 
            icon={<Home size={24} />} 
            text="Dashboard" 
            active={getCurrentView() === 'consultancy/dashboard'}
            expanded={open}
            onClick={() => handleNavigation('/consultancy/dashboard')}
          />
          <SideItem 
            icon={<FileCheck2 size={24} />} 
            text="Applications" 
            active={getCurrentView() === 'consultancy/applications'}
            expanded={open}
            onClick={() => handleNavigation('/consultancy/applications')}
          />
          <SideItem 
            icon={<BarChart3 size={24} />} 
            text="Checklists" 
            active={getCurrentView() === 'consultancy/checklists'}
            expanded={open}
            onClick={() => handleNavigation('/consultancy/checklist')}
          />
          <SideItem 
            icon={<Settings size={24} />} 
            text="Settings" 
            active={getCurrentView() === 'consultancy/settings'}
            expanded={open}
            onClick={() => handleNavigation('/consultancy/settings')}
          />
          <SideItem 
            icon={<LogOut size={24} />} 
            text="Logout" 
            expanded={open}
            onClick={handlelogOut}
          />
      </nav>
        :
       <nav className="mt-8">
          <SideItem 
              icon={<Home size={24} />} 
              text="Dashboard" 
              active={getCurrentView() === 'client/dashboard'}
              expanded={open}
              onClick={() => handleNavigation('/client/dashboard')}
          />
          <SideItem 
            icon={<FileCheck2 size={24} />} 
            text="Application" 
            active={getCurrentView() === 'client/application'}
            expanded={open}
            onClick={() => handleNavigation('/client/application')}
          />
          <SideItem 
            icon={<Upload size={24} />} 
            text="Documents" 
            active={getCurrentView() === 'client/documents'}
            expanded={open}
            onClick={() => handleNavigation('/client/documents')}
          />
          <SideItem 
            icon={<Notebook size={24} />} 
            text="Tasks" 
            active={getCurrentView() === 'client/tasks'}
            expanded={open}
            onClick={() => handleNavigation('/client/tasks')}
          />
          <SideItem 
            icon={<Settings size={24} />} 
            text="Settings" 
            active={getCurrentView() === 'client/settings'}
            expanded={open}
            onClick={() => handleNavigation('/client/settings')}
          />
          <SideItem 
            icon={<LogOut size={24} />} 
            text="Logout" 
            expanded={open}
            onClick={handlelogOut}
          />
       </nav>
      }
      
    </div>
  );
};
