import type { ReactNode } from 'react';

export interface ReportColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface ReportTableProps<T> {
  columns: ReportColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage: string;
}

export const ReportTable = <T,>({
  columns,
  rows,
  rowKey,
  emptyMessage,
}: ReportTableProps<T>) => {
  if (rows.length === 0) {
    return <p className="mt-4 text-xs text-slate-400">{emptyMessage}</p>;
  }

  return (
    <div className="mt-4 overflow-x-auto print:overflow-visible">
      <table className="w-full min-w-[640px] border-collapse text-left text-xs print:min-w-0">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-slate-50 last:border-0"
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={`px-3 py-3 align-top text-slate-600 ${column.className ?? ''}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
