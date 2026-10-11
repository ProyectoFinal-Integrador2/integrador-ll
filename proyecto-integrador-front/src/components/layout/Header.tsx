import { useEffect, useRef, useState } from 'react';
import { Bell, BellOff, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar?: () => void;
  title?: string;
}

export const Header = ({ onOpenSidebar, title = 'Help Desk TI' }: HeaderProps) => {
  const [isBellOpen, setIsBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBellOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isBellOpen]);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="cursor-pointer rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-bold tracking-tight text-slate-800 md:text-xl">
          {title}
        </h1>
      </div>

      <div ref={bellRef} className="relative">
        <button
          type="button"
          onClick={() => setIsBellOpen((prev) => !prev)}
          aria-expanded={isBellOpen}
          aria-haspopup="true"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
        </button>

        {isBellOpen && (
          <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <p className="text-xs font-semibold tracking-wide text-slate-800 uppercase">
              Notificaciones
            </p>
            <div className="mt-3 flex flex-col items-center gap-2 py-4 text-center">
              <BellOff className="h-6 w-6 text-slate-300" />
              <p className="text-sm text-slate-600">No tienes notificaciones</p>
              <p className="text-xs text-slate-400">
                Aqui apareceran las alertas del sistema
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
