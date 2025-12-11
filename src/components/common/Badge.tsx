import { clsx } from 'clsx';
import { RiskSeverity, RootCauseCategory, MitigationStatus, CostImpact } from '../../types';

// ============================================================================
// Severity Badge
// ============================================================================

interface SeverityBadgeProps {
  severity: RiskSeverity;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function SeverityBadge({ severity, size = 'md', showDot = true }: SeverityBadgeProps) {
  const colorClasses: Record<RiskSeverity, string> = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    LOW: 'bg-green-100 text-green-800 border-green-200',
  };

  const dotColors: Record<RiskSeverity, string> = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const labels: Record<RiskSeverity, string> = {
    CRITICAL: 'Critical',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        colorClasses[severity],
        sizeClasses[size]
      )}
    >
      {showDot && (
        <span
          className={clsx(
            'rounded-full',
            dotColors[severity],
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            severity === 'CRITICAL' && 'animate-pulse'
          )}
        />
      )}
      {labels[severity]}
    </span>
  );
}

// ============================================================================
// Root Cause Badge
// ============================================================================

interface RootCauseBadgeProps {
  category: RootCauseCategory;
  size?: 'sm' | 'md';
}

export function RootCauseBadge({ category, size = 'md' }: RootCauseBadgeProps) {
  const labels: Record<RootCauseCategory, string> = {
    FACTORY_STRIKE: 'Factory Strike',
    TRANSPORT_DELAY: 'Transport Delay',
    WEATHER: 'Weather Event',
    CAPACITY: 'Capacity Issue',
    PORT_CONGESTION: 'Port Congestion',
    SUPPLIER_BANKRUPTCY: 'Supplier Financial',
    QUALITY_ISSUE: 'Quality Issue',
    CUSTOMS_DELAY: 'Customs Delay',
    OTHER: 'Other',
  };

  const colorClasses: Record<RootCauseCategory, string> = {
    FACTORY_STRIKE: 'bg-purple-50 text-purple-700 border-purple-200',
    TRANSPORT_DELAY: 'bg-blue-50 text-blue-700 border-blue-200',
    WEATHER: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    CAPACITY: 'bg-amber-50 text-amber-700 border-amber-200',
    PORT_CONGESTION: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    SUPPLIER_BANKRUPTCY: 'bg-rose-50 text-rose-700 border-rose-200',
    QUALITY_ISSUE: 'bg-red-50 text-red-700 border-red-200',
    CUSTOMS_DELAY: 'bg-slate-50 text-slate-700 border-slate-200',
    OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-md border',
        colorClasses[category],
        sizeClasses[size]
      )}
    >
      {labels[category]}
    </span>
  );
}

// ============================================================================
// Mitigation Status Badge
// ============================================================================

interface MitigationStatusBadgeProps {
  status: MitigationStatus;
  size?: 'sm' | 'md';
}

export function MitigationStatusBadge({ status, size = 'md' }: MitigationStatusBadgeProps) {
  const config: Record<MitigationStatus, { label: string; classes: string }> = {
    NONE: { label: 'No Action', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
    PLANNED: { label: 'Planned', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
    EXECUTING: { label: 'In Progress', classes: 'bg-amber-100 text-amber-700 border-amber-200' },
    COMPLETED: { label: 'Completed', classes: 'bg-green-100 text-green-700 border-green-200' },
    FAILED: { label: 'Failed', classes: 'bg-red-100 text-red-700 border-red-200' },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        config[status].classes,
        sizeClasses[size]
      )}
    >
      {status === 'EXECUTING' && (
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse" />
      )}
      {config[status].label}
    </span>
  );
}

// ============================================================================
// Cost Impact Badge
// ============================================================================

interface CostImpactBadgeProps {
  impact: CostImpact;
  size?: 'sm' | 'md';
}

export function CostImpactBadge({ impact, size = 'sm' }: CostImpactBadgeProps) {
  const config: Record<CostImpact, { label: string; classes: string }> = {
    LOW: { label: 'Low Cost', classes: 'bg-green-50 text-green-700' },
    MEDIUM: { label: 'Medium Cost', classes: 'bg-yellow-50 text-yellow-700' },
    HIGH: { label: 'High Cost', classes: 'bg-red-50 text-red-700' },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-md',
        config[impact].classes,
        sizeClasses[size]
      )}
    >
      {config[impact].label}
    </span>
  );
}

// ============================================================================
// Trend Badge
// ============================================================================

interface TrendBadgeProps {
  trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
  size?: 'sm' | 'md';
}

export function TrendBadge({ trend, size = 'sm' }: TrendBadgeProps) {
  const config: Record<string, { label: string; icon: string; classes: string }> = {
    IMPROVING: { label: 'Improving', icon: '↑', classes: 'text-green-600' },
    STABLE: { label: 'Stable', icon: '→', classes: 'text-gray-500' },
    WORSENING: { label: 'Worsening', icon: '↓', classes: 'text-red-600' },
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium',
        config[trend].classes,
        sizeClasses[size]
      )}
    >
      <span className="font-bold">{config[trend].icon}</span>
      {config[trend].label}
    </span>
  );
}

// ============================================================================
// Recommended Badge
// ============================================================================

export function RecommendedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full border border-primary-200">
      <svg
        className="w-3 h-3"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Recommended
    </span>
  );
}
