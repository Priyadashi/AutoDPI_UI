/**
 * Mock Data for Supply Risk Control Tower
 *
 * This file contains realistic mock data to demonstrate the UI.
 * All dates are relative to the current date to ensure the timeline looks current.
 */

import {
  ComponentRisk,
  MitigationOption,
  CoachPanelData,
  Supplier,
  Plant,
  RootCauseCategory,
  RiskSeverity,
} from '../types';
import { addDays, format, subDays } from 'date-fns';

// Helper to generate dates relative to today
const today = new Date();
const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

// ============================================================================
// Suppliers and Plants
// ============================================================================

export const mockSuppliers: Supplier[] = [
  { id: 'SUP001', name: 'Acme Electronics', location: 'Shenzhen, China' },
  { id: 'SUP002', name: 'GlobalTech Components', location: 'Taipei, Taiwan' },
  { id: 'SUP003', name: 'EuroMetal GmbH', location: 'Munich, Germany' },
  { id: 'SUP004', name: 'Pacific Polymers', location: 'Seoul, South Korea' },
  { id: 'SUP005', name: 'Nordic Precision', location: 'Stockholm, Sweden' },
  { id: 'SUP006', name: 'Delta Manufacturing', location: 'Ho Chi Minh City, Vietnam' },
];

export const mockPlants: Plant[] = [
  { id: 'PLT001', name: 'Austin Assembly', region: 'North America' },
  { id: 'PLT002', name: 'Shanghai Production', region: 'Asia Pacific' },
  { id: 'PLT003', name: 'Berlin Manufacturing', region: 'Europe' },
  { id: 'PLT004', name: 'Mexico City Plant', region: 'Latin America' },
];

// ============================================================================
// Component Risks
// ============================================================================

