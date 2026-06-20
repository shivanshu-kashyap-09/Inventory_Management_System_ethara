import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Users, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon: Icon, color, bgGradient, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between overflow-hidden relative">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgGradient} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${color} shadow-inner`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center text-emerald-500 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-md">
          <TrendingUp size={14} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="p-8 flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!stats) return (
    <div className="p-8">
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-xl flex items-center gap-4">
        <AlertTriangle size={24} />
        <p className="font-semibold">Failed to load dashboard data. Please try again later.</p>
      </div>
    </div>
  );

  const chartData = {
    labels: ['Total Products', 'Total Customers', 'Total Orders'],
    datasets: [
      {
        label: 'System Overview',
        data: [stats.totalProducts, stats.totalCustomers, stats.totalOrders],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Indigo
          'rgba(168, 85, 247, 0.8)', // Purple
          'rgba(16, 185, 129, 0.8)', // Emerald
        ],
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 13, family: 'Inter' },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(241, 245, 249, 1)', drawBorder: false },
        ticks: { font: { family: 'Inter' }, color: '#64748b', stepSize: 1 }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter' }, color: '#64748b' }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
          color="bg-indigo-100 text-indigo-600"
          bgGradient="bg-indigo-400"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={Users} 
          color="bg-purple-100 text-purple-600"
          bgGradient="bg-purple-400"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingCart} 
          color="bg-emerald-100 text-emerald-600"
          bgGradient="bg-emerald-400"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockCount} 
          icon={AlertTriangle} 
          color="bg-rose-100 text-rose-600"
          bgGradient="bg-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">System Overview</h3>
          <div className="flex-1 min-h-[300px]">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Low Stock Alerts</h3>
            <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-full">{stats.lowStockProducts?.length || 0} alerts</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {stats.lowStockProducts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Package size={24} className="text-slate-300" />
                </div>
                <p>All products are well stocked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.lowStockProducts?.slice(0, 6).map(product => (
                  <div key={product.id} className="group flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-xs font-medium text-slate-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-rose-600">{product.quantity_in_stock}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Left</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
