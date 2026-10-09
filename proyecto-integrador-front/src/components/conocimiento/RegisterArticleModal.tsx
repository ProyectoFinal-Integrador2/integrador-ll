import { useState, type ChangeEvent, type FormEvent } from 'react';
import { BookOpen, Check, ChevronDown, X } from 'lucide-react';
import { BaseModal } from '@/components/common/BaseModal';
import {
  CATEGORIAS_CONOCIMIENTO,
  type CategoriaConocimiento,
  type EntradaArticuloConocimiento,
} from '@/types/knowledge.types';

export interface RegisterArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (input: EntradaArticuloConocimiento) => Promise<void>;
}

interface ArticuloFormData {
  titulo: string;
  categoria: CategoriaConocimiento;
  contenido: string;
}

const INITIAL_FORM_DATA: ArticuloFormData = {
  titulo: '',
  categoria: 'Red',
  contenido: '',
};

const toPayload = (form: ArticuloFormData): EntradaArticuloConocimiento => ({
  titulo: form.titulo.trim(),
  categoria: form.categoria,
  contenido: form.contenido.trim() || null,
});

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error desconocido';

export const RegisterArticleModal = ({
  isOpen,
  onClose,
  onSubmit,
}: RegisterArticleModalProps) => {
  const [formData, setFormData] = useState<ArticuloFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSubmit(toPayload(formData));
      setFormData(INITIAL_FORM_DATA);
      onClose();
    } catch (submitError) {
      setError(toMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-blue-600">
            <BookOpen className="h-6 w-6 stroke-2" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-800 md:text-lg">
            Registrar articulo
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="articulo-titulo" className="mb-1.5 block text-xs font-semibold text-slate-600">
            Titulo *
          </label>
          <input
            type="text"
            id="articulo-titulo"
            name="titulo"
            required
            minLength={3}
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej. Como restablecer la contrasena del correo"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="articulo-categoria" className="mb-1.5 block text-xs font-semibold text-slate-600">
            Categoria *
          </label>
          <div className="relative">
            <select
              id="articulo-categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {CATEGORIAS_CONOCIMIENTO.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label htmlFor="articulo-contenido" className="mb-1.5 block text-xs font-semibold text-slate-600">
            Contenido
          </label>
          <textarea
            id="articulo-contenido"
            name="contenido"
            rows={5}
            value={formData.contenido}
            onChange={handleChange}
            placeholder="Describe el paso a paso de la solucion..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{isSaving ? 'Guardando...' : 'Guardar articulo'}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};