export const mockComponentRisks: ComponentRisk[] = [
  {
    id: 'RISK001',
    componentId: 'IC-78201-A',
    componentName: 'Power Management IC',
    supplierName: 'Acme Electronics',
    supplierId: 'SUP001',
    plantName: 'Austin Assembly',
    plantId: 'PLT001',
    severity: 'CRITICAL',
    daysOfSupply: 3,
    demandPerDay: 2500,
    currentStock: 7500,
    disruptionStartDate: formatDate(addDays(today, 2)),
    disruptionEndDate: formatDate(addDays(today, 14)),
    rootCauseCategory: 'FACTORY_STRIKE',
    rootCauseSummary: 'Labor dispute at main production facility. Workers demanding wage increases. Negotiations ongoing.',
    mitigationStatus: 'NONE',
    riskScore: 92,
    trend: 'WORSENING',
    lastUpdated: formatDate(subDays(today, 1)),
  },
  {
    id: 'RISK002',
    componentId: 'CAP-550-X2',
    componentName: 'Multilayer Ceramic Capacitor',
    supplierName: 'GlobalTech Components',
    supplierId: 'SUP002',
    plantName: 'Shanghai Production',
    plantId: 'PLT002',
    severity: 'CRITICAL',
    daysOfSupply: 5,
    demandPerDay: 15000,
    currentStock: 75000,
    disruptionStartDate: formatDate(addDays(today, 5)),
    disruptionEndDate: formatDate(addDays(today, 18)),
    rootCauseCategory: 'PORT_CONGESTION',
    rootCauseSummary: 'Severe congestion at Kaohsiung port. Container backlog exceeds 10,000 TEUs. Expected clearance time: 7-10 days.',
    mitigationStatus: 'NONE',
    riskScore: 88,
    trend: 'STABLE',
    lastUpdated: formatDate(today),
  },
  {
    id: 'RISK003',
    componentId: 'ALU-FRAME-200',
    componentName: 'Aluminum Chassis Frame',
    supplierName: 'EuroMetal GmbH',
    supplierId: 'SUP003',
    plantName: 'Berlin Manufacturing',
    plantId: 'PLT003',
    severity: 'HIGH',
    daysOfSupply: 8,
    demandPerDay: 450,
    currentStock: 3600,
    disruptionStartDate: formatDate(addDays(today, 7)),
    disruptionEndDate: formatDate(addDays(today, 21)),
    rootCauseCategory: 'WEATHER',
    rootCauseSummary: 'Severe winter storm affecting transport routes in Bavaria. Road closures expected for 5-7 days.',
    mitigationStatus: 'PLANNED',
    activeMitigationId: 'MIT003A',
    riskScore: 75,
    trend: 'IMPROVING',
    lastUpdated: formatDate(today),
  },
  {
    id: 'RISK004',
    componentId: 'LCD-15.6-FHD',
    componentName: '15.6" LCD Display Panel',
    supplierName: 'GlobalTech Components',
    supplierId: 'SUP002',
    plantName: 'Austin Assembly',
    plantId: 'PLT001',
    severity: 'HIGH',
    daysOfSupply: 6,
    demandPerDay: 800,
    currentStock: 4800,
    disruptionStartDate: formatDate(addDays(today, 4)),
    disruptionEndDate: formatDate(addDays(today, 12)),
    rootCauseCategory: 'CAPACITY',
    rootCauseSummary: 'Production line running at 120% capacity. Lead times extended by 3 weeks due to high demand.',
    mitigationStatus: 'NONE',
    riskScore: 72,
    trend: 'WORSENING',
    lastUpdated: formatDate(subDays(today, 2)),
  },
  {
    id: 'RISK005',
    componentId: 'POLY-CASE-M2',
    componentName: 'Polymer Housing Case',
    supplierName: 'Pacific Polymers',
    supplierId: 'SUP004',
    plantName: 'Shanghai Production',
    plantId: 'PLT002',
    severity: 'MEDIUM',
    daysOfSupply: 12,
    demandPerDay: 3000,
    currentStock: 36000,
    disruptionStartDate: formatDate(addDays(today, 10)),
    disruptionEndDate: formatDate(addDays(today, 17)),
    rootCauseCategory: 'CUSTOMS_DELAY',
    rootCauseSummary: 'New customs regulations requiring additional documentation. Average clearance time increased from 2 to 5 days.',
    mitigationStatus: 'NONE',
    riskScore: 58,
    trend: 'STABLE',
    lastUpdated: formatDate(today),
  },
  {
    id: 'RISK006',
    componentId: 'CONN-USB-C',
    componentName: 'USB-C Connector Module',
    supplierName: 'Acme Electronics',
    supplierId: 'SUP001',
    plantName: 'Mexico City Plant',
    plantId: 'PLT004',
    severity: 'MEDIUM',
    daysOfSupply: 10,
    demandPerDay: 5000,
    currentStock: 50000,
    disruptionStartDate: formatDate(addDays(today, 8)),
    disruptionEndDate: formatDate(addDays(today, 15)),
    rootCauseCategory: 'TRANSPORT_DELAY',
    rootCauseSummary: 'Shipping vessel delayed due to mechanical issues. Estimated arrival pushed back 5 days.',
    mitigationStatus: 'EXECUTING',
    activeMitigationId: 'MIT006A',
    riskScore: 52,
    trend: 'IMPROVING',
    lastUpdated: formatDate(today),
  },
  {
    id: 'RISK007',
    componentId: 'BATT-LI-4000',
    componentName: 'Lithium Battery Pack 4000mAh',
    supplierName: 'Delta Manufacturing',
    supplierId: 'SUP006',
    plantName: 'Austin Assembly',
    plantId: 'PLT001',
    severity: 'HIGH',
    daysOfSupply: 7,
    demandPerDay: 1200,
    currentStock: 8400,
    disruptionStartDate: formatDate(addDays(today, 3)),
    disruptionEndDate: formatDate(addDays(today, 11)),
    rootCauseCategory: 'QUALITY_ISSUE',
    rootCauseSummary: 'Quality control flagged batch inconsistency. Supplier conducting root cause analysis. Shipments on hold.',
    mitigationStatus: 'NONE',
    riskScore: 78,
    trend: 'WORSENING',
    lastUpdated: formatDate(today),
  },
  {
    id: 'RISK008',
    componentId: 'SENSOR-TEMP-01',
    componentName: 'Temperature Sensor Array',
    supplierName: 'Nordic Precision',
    supplierId: 'SUP005',
    plantName: 'Berlin Manufacturing',
    plantId: 'PLT003',
    severity: 'LOW',
    daysOfSupply: 18,
    demandPerDay: 2000,
    currentStock: 36000,
    disruptionStartDate: formatDate(addDays(today, 14)),
    disruptionEndDate: formatDate(addDays(today, 20)),
    rootCauseCategory: 'CAPACITY',
    rootCauseSummary: 'Minor capacity constraints due to equipment maintenance. Limited impact expected.',
    mitigationStatus: 'NONE',
    riskScore: 32,
    trend: 'STABLE',
    lastUpdated: formatDate(subDays(today, 3)),
  },
  {
    id: 'RISK009',
    componentId: 'PCB-MAIN-V3',
    componentName: 'Main Logic PCB Assembly',
    supplierName: 'GlobalTech Components',
    supplierId: 'SUP002',
    plantName: 'Austin Assembly',
    plantId: 'PLT001',
    severity: 'CRITICAL',
    daysOfSupply: 4,
    demandPerDay: 600,
    currentStock: 2400,
    disruptionStartDate: formatDate(addDays(today, 1)),
    disruptionEndDate: formatDate(addDays(today, 9)),
    rootCauseCategory: 'FACTORY_STRIKE',
    rootCauseSummary: 'Work stoppage at secondary assembly line. Union negotiations underway. Resolution expected within 5-7 days.',
    mitigationStatus: 'PLANNED',
    activeMitigationId: 'MIT009A',
    riskScore: 95,
    trend: 'STABLE',
    lastUpdated: formatDate(today),
  },
  {
    id: 'RISK010',
    componentId: 'HEATSINK-CU',
    componentName: 'Copper Heat Sink Module',
    supplierName: 'EuroMetal GmbH',
    supplierId: 'SUP003',
    plantName: 'Shanghai Production',
    plantId: 'PLT002',
    severity: 'LOW',
    daysOfSupply: 21,
    demandPerDay: 1500,
    currentStock: 31500,
    disruptionStartDate: formatDate(addDays(today, 18)),
    disruptionEndDate: formatDate(addDays(today, 25)),
    rootCauseCategory: 'TRANSPORT_DELAY',
    rootCauseSummary: 'Routine shipping schedule adjustment. No significant impact expected.',
    mitigationStatus: 'NONE',
    riskScore: 25,
    trend: 'STABLE',
    lastUpdated: formatDate(subDays(today, 1)),
  },
];

