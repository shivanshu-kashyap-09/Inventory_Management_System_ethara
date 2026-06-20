import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import { LayoutDashboard, Package, Tags, ArrowRightLeft } from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ArrowRightLeft size={20} /> },
  ];

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 text-white flex flex-col h-full shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>

      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <Package className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Ethara<span className="text-indigo-400">.ai</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-4 relative z-10">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">Menu</div>
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</span>
            <span className="text-xs text-indigo-400 capitalize truncate">{user?.role || 'employee'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
