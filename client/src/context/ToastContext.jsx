import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[1200] flex w-[min(430px,calc(100vw-2rem))] animate-[toast-enter_220ms_ease_both] items-center gap-3 rounded-xl border p-4 shadow-xl ${toast.type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'}`} role={toast.type === 'error' ? 'alert' : 'status'} aria-live="polite">
          <span className={`grid size-6 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`} aria-hidden="true">{toast.type === 'error' ? '!' : '✓'}</span>
          <span className="flex-1 text-sm leading-relaxed">{toast.message}</span>
          <button type="button" className="cursor-pointer border-0 bg-transparent text-xl leading-none" onClick={() => setToast(null)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