// ============================================================================
// Mitigation Options
// ============================================================================

const createMitigationOptions = (risk: ComponentRisk): MitigationOption[] => {
  const baseOptions: Record<RootCauseCategory, MitigationOption[]> = {
    FACTORY_STRIKE: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Switch to Alternate Supplier',
        description: 'Source from qualified backup supplier with available capacity',
        detailedDescription: 'Redirect orders to pre-qualified alternate supplier. This option provides the most reliable solution but may require quality validation for first shipments.',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -5,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 85,
        type: 'ALT_SUPPLIER',
        prerequisites: ['Alternate supplier qualification', 'Updated BOM approval'],
        risks: ['Initial quality variance', 'Setup time for new logistics'],
        expectedOutcome: 'Supply continuity restored within 5-7 days',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Expedite via Air Freight',
        description: 'Air ship existing inventory from supplier\'s other facilities',
        detailedDescription: 'Arrange emergency air freight from supplier\'s secondary facility or regional warehouse.',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -8,
        estimatedCostImpact: 'HIGH',
        confidenceScore: 75,
        type: 'AIR_FREIGHT',
        expectedOutcome: 'Partial supply restored within 3 days',
      },
      {
        id: `MIT-${risk.id}-3`,
        componentRiskId: risk.id,
        title: 'Reschedule Production',
        description: 'Adjust production schedule to defer affected product lines',
        detailedDescription: 'Temporarily shift production to product variants that don\'t require this component.',
        isRecommended: false,
        estimatedLeadTimeImpactDays: 0,
        estimatedCostImpact: 'LOW',
        confidenceScore: 90,
        type: 'RESCHEDULE_PRODUCTION',
        risks: ['Customer delivery delays', 'Revenue impact'],
        expectedOutcome: 'Production continuity maintained with adjusted mix',
      },
    ],
    PORT_CONGESTION: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Re-route Through Alternate Port',
        description: 'Divert shipments to less congested port facility',
        detailedDescription: 'Redirect incoming shipments to alternate port with current average wait time of 2 days vs 10 days at primary port.',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -6,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 80,
        type: 'REROUTE_TRANSPORT',
        expectedOutcome: 'Shipments cleared within 3-4 days',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Air Freight Critical Components',
        description: 'Emergency air shipment for most critical items',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -10,
        estimatedCostImpact: 'HIGH',
        confidenceScore: 95,
        type: 'AIR_FREIGHT',
        expectedOutcome: 'Critical supply secured within 48 hours',
      },
      {
        id: `MIT-${risk.id}-3`,
        componentRiskId: risk.id,
        title: 'Increase Safety Stock',
        description: 'Place advance orders to buffer against delays',
        isRecommended: false,
        estimatedLeadTimeImpactDays: 0,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 70,
        type: 'ADJUST_SAFETY_STOCK',
        expectedOutcome: 'Buffer stock increased by 25%',
      },
    ],
    WEATHER: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Expedite Pre-Storm Shipment',
        description: 'Rush shipment before weather window closes',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -7,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 65,
        type: 'EXPEDITE_SHIPMENT',
        risks: ['Timing uncertainty', 'Partial shipment possible'],
        expectedOutcome: 'Secure 2 weeks additional supply',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Activate Alternate Supplier',
        description: 'Switch to supplier in unaffected region',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -5,
        estimatedCostImpact: 'HIGH',
        confidenceScore: 85,
        type: 'ALT_SUPPLIER',
        expectedOutcome: 'Full supply continuity from day 5',
      },
      {
        id: `MIT-${risk.id}-3`,
        componentRiskId: risk.id,
        title: 'Defer Non-Critical Production',
        description: 'Prioritize critical product lines',
        isRecommended: false,
        estimatedLeadTimeImpactDays: 0,
        estimatedCostImpact: 'LOW',
        confidenceScore: 95,
        type: 'RESCHEDULE_PRODUCTION',
        expectedOutcome: 'Critical lines maintained at 100%',
      },
    ],
    CAPACITY: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Dual Source Activation',
        description: 'Split orders between primary and secondary supplier',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -4,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 80,
        type: 'ALT_SUPPLIER',
        expectedOutcome: 'Combined capacity meets demand',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Increase Order Quantity',
        description: 'Place larger orders to secure allocation priority',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -2,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 70,
        type: 'INCREASE_ORDER_QTY',
        expectedOutcome: 'Priority allocation secured',
      },
      {
        id: `MIT-${risk.id}-3`,
        componentRiskId: risk.id,
        title: 'Adjust Production Schedule',
        description: 'Level-load production across available supply',
        isRecommended: false,
        estimatedLeadTimeImpactDays: 0,
        estimatedCostImpact: 'LOW',
        confidenceScore: 90,
        type: 'RESCHEDULE_PRODUCTION',
        expectedOutcome: 'Smooth production with extended timeline',
      },
    ],
    TRANSPORT_DELAY: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Re-route Shipment',
        description: 'Switch to alternate carrier or route',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -4,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 85,
        type: 'REROUTE_TRANSPORT',
        expectedOutcome: 'Delivery within original timeline',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Air Freight Upgrade',
        description: 'Convert sea shipment to air freight',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -8,
        estimatedCostImpact: 'HIGH',
        confidenceScore: 95,
        type: 'AIR_FREIGHT',
        expectedOutcome: 'Delivery 8 days earlier',
      },
    ],
    QUALITY_ISSUE: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Activate Qualified Alternate',
        description: 'Switch to pre-qualified backup supplier',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -3,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 90,
        type: 'ALT_SUPPLIER',
        expectedOutcome: 'Quality-assured supply within 5 days',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Expedite Inspection & Release',
        description: 'Fast-track quality review of held inventory',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -2,
        estimatedCostImpact: 'LOW',
        confidenceScore: 60,
        type: 'EXPEDITE_SHIPMENT',
        risks: ['Quality risk if root cause not resolved'],
        expectedOutcome: 'Partial release of conforming units',
      },
    ],
    CUSTOMS_DELAY: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Expedite Documentation',
        description: 'Fast-track customs clearance with broker',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -3,
        estimatedCostImpact: 'LOW',
        confidenceScore: 75,
        type: 'EXPEDITE_SHIPMENT',
        expectedOutcome: 'Clearance within 2 days',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Source from Bonded Warehouse',
        description: 'Use pre-cleared inventory from local bonded facility',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -5,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 85,
        type: 'ALT_SUPPLIER',
        expectedOutcome: 'Immediate availability from local stock',
      },
    ],
    SUPPLIER_BANKRUPTCY: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Emergency Supplier Switch',
        description: 'Immediately transition to backup supplier',
        isRecommended: true,
        estimatedLeadTimeImpactDays: -5,
        estimatedCostImpact: 'HIGH',
        confidenceScore: 80,
        type: 'ALT_SUPPLIER',
        expectedOutcome: 'Supply continuity from new source',
      },
      {
        id: `MIT-${risk.id}-2`,
        componentRiskId: risk.id,
        title: 'Secure Remaining Inventory',
        description: 'Purchase all available stock from affected supplier',
        isRecommended: false,
        estimatedLeadTimeImpactDays: -2,
        estimatedCostImpact: 'MEDIUM',
        confidenceScore: 50,
        type: 'INCREASE_ORDER_QTY',
        risks: ['Limited availability', 'Legal complexity'],
        expectedOutcome: 'Short-term buffer secured',
      },
    ],
    OTHER: [
      {
        id: `MIT-${risk.id}-1`,
        componentRiskId: risk.id,
        title: 'Consult Supply Chain Team',
        description: 'Engage specialist team for custom resolution',
        isRecommended: true,
        estimatedLeadTimeImpactDays: 0,
        estimatedCostImpact: 'LOW',
        confidenceScore: 70,
        type: 'RESCHEDULE_PRODUCTION',
        expectedOutcome: 'Custom mitigation plan developed',
      },
    ],
  };

  return baseOptions[risk.rootCauseCategory] || baseOptions.OTHER;
};

