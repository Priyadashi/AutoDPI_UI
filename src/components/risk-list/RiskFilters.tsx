import { Search, Filter, X } from 'lucide-react';
import { clsx } from 'clsx';
import {
  RiskFilters as RiskFiltersType,
  RiskSeverity,
  RootCauseCategory,
  Supplier,
  Plant,
  ROOT_CAUSE_LABELS,
} from '../../types';

interface RiskFiltersProps {
  filters: RiskFiltersType;
  onFiltersChange: (filters: RiskFiltersType) => void;
  suppliers: Supplier[];
  plants: Plant[];
  totalCount: number;
  filteredCount: number;
}

export function RiskFilters({
  filters,
  onFiltersChange,
  suppliers,
  plants,
  totalCount,
  filteredCount,
}: RiskFiltersProps) {
  const updateFilter = <K extends keyof RiskFiltersType>(
    key: K,
    value: RiskFiltersType[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      severity: 'ALL',
      rootCauseCategory: 'ALL',
      supplierId: 'ALL',
      plantId: 'ALL',
      onlyCritical: false,
      onlyNextTwoWeeks: false,
      timeHorizon: 4,
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.severity !== 'ALL' ||
    filters.rootCauseCategory !== 'ALL' ||
    filters.supplierId !== 'ALL' ||
    filters.plantId !== 'ALL' ||
    filters.onlyCritical ||
    filters.onlyNextTwoWeeks;

  return (
    <div className="space-y-4 p-4 border-b border-gray-200 bg-gray-50/50">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search components, IDs, suppliers..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
        {filters.searchQuery && (
          <button
            onClick={() => updateFilter('searchQuery', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdowns Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Severity Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Severity
          </label>
          <select
            value={filters.severity}
            onChange={(e) =>
              updateFilter('severity', e.target.value as RiskSeverity | 'ALL')
            }
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Root Cause Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Root Cause
          </label>
          <select
            value={filters.rootCauseCategory}
            onChange={(e) =>
              updateFilter(
                'rootCauseCategory',
                e.target.value as RootCauseCategory | 'ALL'
              )
            }
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Causes</option>
            {Object.entries(ROOT_CAUSE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Supplier
          </label>
          <select
            value={filters.supplierId}
            onChange={(e) => updateFilter('supplierId', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plant Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Plant
          </label>
          <select
            value={filters.plantId}
            onChange={(e) => updateFilter('plantId', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Plants</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="flex flex-wrap gap-2">
        <label
          className={clsx(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm',
            filters.onlyCritical
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          <input
            type="checkbox"
            checked={filters.onlyCritical}
            onChange={(e) => updateFilter('onlyCritical', e.target.checked)}
            className="sr-only"
          />
          <span
            className={clsx(
              'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
              filters.onlyCritical
                ? 'bg-red-500 border-red-500'
                : 'border-gray-300'
            )}
          >
            {filters.onlyCritical && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10.28 2.72a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.5 7.94l4.97-4.97a.75.75 0 011.06 0z" />
              </svg>
            )}
          </span>
          Critical Only
        </label>

        <label
          className={clsx(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm',
            filters.onlyNextTwoWeeks
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          <input
            type="checkbox"
            checked={filters.onlyNextTwoWeeks}
            onChange={(e) => updateFilter('onlyNextTwoWeeks', e.target.checked)}
            className="sr-only"
          />
          <span
            className={clsx(
              'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
              filters.onlyNextTwoWeeks
                ? 'bg-primary-500 border-primary-500'
                : 'border-gray-300'
            )}
          >
            {filters.onlyNextTwoWeeks && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10.28 2.72a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.5 7.94l4.97-4.97a.75.75 0 011.06 0z" />
              </svg>
            )}
          </span>
          Next 2 Weeks
        </label>
      </div>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">{filteredCount}</span>{' '}
            of {totalCount} risks
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
