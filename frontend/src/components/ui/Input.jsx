import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input
        ref={ref}
        className={`px-4 py-3 bg-slate-50/50 backdrop-blur-sm border rounded-xl outline-none transition-all duration-300 ${
          error 
            ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20' 
            : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 hover:border-slate-300 hover:bg-white'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 mt-1 font-medium flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
