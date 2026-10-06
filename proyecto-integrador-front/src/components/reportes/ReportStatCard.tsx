import type { ReactNode } from 'react';

interface ReportStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  iconClassName?: string;
}

export const ReportStatCard = ({
  label,
  value,
  hint,
  icon,
  iconClassName = 'text-blue-600',
}: ReportStatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <span className={iconClassName} aria-hidden="true">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
        {value}
      </p>

      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
};