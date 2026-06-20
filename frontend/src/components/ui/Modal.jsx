import { X } from 'lucide-react';

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <button aria-label="Close dialog" className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 id="modal-title" className="text-xl font-bold text-slate-800">{title}</h2>
        <button aria-label="Close dialog" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
      </div>
      {children}
    </section>
  </div>
);

export default Modal;
