import { clsx } from 'clsx';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Truck,
  Plane,
  Building,
  Calendar,
  Package,
  ArrowRight,
  Target,
} from 'lucide-react';
import { MitigationOption, MitigationType } from '../../types';
import { Button } from '../common/Button';
import { RecommendedBadge, CostImpactBadge } from '../common/Badge';

interface MitigationCardProps {
  option: MitigationOption;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export function MitigationCard({
  option,
  isExpanded,
  onToggleExpand,
  onExecute,
  isExecuting,
}: MitigationCardProps) {
  const typeIcons: Record<MitigationType, React.ReactNode> = {
    ALT_SUPPLIER: <Building className="w-5 h-5" />,
    EXPEDITE_SHIPMENT: <Truck className="w-5 h-5" />,
    AIR_FREIGHT: <Plane className="w-5 h-5" />,
    RESCHEDULE_PRODUCTION: <Calendar className="w-5 h-5" />,
    ADJUST_SAFETY_STOCK: <Package className="w-5 h-5" />,
    REROUTE_TRANSPORT: <ArrowRight className="w-5 h-5" />,
    INCREASE_ORDER_QTY: <Package className="w-5 h-5" />,
  };

  const typeColors: Record<MitigationType, string> = {
    ALT_SUPPLIER: 'bg-purple-100 text-purple-600',
    EXPEDITE_SHIPMENT: 'bg-blue-100 text-blue-600',
    AIR_FREIGHT: 'bg-cyan-100 text-cyan-600',
    RESCHEDULE_PRODUCTION: 'bg-amber-100 text-amber-600',
    ADJUST_SAFETY_STOCK: 'bg-green-100 text-green-600',
    REROUTE_TRANSPORT: 'bg-indigo-100 text-indigo-600',
    INCREASE_ORDER_QTY: 'bg-orange-100 text-orange-600',
  };

  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-200',
        option.isRecommended
          ? 'border-primary-300 bg-primary-50/50 shadow-sm ring-1 ring-primary-100'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      {/* Header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        {/* Icon */}
        <div
          className={clsx(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            typeColors[option.type]
          )}
        >
          {typeIcons[option.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {option.title}
              </h4>
              {option.isRecommended && (
                <div className="mt-1">
                  <RecommendedBadge />
                </div>
              )}
            </div>
            <button
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-600">{option.description}</p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Lead Time Impact */}
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span
                className={clsx(
                  'font-medium',
                  option.estimatedLeadTimeImpactDays < 0
                    ? 'text-green-600'
                    : 'text-gray-600'
                )}
              >
                {option.estimatedLeadTimeImpactDays < 0 ? '' : '+'}
                {option.estimatedLeadTimeImpactDays}d
              </span>
            </div>

            {/* Cost Impact */}
            <CostImpactBadge impact={option.estimatedCostImpact} size="sm" />

            {/* Confidence */}
            <div className="flex items-center gap-1.5 text-xs">
              <Target className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-600">{option.confidenceScore}% confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-slide-up">
          {/* Detailed Description */}
          {option.detailedDescription && (
            <div className="bg-white rounded-lg border border-gray-100 p-3">
              <p className="text-sm text-gray-600">{option.detailedDescription}</p>
            </div>
          )}

          {/* Prerequisites */}
          {option.prerequisites && option.prerequisites.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Prerequisites
              </h5>
              <ul className="space-y-1.5">
                {option.prerequisites.map((prereq, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {option.risks && option.risks.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Potential Risks
              </h5>
              <ul className="space-y-1.5">
                {option.risks.map((risk, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-xs text-amber-700"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Outcome */}
          {option.expectedOutcome && (
            <div className="bg-green-50 rounded-lg border border-green-100 p-3">
              <h5 className="text-xs font-medium text-green-800 mb-1">
                Expected Outcome
              </h5>
              <p className="text-sm text-green-700">{option.expectedOutcome}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              variant={option.isRecommended ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onExecute();
              }}
              isLoading={isExecuting}
              leftIcon={!isExecuting && <Play className="w-4 h-4" />}
            >
              Execute Mitigation
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed Quick Action */}
      {!isExpanded && (
        <div className="px-4 pb-4">
          <Button
            variant={option.isRecommended ? 'primary' : 'secondary'}
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onExecute();
            }}
            isLoading={isExecuting}
            leftIcon={!isExecuting && <Play className="w-4 h-4" />}
          >
            Execute
          </Button>
        </div>
      )}
    </div>
  );
}
