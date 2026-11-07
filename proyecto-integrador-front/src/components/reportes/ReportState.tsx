interface ReportLoadingProps {
  message?: string;
}

export const ReportLoading = ({
  message = 'Generando reporte...',
}: ReportLoadingProps) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);

interface ReportErrorProps {
  message: string;
}

export const ReportError = ({ message }: ReportErrorProps) => (
  <div
    role="alert"
    className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
  >
    <p className="text-sm font-semibold text-red-700">
      No se pudo generar el reporte
    </p>
    <p className="mt-1 text-xs text-red-600">{message}</p>
  </div>
);

interface ReportEmptyProps {
  message: string;
}

export const ReportEmpty = ({ message }: ReportEmptyProps) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);
