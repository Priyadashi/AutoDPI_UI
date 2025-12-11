import { useState, useEffect, useCallback } from 'react';
import {
  ComponentRisk,
  RiskFilters,
  Supplier,
  Plant,
  TimeHorizon,
} from '../types';
import { api } from '../services/api';
import { mockSuppliers, mockPlants } from '../services/mockData';

interface UseComponentRisksResult {
  risks: ComponentRisk[];
  filteredRisks: ComponentRisk[];
  suppliers: Supplier[];
  plants: Plant[];
  filters: RiskFilters;
  setFilters: (filters: RiskFilters) => void;
  selectedRiskId: string | null;
  setSelectedRiskId: (id: string | null) => void;
  timeHorizon: TimeHorizon;
  setTimeHorizon: (horizon: TimeHorizon) => void;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultFilters: RiskFilters = {
  searchQuery: '',
  severity: 'ALL',
  rootCauseCategory: 'ALL',
  supplierId: 'ALL',
  plantId: 'ALL',
  onlyCritical: false,
  onlyNextTwoWeeks: false,
  timeHorizon: 4,
};

export function useComponentRisks(): UseComponentRisksResult {
  const [risks, setRisks] = useState<ComponentRisk[]>([]);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [plants] = useState<Plant[]>(mockPlants);
  const [filters, setFilters] = useState<RiskFilters>(defaultFilters);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(4);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch risks
  const fetchRisks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.risks.getAll({
        ...filters,
        timeHorizon,
      });

      if (response.success) {
        setRisks(response.data);

        // Auto-select first risk if none selected
        if (!selectedRiskId && response.data.length > 0) {
          setSelectedRiskId(response.data[0].id);
        }
      } else {
        setError(response.message || 'Failed to fetch risks');
      }
    } catch (err) {
      setError('An error occurred while fetching risks');
      console.error('Error fetching risks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timeHorizon]);

  // Initial fetch
  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  // Filter risks locally
  const filteredRisks = risks.filter((risk) => {
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

  return {
    risks,
    filteredRisks,
    suppliers,
    plants,
    filters,
    setFilters,
    selectedRiskId,
    setSelectedRiskId,
    timeHorizon,
    setTimeHorizon,
    isLoading,
    error,
    refresh: fetchRisks,
  };
}
