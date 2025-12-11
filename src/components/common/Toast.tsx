import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { ToastNotification } from '../../types';

// ============================================================================
// Toast Component
// ============================================================================

interface ToastProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto-dismiss after duration
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  const icons: Record<ToastNotification['type'], React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const borderColors: Record<ToastNotification['type'], string> = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-amber-500',
    info: 'border-l-blue-500',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 w-full max-w-sm bg-white rounded-lg shadow-elevated border border-gray-200 border-l-4 p-4 transition-all duration-200',
        borderColors[toast.type],
        isVisible && !isLeaving
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-4'
      )}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============================================================================
// Toast Container
// ============================================================================

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ToastContainer({
  toasts,
  onDismiss,
  position = 'top-right',
}: ToastContainerProps) {
  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={clsx(
        'fixed z-50 flex flex-col gap-2',
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ============================================================================
// Toast Hook
// ============================================================================

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (
    type: ToastNotification['type'],
    title: string,
    message: string,
    duration?: number
  ) => {
    const id = `toast-${++toastId}`;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (title: string, message: string, duration?: number) =>
    addToast('success', title, message, duration);

  const error = (title: string, message: string, duration?: number) =>
    addToast('error', title, message, duration);

  const warning = (title: string, message: string, duration?: number) =>
    addToast('warning', title, message, duration);

  const info = (title: string, message: string, duration?: number) =>
    addToast('info', title, message, duration);

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  };
}