// ============================================================================
// Coach Panel Narratives
// ============================================================================

const generateNarrative = (risk: ComponentRisk): string => {
  const severityText = {
    CRITICAL: 'critically at risk',
    HIGH: 'at high risk',
    MEDIUM: 'at moderate risk',
    LOW: 'at low risk',
  };

  const causeNarratives: Record<RootCauseCategory, string> = {
    FACTORY_STRIKE: `due to an ongoing labor dispute at ${risk.supplierName}'s facility. Workers have initiated a work stoppage, and production has been significantly reduced.`,
    PORT_CONGESTION: `because of severe congestion at the shipping port. Container backlog is causing delays of 7-10 days beyond normal transit times.`,
    WEATHER: `due to a severe weather event affecting the transportation route. Road closures and logistics disruptions are expected to continue for several days.`,
    CAPACITY: `because the supplier is operating at maximum capacity. High demand across the industry has extended lead times significantly.`,
    TRANSPORT_DELAY: `due to unexpected shipping delays. The transport vessel has encountered issues that have pushed back the estimated arrival date.`,
    QUALITY_ISSUE: `because of a quality control hold on recent production batches. The supplier is investigating the root cause before releasing inventory.`,
    CUSTOMS_DELAY: `due to new customs regulations requiring additional documentation. Average clearance times have increased significantly.`,
    SUPPLIER_BANKRUPTCY: `because the supplier is experiencing financial difficulties. There are concerns about their ability to fulfill orders.`,
    PORT_CONGESTION: `due to port congestion causing significant delays in container processing and clearance.`,
    OTHER: `due to supply chain disruptions that require immediate attention.`,
  };

  return `It looks like **${risk.componentName}** (${risk.componentId}) is ${severityText[risk.severity]} of a supply disruption between ${formatDateReadable(risk.disruptionStartDate)} and ${formatDateReadable(risk.disruptionEndDate)} ${causeNarratives[risk.rootCauseCategory]} Currently, you have **${risk.daysOfSupply} days** of supply remaining (${risk.currentStock.toLocaleString()} units), with daily demand of ${risk.demandPerDay.toLocaleString()} units.`;
};

