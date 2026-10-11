import { useState } from 'react';

interface ResetPasswordModalProps {
  nombre: string | null;
  contrasena: string | null;
  onClose: () => void;
}

export const ResetPasswordModal = ({ nombre, contrasena, onClose }: ResetPasswordModalProps) => {
  const [copiada, setCopiada] = useState(false);

  if (!nombre || !contrasena) return null;

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(contrasena);
      setCopiada(true);
    } catch {
      setCopiada(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-slate-800">Contraseña restablecida</h2>
        <p className="mt-2 text-xs text-slate-500">
          Entrégasela a {nombre}. Se muestra una sola vez y deberá cambiarla al ingresar.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="font-mono text-sm font-semibold text-slate-800">{contrasena}</span>
          <button
            type="button"
            onClick={handleCopiar}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            {copiada ? 'Copiada' : 'Copiar'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};