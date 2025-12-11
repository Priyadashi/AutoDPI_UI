import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Bot,
  AlertCircle,
  TrendingDown,
  Lightbulb,
  ChevronRight,
  Package,
  Calendar,
  Building2,
  Info,
  Zap,
} from 'lucide-react';
import {
  CoachPanelData,
  MitigationOption,
  ComponentRisk,
} from '../../types';
import { MitigationCard } from './MitigationCard';
import { RootCauseChip } from './RootCauseChip';
import { PanelHeader, PanelContent } from '../layout/MainLayout';
import { SeverityBadge, MitigationStatusBadge } from '../common/Badge';
import { Spinner } from '../common/Spinner';
import { format, differenceInDays } from 'date-fns';

interface CoachPanelProps {
  data: CoachPanelData | null;
  isLoading: boolean;
  onExecuteMitigation: (mitigationId: string) => Promise<void>;
  executingMitigationId: string | null;
}

export function CoachPanel({
  data,
  isLoading,
  onExecuteMitigation,
  executingMitigationId,
}: CoachPanelProps) {
  const [expandedMitigationId, setExpandedMitigationId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <PanelHeader
          title="Supply Coach"
          subtitle="AI-powered recommendations"
          icon={<Bot className="w-4 h-4" />}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-3 text-sm text-gray-500">Analyzing risk...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col h-full">
        <PanelHeader
          title="Supply Coach"
          subtitle="AI-powered recommendations"
          icon={<Bot className="w-4 h-4" />}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <EmptyCoachState />
        </div>
      </div>
    );
  }

  const { componentRisk, rootCauseNarrative, impactSummary, mitigationOptions, additionalInsights } = data;
  const today = new Date();
  const daysUntilDisruption = differenceInDays(new Date(componentRisk.disruptionStartDate), today);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PanelHeader
        title="Supply Coach"
        subtitle="AI-powered recommendations"
        icon={<Bot className="w-4 h-4 text-primary-600" />}
        action={
          <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-50 rounded-full">
            <Zap className="w-3.5 h-3.5 text-primary-600" />
            <span className="text-xs font-medium text-primary-700">Active</span>
          </div>
        }
      />

      <PanelContent className="space-y-6">
        {/* Component Summary Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {componentRisk.componentName}
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {componentRisk.componentId}
              </p>
            </div>
            <SeverityBadge severity={componentRisk.severity} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{componentRisk.supplierName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Package className="w-3.5 h-3.5 text-gray-400" />
              <span>{componentRisk.daysOfSupply} days supply</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {format(new Date(componentRisk.disruptionStartDate), 'MMM d')} -{' '}
                {format(new Date(componentRisk.disruptionEndDate), 'MMM d')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MitigationStatusBadge status={componentRisk.mitigationStatus} size="sm" />
            </div>
          </div>

          {/* Urgency Alert */}
          {daysUntilDisruption <= 7 && (
            <div
              className={clsx(
                'mt-3 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium',
                daysUntilDisruption <= 2
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
              )}
            >
              <AlertCircle className="w-4 h-4" />
              {daysUntilDisruption <= 0
                ? 'Disruption window is active!'
                : daysUntilDisruption === 1
                ? 'Disruption starts tomorrow!'
                : `Disruption starts in ${daysUntilDisruption} days`}
            </div>
          )}
        </div>

        {/* Root Cause Section */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <TrendingDown className="w-4 h-4" />
            Root Cause Analysis
          </h4>

          <div className="space-y-3">
            {/* Root Cause Chip */}
            <RootCauseChip category={componentRisk.rootCauseCategory} />

            {/* Narrative */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: rootCauseNarrative.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="font-semibold text-gray-900">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div
              className={clsx(
                'p-3 rounded-lg text-sm',
                impactSummary.includes('Urgent')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              )}
              dangerouslySetInnerHTML={{
                __html: impactSummary.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="font-semibold">$1</strong>'
                ),
              }}
            />
          </div>
        </div>

        {/* Mitigation Options */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <Lightbulb className="w-4 h-4" />
            Recommended Actions
          </h4>

          <div className="space-y-3">
            {mitigationOptions.map((option) => (
              <MitigationCard
                key={option.id}
                option={option}
                isExpanded={expandedMitigationId === option.id}
                onToggleExpand={() =>
                  setExpandedMitigationId(
                    expandedMitigationId === option.id ? null : option.id
                  )
                }
                onExecute={() => onExecuteMitigation(option.id)}
                isExecuting={executingMitigationId === option.id}
              />
            ))}
          </div>
        </div>

        {/* Additional Insights */}
        {additionalInsights && additionalInsights.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <Info className="w-4 h-4" />
              Additional Insights
            </h4>

            <div className="space-y-2">
              {additionalInsights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PanelContent>
    </div>
  );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyCoachState() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Bot className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        Select a component
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        Click on a component in the risk list or timeline to see detailed analysis and recommended mitigations.
      </p>
    </div>
  );
}
