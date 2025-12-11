import { useState, useMemo } from 'react';
import { AlertTriangle, List, Grid3X3 } from 'lucide-react';
import { clsx } from 'clsx';
import { ComponentRisk, RiskFilters as RiskFiltersType, Supplier, Plant } from '../../types';
import { RiskFilters } from './RiskFilters';
import { RiskCard, CompactRiskCard } from './RiskCard';
import { PanelHeader, PanelContent } from '../layout/MainLayout';
import { SkeletonList } from '../common/Spinner';

type ViewMode = 'detailed' | 'compact';

interface RiskListProps {
  risks: ComponentRisk[];
  selectedRiskId: string | null;
  onSelectRisk: (riskId: string) => void;
  filters: RiskFiltersType;
  onFiltersChange: (filters: RiskFiltersType) => void;
  suppliers: Supplier[];
  plants: Plant[];
  isLoading?: boolean;
}

export function RiskList({
  risks,
  selectedRiskId,
  onSelectRisk,
  filters,
  onFiltersChange,
  suppliers,
  plants,
  isLoading = false,
}: RiskListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');

  // Filter risks based on current filters
  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          risk.componentName.toLowerCase().includes(query) ||
          risk.componentId.toLowerCase().includes(query) ||
          risk.supplierName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Severity filter
      if (filters.severity !== 'ALL' && risk.severity !== filters.severity) {
        return false;
      }

      // Root cause filter
      if (filters.rootCauseCategory !== 'ALL' && risk.rootCauseCategory !== filters.rootCauseCategory) {
        return false;
      }

      // Supplier filter
      if (filters.supplierId !== 'ALL' && risk.supplierId !== filters.supplierId) {
        return false;
      }

      // Plant filter
      if (filters.plantId !== 'ALL' && risk.plantId !== filters.plantId) {
        return false;
      }

      // Critical only
      if (filters.onlyCritical && risk.severity !== 'CRITICAL') {
        return false;
      }

      // Time horizon filter
      if (filters.onlyNextTwoWeeks) {
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
        const disruptionStart = new Date(risk.disruptionStartDate);
        if (disruptionStart > twoWeeksFromNow) return false;
      }

      return true;
    });
  }, [risks, filters]);

  // Sort by risk score
  const sortedRisks = useMemo(() => {
    return [...filteredRisks].sort((a, b) => b.riskScore - a.riskScore);
  }, [filteredRisks]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PanelHeader
        title="Risk Overview"
        subtitle={`${sortedRisks.length} at-risk components`}
        icon={<AlertTriangle className="w-4 h-4" />}
        action={
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('detailed')}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'detailed'
                  ? 'bg-white text-gray-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              aria-label="Detailed view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'compact'
                  ? 'bg-white text-gray-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              aria-label="Compact view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Filters */}
      <RiskFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        suppliers={suppliers}
        plants={plants}
        totalCount={risks.length}
        filteredCount={sortedRisks.length}
      />

      {/* Risk List */}
      <PanelContent className="space-y-3">
        {isLoading ? (
          <SkeletonList count={5} />
        ) : sortedRisks.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'detailed' ? (
          sortedRisks.map((risk) => (
            <RiskCard
              key={risk.id}
              risk={risk}
              isSelected={risk.id === selectedRiskId}
              onClick={() => onSelectRisk(risk.id)}
            />
          ))
        ) : (
          sortedRisks.map((risk) => (
            <CompactRiskCard
              key={risk.id}
              risk={risk}
              isSelected={risk.id === selectedRiskId}
              onClick={() => onSelectRisk(risk.id)}
            />
          ))
        )}
      </PanelContent>
    </div>
  );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">No risks found</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        No components match your current filters. Try adjusting your search criteria.
      </p>
    </div>
  );
}
