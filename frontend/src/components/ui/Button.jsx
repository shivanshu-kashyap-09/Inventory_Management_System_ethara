const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-500",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-md focus:ring-slate-500",
    danger: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 focus:ring-rose-500",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
    glass: "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 hover:shadow-lg focus:ring-white/50",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