const formatDateReadable = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'MMM d');
};

const generateImpactSummary = (risk: ComponentRisk): string => {
  const daysUntilDisruption = Math.ceil(
    (new Date(risk.disruptionStartDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (risk.daysOfSupply < daysUntilDisruption) {
    return `Your current stock should cover demand until the disruption window. However, action is recommended to avoid running low during the recovery period.`;
  } else if (risk.daysOfSupply < 7) {
    return `**Urgent:** Current stock will be depleted ${7 - risk.daysOfSupply} days into the disruption window. Immediate action is required to prevent production stoppage.`;
  } else {
    return `Without intervention, there is a significant risk of stock-out during the disruption window, potentially impacting production at ${risk.plantName}.`;
  }
};

export const generateCoachPanelData = (risk: ComponentRisk): CoachPanelData => {
  return {
    componentRisk: risk,
    rootCauseNarrative: generateNarrative(risk),
    impactSummary: generateImpactSummary(risk),
    mitigationOptions: createMitigationOptions(risk),
    additionalInsights: [
      `This component is used in 12 active product lines`,
      `Similar disruption occurred in Q2 2024 - resolved via alternate supplier`,
      `${risk.supplierName} accounts for 65% of total supply for this component`,
    ],
  };
};

// ============================================================================
// Export helpers
// ============================================================================

export const getComponentRiskById = (id: string): ComponentRisk | undefined => {
  return mockComponentRisks.find((risk) => risk.id === id);
};

export const getMitigationOptionsForComponent = (componentRiskId: string): MitigationOption[] => {
  const risk = getComponentRiskById(componentRiskId);
  if (!risk) return [];
  return createMitigationOptions(risk);
};

export const filterComponentRisks = (
  risks: ComponentRisk[],
  filters: {
    searchQuery?: string;
    severity?: string;
    rootCauseCategory?: string;
    supplierId?: string;
    plantId?: string;
    onlyCritical?: boolean;
    onlyNextTwoWeeks?: boolean;
    timeHorizon?: number;
  }
): ComponentRisk[] => {
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
    if (filters.severity && filters.severity !== 'ALL') {
      if (risk.severity !== filters.severity) return false;
    }

    // Root cause filter
    if (filters.rootCauseCategory && filters.rootCauseCategory !== 'ALL') {
      if (risk.rootCauseCategory !== filters.rootCauseCategory) return false;
    }

    // Supplier filter
    if (filters.supplierId && filters.supplierId !== 'ALL') {
      if (risk.supplierId !== filters.supplierId) return false;
    }

    // Plant filter
    if (filters.plantId && filters.plantId !== 'ALL') {
      if (risk.plantId !== filters.plantId) return false;
    }

    // Critical only
    if (filters.onlyCritical && risk.severity !== 'CRITICAL') {
      return false;
    }

    // Time horizon filter
    if (filters.timeHorizon || filters.onlyNextTwoWeeks) {
      const weeks = filters.onlyNextTwoWeeks ? 2 : (filters.timeHorizon || 4);
      const horizonDate = addDays(today, weeks * 7);
      const disruptionStart = new Date(risk.disruptionStartDate);
      if (disruptionStart > horizonDate) return false;
    }

    return true;
  });
};
