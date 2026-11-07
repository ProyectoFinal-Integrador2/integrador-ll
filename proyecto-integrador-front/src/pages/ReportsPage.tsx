import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ReportTabs, type ReportTab } from '@/components/reportes/ReportTabs';
import { ReportsSummary } from '@/components/reportes/ReportsSummary';
import { SlaComplianceReport } from '@/components/reportes/SlaComplianceReport';
import { TechnicianWorkloadReport } from '@/components/reportes/TechnicianWorkloadReport';
import { EquipmentFailureReport } from '@/components/reportes/EquipmentFailureReport';
import { SatisfactionReport } from '@/components/reportes/SatisfactionReport';
import { KnowledgeTopReport } from '@/components/reportes/KnowledgeTopReport';

const TABS: ReportTab[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'sla', label: 'Cumplimiento SLA' },
  { id: 'carga', label: 'Carga de tecnicos' },
  { id: 'fallas', label: 'Fallas por equipo' },
  { id: 'satisfaccion', label: 'Satisfaccion' },
  { id: 'conocimiento', label: 'Conocimiento' },
];

const REPORTES = {
  resumen: ReportsSummary,
  sla: SlaComplianceReport,
  carga: TechnicianWorkloadReport,
  fallas: EquipmentFailureReport,
  satisfaccion: SatisfactionReport,
  conocimiento: KnowledgeTopReport,
} as const;

type ReportTabId = keyof typeof REPORTES;

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<ReportTabId>('resumen');
  const [refreshKey, setRefreshKey] = useState(0);

  const ActiveReport = REPORTES[activeTab];
  const activeLabel =
    TABS.find((tab) => tab.id === activeTab)?.label ?? 'Reporte';

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <ReportTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as ReportTabId)}
        />

        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          aria-label="Actualizar reporte"
          title="Actualizar reporte"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div key={`${activeTab}-${refreshKey}`}>
        <div className="mb-4 hidden print:block">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Reporte: {activeLabel}
          </h2>
        </div>

        <ActiveReport />
      </div>
    </div>
  );
};
