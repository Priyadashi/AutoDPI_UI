import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface MainLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
  leftPanelWidth?: string;
  rightPanelWidth?: string;
  className?: string;
}

export function MainLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  leftPanelWidth = 'w-[340px]',
  rightPanelWidth = 'w-[380px]',
  className,
}: MainLayoutProps) {
  return (
    <div
      className={clsx(
        'flex flex-1 overflow-hidden bg-surface-50',
        className
      )}
    >
      {/* Left Panel - Risk Overview */}
      <aside
        className={clsx(
          'flex-shrink-0 overflow-hidden border-r border-gray-200 bg-white',
          leftPanelWidth
        )}
      >
        {leftPanel}
      </aside>

      {/* Center Panel - Timeline/Gantt */}
      <main className="flex-1 overflow-hidden">
        {centerPanel}
      </main>

      {/* Right Panel - Coach/Actions */}
      <aside
        className={clsx(
          'flex-shrink-0 overflow-hidden border-l border-gray-200 bg-white',
          rightPanelWidth
        )}
      >
        {rightPanel}
      </aside>
    </div>
  );
}

// ============================================================================
// Panel Components
// ============================================================================

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PanelHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: PanelHeaderProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface PanelContentProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PanelContent({
  children,
  className,
  noPadding = false,
}: PanelContentProps) {
  return (
    <div
      className={clsx(
        'flex-1 overflow-y-auto',
        !noPadding && 'p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Responsive Layout Wrapper
// ============================================================================

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-50">
      {children}
    </div>
  );
}
