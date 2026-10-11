import { useEffect, useState, type ReactNode } from 'react';

const EXIT_DURATION_MS = 250;
export interface BaseModalProps { isOpen: boolean; onClose: () => void; children: ReactNode; maxWidth?: string }

export const BaseModal = ({ isOpen, onClose, children, maxWidth = 'max-w-xl' }: BaseModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  if (isOpen && !isMounted) {
    setIsMounted(true);
    setIsVisible(false);
  } else if (!isOpen && isMounted && isVisible) {
    setIsVisible(false);
  }

  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isOpen || !isMounted) return;
    const timer = setTimeout(() => setIsMounted(false), EXIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-250 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white p-6 md:p-8 shadow-2xl z-10 transform transition-all duration-250 ease-out ${isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
