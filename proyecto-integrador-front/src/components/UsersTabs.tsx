import type { UserTabFilter } from '../types/user.types';

interface UsersTabsProps {
  activeTab: UserTabFilter;
  onTabChange: (tab: UserTabFilter) => void;
}

const TABS: { id: UserTabFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'tecnicos', label: 'Técnicos' },
  { id: 'usuarios', label: 'Usuarios' },
];

export const UsersTabs = ({ activeTab, onTabChange }: UsersTabsProps) => {
  return (
    <div className="flex items-center gap-8 mb-4">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer pb-2 text-sm transition-colors relative ${
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
