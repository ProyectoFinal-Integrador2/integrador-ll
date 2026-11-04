export interface ReportTab {
  id: string;
  label: string;
}

interface ReportTabsProps {
  tabs: ReportTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const ReportTabs = ({
  tabs,
  activeTab,
  onChange,
}: ReportTabsProps) => (
  <div
    className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1"
    role="tablist"
    aria-label="Reportes disponibles"
  >
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;

      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
            isActive
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);
