/**
 * API Service Layer
 *
 * This module provides a clean interface for data operations.
 * Currently uses mock data, but designed for easy integration with real APIs.
 *
 * To integrate with real backend:
 * 1. Replace mock implementations with actual fetch/axios calls
 * 2. Update base URL configuration
 * 3. Add authentication headers as needed
 */

import {
  ComponentRisk,
  MitigationOption,
  CoachPanelData,
  MitigationExecutionResult,
  RiskFilters,
  Supplier,
  Plant,
  ApiResponse,
} from '../types';
import {
  mockComponentRisks,
  mockSuppliers,
  mockPlants,
  getComponentRiskById,
  generateCoachPanelData,
  filterComponentRisks,
  getMitigationOptionsForComponent,
} from './mockData';

// ============================================================================
// Configuration
// ============================================================================

// Base URL for API calls - update this when connecting to real backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Simulated network delay for realistic UX testing (ms)
const MOCK_DELAY = 300;

// Helper to simulate network latency
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Component Risk APIs
// ============================================================================

/**
 * Fetch all component risks with optional filtering
 */
export async function fetchComponentRisks(
  filters?: Partial<RiskFilters>
): Promise<ApiResponse<ComponentRisk[]>> {
  await delay(MOCK_DELAY);

  // In real implementation:
  // const response = await fetch(`${API_BASE_URL}/risks?${buildQueryParams(filters)}`);
  // return response.json();

  const filteredRisks = filters
    ? filterComponentRisks(mockComponentRisks, filters)
    : mockComponentRisks;

  // Sort by risk score (highest first)
  const sortedRisks = [...filteredRisks].sort((a, b) => b.riskScore - a.riskScore);

  return {
    data: sortedRisks,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetch a single component risk by ID
 */
export async function fetchComponentRiskById(
  id: string
): Promise<ApiResponse<ComponentRisk | null>> {
  await delay(MOCK_DELAY / 2);

  // In real implementation:
  // const response = await fetch(`${API_BASE_URL}/risks/${id}`);
  // return response.json();

  const risk = getComponentRiskById(id);

  return {
    data: risk || null,
    success: !!risk,
    message: risk ? undefined : 'Component risk not found',
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Coach Panel APIs
// ============================================================================

/**
 * Fetch coach panel data for a specific component risk
 */
export async function fetchCoachPanelData(
  componentRiskId: string
): Promise<ApiResponse<CoachPanelData | null>> {
  await delay(MOCK_DELAY);

  // In real implementation:
  // const response = await fetch(`${API_BASE_URL}/coach/${componentRiskId}`);
  // return response.json();

  const risk = getComponentRiskById(componentRiskId);
  if (!risk) {
    return {
      data: null,
      success: false,
      message: 'Component risk not found',
      timestamp: new Date().toISOString(),
    };
  }

  const coachData = generateCoachPanelData(risk);

  return {
    data: coachData,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Mitigation APIs
// ============================================================================

/**
 * Fetch mitigation options for a component risk
 */
export async function fetchMitigationOptions(
  componentRiskId: string
): Promise<ApiResponse<MitigationOption[]>> {
  await delay(MOCK_DELAY / 2);

  // In real implementation:
  // const response = await fetch(`${API_BASE_URL}/mitigations?componentRiskId=${componentRiskId}`);
  // return response.json();

  const options = getMitigationOptionsForComponent(componentRiskId);

  return {
    data: options,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Execute a mitigation action
 *
 * This is the main action endpoint that would:
 * - Place order at alternate supplier
 * - Expedite shipment
 * - Reschedule production
 * - Re-route transport
 * - etc.
 */
export async function executeMitigation(
  mitigationId: string,
  componentRiskId: string
): Promise<ApiResponse<MitigationExecutionResult>> {
  // Simulate longer delay for action execution
  await delay(MOCK_DELAY * 3);

  // In real implementation:
  // const response = await fetch(`${API_BASE_URL}/mitigations/${mitigationId}/execute`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ componentRiskId }),
  // });
  // return response.json();

  // Simulate 90% success rate for demo
  const success = Math.random() > 0.1;

  const result: MitigationExecutionResult = {
    success,
    mitigationId,
    componentRiskId,
    message: success
      ? 'Mitigation action initiated successfully. You will receive updates on progress.'
      : 'Failed to initiate mitigation. Please try again or contact support.',
    timestamp: new Date().toISOString(),
    referenceNumber: success ? `MIT-${Date.now().toString(36).toUpperCase()}` : undefined,
    estimatedCompletionDate: success
      ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  };

  return {
    data: result,
    success,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Reference Data APIs
// ============================================================================

/**
 * Fetch list of suppliers for filter dropdown
 */
export async function fetchSuppliers(): Promise<ApiResponse<Supplier[]>> {
  await delay(MOCK_DELAY / 2);

  return {
    data: mockSuppliers,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetch list of plants for filter dropdown
 */
export async function fetchPlants(): Promise<ApiResponse<Plant[]>> {
  await delay(MOCK_DELAY / 2);

  return {
    data: mockPlants,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Update component risk status (for optimistic UI updates)
 * This would typically be handled by the backend after mitigation execution
 */
export function updateComponentRiskStatus(
  componentRiskId: string,
  updates: Partial<ComponentRisk>
): ComponentRisk | null {
  const riskIndex = mockComponentRisks.findIndex((r) => r.id === componentRiskId);
  if (riskIndex === -1) return null;

  // In real implementation, this would be a PUT/PATCH request
  // For now, we update the mock data in memory
  mockComponentRisks[riskIndex] = {
    ...mockComponentRisks[riskIndex],
    ...updates,
  };

  return mockComponentRisks[riskIndex];
}

// ============================================================================
// Export API object for convenient access
// ============================================================================

export const api = {
  risks: {
    getAll: fetchComponentRisks,
    getById: fetchComponentRiskById,
  },
  coach: {
    getData: fetchCoachPanelData,
  },
  mitigations: {
    getOptions: fetchMitigationOptions,
    execute: executeMitigation,
  },
  reference: {
    getSuppliers: fetchSuppliers,
    getPlants: fetchPlants,
  },
};

export default api;
