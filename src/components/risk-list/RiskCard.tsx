import { clsx } from 'clsx';
import {
  AlertTriangle,
  Calendar,
  Package,
  Building2,
  TrendingDown,
  TrendingUp,
  Minus,
  Clock,
} from 'lucide-react';
import { ComponentRisk } from '../../types';
import {
  SeverityBadge,
  RootCauseBadge,
  MitigationStatusBadge,
  TrendBadge,
} from '../common/Badge';
import { format, differenceInDays } from 'date-fns';

interface RiskCardProps {
  risk: ComponentRisk;
  isSelected: boolean;
  onClick: () => void;
}

export function RiskCard({ risk, isSelected, onClick }: RiskCardProps) {
  const today = new Date();
  const disruptionStart = new Date(risk.disruptionStartDate);
  const daysUntilDisruption = differenceInDays(disruptionStart, today);

  const urgencyIndicator = () => {
    if (daysUntilDisruption <= 2) {
      return { text: 'Imminent', color: 'text-red-600', bg: 'bg-red-50' };
    } else if (daysUntilDisruption <= 7) {
      return { text: `${daysUntilDisruption}d away`, color: 'text-orange-600', bg: 'bg-orange-50' };
    } else {
      return { text: `${daysUntilDisruption}d away`, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const urgency = urgencyIndicator();

  const trendIcons = {
    IMPROVING: <TrendingUp className="w-3.5 h-3.5" />,
    STABLE: <Minus className="w-3.5 h-3.5" />,
    WORSENING: <TrendingDown className="w-3.5 h-3.5" />,
  };

  const trendColors = {
    IMPROVING: 'text-green-600',
    STABLE: 'text-gray-500',
    WORSENING: 'text-red-600',
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={clsx(
        'relative p-4 rounded-xl border cursor-pointer transition-all duration-200',
        isSelected
          ? 'bg-primary-50 border-primary-300 shadow-md ring-2 ring-primary-200'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      )}
    >
      {/* Risk Score Indicator */}
      <div
        className={clsx(
          'absolute top-0 left-0 w-1 h-full rounded-l-xl',
          risk.severity === 'CRITICAL' && 'bg-red-500',
          risk.severity === 'HIGH' && 'bg-orange-500',
          risk.severity === 'MEDIUM' && 'bg-yellow-500',
          risk.severity === 'LOW' && 'bg-green-500'
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pl-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {risk.componentName}
          </h3>
          <p className="text-xs text-gray-500 font-mono">{risk.componentId}</p>
        </div>
        <SeverityBadge severity={risk.severity} size="sm" />
      </div>

      {/* Meta Info */}
      <div className="space-y-2 pl-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{risk.supplierName}</span>
          <span className="text-gray-300">•</span>
          <span className="truncate">{risk.plantName}</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium text-gray-700">{risk.daysOfSupply}d</span>
            <span className="text-gray-500">supply</span>
          </div>

          <div className={clsx('flex items-center gap-1', trendColors[risk.trend])}>
            {trendIcons[risk.trend]}
            <span className="text-xs font-medium">{risk.trend.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 pl-2 mb-3">
        <RootCauseBadge category={risk.rootCauseCategory} size="sm" />
        {risk.mitigationStatus !== 'NONE' && (
          <MitigationStatusBadge status={risk.mitigationStatus} size="sm" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 pl-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-600">
            {format(disruptionStart, 'MMM d')} - {format(new Date(risk.disruptionEndDate), 'MMM d')}
          </span>
        </div>

        <div
          className={clsx(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            urgency.bg,
            urgency.color
          )}
        >
          <Clock className="w-3 h-3" />
          {urgency.text}
        </div>
      </div>

      {/* Risk Score Progress */}
      <div className="mt-3 pl-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Risk Score</span>
          <span className="font-semibold text-gray-700">{risk.riskScore}/100</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              risk.riskScore >= 80 && 'bg-red-500',
              risk.riskScore >= 60 && risk.riskScore < 80 && 'bg-orange-500',
              risk.riskScore >= 40 && risk.riskScore < 60 && 'bg-yellow-500',
              risk.riskScore < 40 && 'bg-green-500'
            )}
            style={{ width: `${risk.riskScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Risk Card for Dense View
// ============================================================================

interface CompactRiskCardProps {
  risk: ComponentRisk;
  isSelected: boolean;
  onClick: () => void;
}

export function CompactRiskCard({ risk, isSelected, onClick }: CompactRiskCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200',
        isSelected
          ? 'bg-primary-50 border-primary-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      <div
        className={clsx(
          'flex-shrink-0 w-2 h-10 rounded-full',
          risk.severity === 'CRITICAL' && 'bg-red-500',
          risk.severity === 'HIGH' && 'bg-orange-500',
          risk.severity === 'MEDIUM' && 'bg-yellow-500',
          risk.severity === 'LOW' && 'bg-green-500'
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">
            {risk.componentName}
          </span>
          <SeverityBadge severity={risk.severity} size="sm" showDot={false} />
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
          <span>{risk.supplierName}</span>
          <span>•</span>
          <span>{risk.daysOfSupply}d supply</span>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-xs font-medium text-gray-700">{risk.riskScore}</div>
        <div className="text-xs text-gray-400">score</div>
      </div>
    </div>
  );
}
