/**
 * Supply Risk Control Tower - Type Definitions
 *
 * These types define the core data structures used throughout the application.
 * They are designed to be compatible with future backend API integration.
 */

// ============================================================================
// Enums and Constants
// ============================================================================

export type RootCauseCategory =
  | "FACTORY_STRIKE"
  | "TRANSPORT_DELAY"
  | "WEATHER"
  | "CAPACITY"
  | "PORT_CONGESTION"
  | "SUPPLIER_BANKRUPTCY"
  | "QUALITY_ISSUE"
  | "CUSTOMS_DELAY"
  | "OTHER";

export type RiskSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type MitigationStatus = "NONE" | "PLANNED" | "EXECUTING" | "COMPLETED" | "FAILED";

export type MitigationType =
  | "ALT_SUPPLIER"
  | "EXPEDITE_SHIPMENT"
  | "AIR_FREIGHT"
  | "RESCHEDULE_PRODUCTION"
  | "ADJUST_SAFETY_STOCK"
  | "REROUTE_TRANSPORT"
  | "INCREASE_ORDER_QTY";

export type CostImpact = "LOW" | "MEDIUM" | "HIGH";

export type TimeHorizon = 1 | 2 | 3 | 4; // weeks

// ============================================================================
// Core Data Interfaces
// ============================================================================

/**
 * Represents a component or material at risk of supply disruption
 */
export interface ComponentRisk {
  id: string;
  componentId: string;
  componentName: string;
  supplierName: string;
  supplierId: string;
  plantName: string;
  plantId: string;
  severity: RiskSeverity;
  daysOfSupply: number;
  demandPerDay: number;
  currentStock: number;
  disruptionStartDate: string; // ISO date string
  disruptionEndDate: string;   // ISO date string
  rootCauseCategory: RootCauseCategory;
  rootCauseSummary: string;
  mitigationStatus: MitigationStatus;
  activeMitigationId?: string;
  riskScore: number; // 0-100
  trend: "IMPROVING" | "STABLE" | "WORSENING";
  lastUpdated: string; // ISO date string
}

/**
 * Represents a possible mitigation action
 */
export interface MitigationOption {
  id: string;
  componentRiskId: string;
  title: string;
  description: string;
  detailedDescription?: string;
  isRecommended: boolean;
  estimatedLeadTimeImpactDays: number;
  estimatedCostImpact: CostImpact;
  confidenceScore: number; // 0-100
  type: MitigationType;
  prerequisites?: string[];
  risks?: string[];
  expectedOutcome?: string;
}

/**
 * Data for the coach/assistant panel
 */
export interface CoachPanelData {
  componentRisk: ComponentRisk;
  rootCauseNarrative: string; // Human-friendly explanation
  impactSummary: string;
  mitigationOptions: MitigationOption[];
  additionalInsights?: string[];
}

/**
 * Result of executing a mitigation action
 */
export interface MitigationExecutionResult {
  success: boolean;
  mitigationId: string;
  componentRiskId: string;
  message: string;
  timestamp: string;
  referenceNumber?: string;
  estimatedCompletionDate?: string;
}

// ============================================================================
// Filter and Query Types
// ============================================================================

export interface RiskFilters {
  searchQuery: string;
  severity: RiskSeverity | "ALL";
  rootCauseCategory: RootCauseCategory | "ALL";
  supplierId: string | "ALL";
  plantId: string | "ALL";
  onlyCritical: boolean;
  onlyNextTwoWeeks: boolean;
  timeHorizon: TimeHorizon;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
}

export interface Plant {
  id: string;
  name: string;
  region: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

export interface AppState {
  selectedComponentId: string | null;
  filters: RiskFilters;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// API Response Types (for future integration)
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

export type SeverityColorMap = Record<RiskSeverity, string>;

export type RootCauseLabelMap = Record<RootCauseCategory, string>;

export type MitigationTypeLabelMap = Record<MitigationType, string>;

// ============================================================================
// Constants
// ============================================================================

export const SEVERITY_LABELS: Record<RiskSeverity, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const ROOT_CAUSE_LABELS: RootCauseLabelMap = {
  FACTORY_STRIKE: "Factory Strike",
  TRANSPORT_DELAY: "Transport Delay",
  WEATHER: "Weather Event",
  CAPACITY: "Capacity Constraint",
  PORT_CONGESTION: "Port Congestion",
  SUPPLIER_BANKRUPTCY: "Supplier Financial",
  QUALITY_ISSUE: "Quality Issue",
  CUSTOMS_DELAY: "Customs Delay",
  OTHER: "Other",
};

export const MITIGATION_TYPE_LABELS: MitigationTypeLabelMap = {
  ALT_SUPPLIER: "Alternate Supplier",
  EXPEDITE_SHIPMENT: "Expedite Shipment",
  AIR_FREIGHT: "Air Freight",
  RESCHEDULE_PRODUCTION: "Reschedule Production",
  ADJUST_SAFETY_STOCK: "Adjust Safety Stock",
  REROUTE_TRANSPORT: "Re-route Transport",
  INCREASE_ORDER_QTY: "Increase Order Quantity",
};

export const SEVERITY_COLORS: SeverityColorMap = {
  CRITICAL: "#dc2626",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};
