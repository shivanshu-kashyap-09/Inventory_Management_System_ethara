import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { LogOut, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  
  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    const name = path.substring(1);
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/80 h-20 flex items-center justify-between px-8 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="pl-9 pr-4 py-2 bg-slate-100/80 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all w-64"
          />
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative group">
            <Bell size={20} className="group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors px-4 py-2.5 rounded-full hover:bg-rose-50"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
