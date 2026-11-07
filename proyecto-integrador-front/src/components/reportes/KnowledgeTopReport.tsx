import { BookOpen, Eye } from 'lucide-react';
import { ReportActions } from '@/components/reportes/ReportActions';
import { ReportBarList } from '@/components/reportes/ReportBarList';
import { ReportStatCard } from '@/components/reportes/ReportStatCard';
import { ReportError, ReportLoading } from '@/components/reportes/ReportState';
import { ReportTable, type ReportColumn } from '@/components/reportes/ReportTable';
import { ESTILOS_CATEGORIA_CONOCIMIENTO } from '@/components/conocimiento/knowledgeCategoryStyles';
import { useReporte } from '@/hooks/useReporte';
import { obtenerReporteConocimiento } from '@/services/reportsApi';
import type { ArticuloMasConsultado } from '@/types/report.types';

const columns: ReportColumn<ArticuloMasConsultado>[] = [
  {
    header: 'Articulo',
    render: (row) => (
      <span className="font-semibold text-slate-700">{row.titulo}</span>
    ),
  },
  {
    header: 'Categoria',
    render: (row) => (
      <span
        className={`rounded px-2 py-0.5 text-[11px] font-bold ${ESTILOS_CATEGORIA_CONOCIMIENTO[row.categoria]}`}
      >
        {row.categoria}
      </span>
    ),
  },
  { header: 'Autor', render: (row) => row.autorNombre },
  {
    header: 'Vistas',
    render: (row) => (
      <span className="font-semibold text-blue-600">{row.vistas}</span>
    ),
  },
  {
    header: '% del total',
    render: (row) => `${row.porcentajeVistas}%`,
  },
];

export const KnowledgeTopReport = () => {
  const { data: report, isLoading, error } = useReporte(
    obtenerReporteConocimiento,
  );

  if (error) return <ReportError message={error} />;
  if (isLoading || !report) return <ReportLoading />;

  return (
    <>
      <ReportActions
        filename="reporte-conocimiento"
        sections={[
          {
            titulo: 'Resumen de conocimiento',
            columnas: ['Indicador', 'Valor'],
            filas: [
              ['Articulos en el ranking', report.articulos.length],
              ['Vistas totales', report.totalVistas],
              ['Generado en', report.generadoEn],
            ],
          },
          {
            titulo: 'Ranking de articulos',
            columnas: [
              'Articulo',
              'Categoria',
              'Autor',
              'Vistas',
              'Porcentaje del total',
              'Creado',
            ],
            filas: report.articulos.map((articulo) => [
              articulo.titulo,
              articulo.categoria,
              articulo.autorNombre,
              articulo.vistas,
              `${articulo.porcentajeVistas}%`,
              articulo.creadoEn,
            ]),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ReportStatCard
          label="Articulos en el ranking"
          value={String(report.articulos.length)}
          hint="Hasta 10 de los mas consultados"
          icon={<BookOpen className="h-5 w-5" />}
        />

        <ReportStatCard
          label="Vistas totales"
          value={String(report.totalVistas)}
          hint="Aperturas de detalle registradas"
          icon={<Eye className="h-5 w-5" />}
          iconClassName="text-blue-600"
        />

        <ReportStatCard
          label="Vistas del top 1"
          value={
            report.articulos[0]
              ? String(report.articulos[0].vistas)
              : 'Sin datos'
          }
          hint={
            report.articulos[0]?.titulo ?? 'Todavia no hay consultas'
          }
          icon={<BookOpen className="h-5 w-5" />}
          iconClassName="text-green-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReportBarList
            title="Top 5 por vistas"
            slices={report.articulos.slice(0, 5).map((articulo) => ({
              etiqueta: articulo.titulo,
              conteo: articulo.vistas,
              porcentaje: articulo.porcentajeVistas,
            }))}
            colorFor={() => 'bg-blue-500'}
            emptyMessage="Todavia no se consulto ningun articulo."
          />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800">
            Articulos mas consultados
          </h3>
          <ReportTable
            columns={columns}
            rows={report.articulos}
            rowKey={(row) => row.id}
            emptyMessage="Todavia no hay articulos de conocimiento."
          />
        </section>
      </div>
    </>
  );
};
