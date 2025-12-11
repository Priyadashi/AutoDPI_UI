import { clsx } from 'clsx';
import {
  Factory,
  Truck,
  CloudLightning,
  Gauge,
  Anchor,
  AlertTriangle,
  ShieldAlert,
  FileWarning,
  HelpCircle,
} from 'lucide-react';
import { RootCauseCategory, ROOT_CAUSE_LABELS } from '../../types';

interface RootCauseChipProps {
  category: RootCauseCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RootCauseChip({
  category,
  size = 'md',
  showIcon = true,
}: RootCauseChipProps) {
  const config: Record<
    RootCauseCategory,
    {
      icon: React.ReactNode;
      bgColor: string;
      textColor: string;
      borderColor: string;
      iconBgColor: string;
    }
  > = {
    FACTORY_STRIKE: {
      icon: <Factory className="w-4 h-4" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200',
      iconBgColor: 'bg-purple-100',
    },
    TRANSPORT_DELAY: {
      icon: <Truck className="w-4 h-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      iconBgColor: 'bg-blue-100',
    },
    WEATHER: {
      icon: <CloudLightning className="w-4 h-4" />,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-800',
      borderColor: 'border-cyan-200',
      iconBgColor: 'bg-cyan-100',
    },
    CAPACITY: {
      icon: <Gauge className="w-4 h-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      iconBgColor: 'bg-amber-100',
    },
    PORT_CONGESTION: {
      icon: <Anchor className="w-4 h-4" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-800',
      borderColor: 'border-indigo-200',
      iconBgColor: 'bg-indigo-100',
    },
    SUPPLIER_BANKRUPTCY: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-800',
      borderColor: 'border-rose-200',
      iconBgColor: 'bg-rose-100',
    },
    QUALITY_ISSUE: {
      icon: <ShieldAlert className="w-4 h-4" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      iconBgColor: 'bg-red-100',
    },
    CUSTOMS_DELAY: {
      icon: <FileWarning className="w-4 h-4" />,
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-200',
      iconBgColor: 'bg-slate-100',
    },
    OTHER: {
      icon: <HelpCircle className="w-4 h-4" />,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      iconBgColor: 'bg-gray-100',
    },
  };

  const sizeClasses = {
    sm: 'py-1 px-2 text-xs gap-1.5',
    md: 'py-2 px-3 text-sm gap-2',
    lg: 'py-3 px-4 text-base gap-3',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const { icon, bgColor, textColor, borderColor, iconBgColor } = config[category];

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-lg border',
        bgColor,
        borderColor,
        sizeClasses[size]
      )}
    >
      {showIcon && (
        <div
          className={clsx(
            'flex items-center justify-center rounded-md',
            iconBgColor,
            textColor,
            iconSizes[size]
          )}
        >
          {icon}
        </div>
      )}
      <div>
        <p className={clsx('font-semibold', textColor)}>
          {ROOT_CAUSE_LABELS[category]}
        </p>
        {size !== 'sm' && (
          <p className={clsx('text-xs opacity-75', textColor)}>
            Primary disruption cause
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Root Cause Detail Card
// ============================================================================

interface RootCauseDetailCardProps {
  category: RootCauseCategory;
  summary: string;
}

export function RootCauseDetailCard({ category, summary }: RootCauseDetailCardProps) {
  const config: Record<
    RootCauseCategory,
    {
      icon: React.ReactNode;
      bgGradient: string;
      iconBgColor: string;
    }
  > = {
    FACTORY_STRIKE: {
      icon: <Factory className="w-6 h-6" />,
      bgGradient: 'from-purple-500 to-purple-600',
      iconBgColor: 'bg-purple-400/30',
    },
    TRANSPORT_DELAY: {
      icon: <Truck className="w-6 h-6" />,
      bgGradient: 'from-blue-500 to-blue-600',
      iconBgColor: 'bg-blue-400/30',
    },
    WEATHER: {
      icon: <CloudLightning className="w-6 h-6" />,
      bgGradient: 'from-cyan-500 to-cyan-600',
      iconBgColor: 'bg-cyan-400/30',
    },
    CAPACITY: {
      icon: <Gauge className="w-6 h-6" />,
      bgGradient: 'from-amber-500 to-amber-600',
      iconBgColor: 'bg-amber-400/30',
    },
    PORT_CONGESTION: {
      icon: <Anchor className="w-6 h-6" />,
      bgGradient: 'from-indigo-500 to-indigo-600',
      iconBgColor: 'bg-indigo-400/30',
    },
    SUPPLIER_BANKRUPTCY: {
      icon: <AlertTriangle className="w-6 h-6" />,
      bgGradient: 'from-rose-500 to-rose-600',
      iconBgColor: 'bg-rose-400/30',
    },
    QUALITY_ISSUE: {
      icon: <ShieldAlert className="w-6 h-6" />,
      bgGradient: 'from-red-500 to-red-600',
      iconBgColor: 'bg-red-400/30',
    },
    CUSTOMS_DELAY: {
      icon: <FileWarning className="w-6 h-6" />,
      bgGradient: 'from-slate-500 to-slate-600',
      iconBgColor: 'bg-slate-400/30',
    },
    OTHER: {
      icon: <HelpCircle className="w-6 h-6" />,
      bgGradient: 'from-gray-500 to-gray-600',
      iconBgColor: 'bg-gray-400/30',
    },
  };

  const { icon, bgGradient, iconBgColor } = config[category];

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl p-4 bg-gradient-to-br text-white',
        bgGradient
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            iconBgColor
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold opacity-80">Root Cause</p>
          <h4 className="text-lg font-bold mb-1">
            {ROOT_CAUSE_LABELS[category]}
          </h4>
          <p className="text-sm opacity-90 leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
    </div>
  );
}
