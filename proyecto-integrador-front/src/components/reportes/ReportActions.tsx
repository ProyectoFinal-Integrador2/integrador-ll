import { Download, Printer } from 'lucide-react';
import { descargarCsv, type CsvSeccion } from '@/utils/csv';

interface ReportActionsProps {
  filename: string;
  sections: CsvSeccion[];
}

const BOTON =
  'flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50';

export const ReportActions = ({ filename, sections }: ReportActionsProps) => (
  <div className="mb-4 flex flex-wrap justify-end gap-2 print:hidden">
    <button
      type="button"
      onClick={() => descargarCsv(filename, sections)}
      className={BOTON}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Exportar CSV
    </button>

    <button
      type="button"
      onClick={() => window.print()}
      className={BOTON}
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Imprimir / PDF
    </button>
  </div>
);
