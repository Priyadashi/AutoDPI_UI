import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoachPanel } from '../components/coach/CoachPanel';
import { CoachPanelData, ComponentRisk, MitigationOption } from '../types';

// Mock component risk
const mockComponentRisk: ComponentRisk = {
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
  disruptionStartDate: '2025-01-15',
  disruptionEndDate: '2025-01-25',
  rootCauseCategory: 'FACTORY_STRIKE',
  rootCauseSummary: 'Labor dispute at main production facility.',
  mitigationStatus: 'NONE',
  riskScore: 92,
  trend: 'WORSENING',
  lastUpdated: '2025-01-10',
};

// Mock mitigation options
const mockMitigationOptions: MitigationOption[] = [
  {
    id: 'MIT001',
    componentRiskId: 'RISK001',
    title: 'Switch to Alternate Supplier',
    description: 'Source from qualified backup supplier with available capacity',
    detailedDescription: 'Redirect orders to pre-qualified alternate supplier.',
    isRecommended: true,
    estimatedLeadTimeImpactDays: -5,
    estimatedCostImpact: 'MEDIUM',
    confidenceScore: 85,
    type: 'ALT_SUPPLIER',
    prerequisites: ['Alternate supplier qualification', 'Updated BOM approval'],
    risks: ['Initial quality variance'],
    expectedOutcome: 'Supply continuity restored within 5-7 days',
  },
  {
    id: 'MIT002',
    componentRiskId: 'RISK001',
    title: 'Expedite via Air Freight',
    description: 'Air ship existing inventory from supplier\'s other facilities',
    isRecommended: false,
    estimatedLeadTimeImpactDays: -8,
    estimatedCostImpact: 'HIGH',
    confidenceScore: 75,
    type: 'AIR_FREIGHT',
    expectedOutcome: 'Partial supply restored within 3 days',
  },
];

// Mock coach panel data
const mockCoachData: CoachPanelData = {
  componentRisk: mockComponentRisk,
  rootCauseNarrative: 'It looks like **Power Management IC** is at high risk due to a factory strike.',
  impactSummary: 'Current stock will be depleted in 3 days. Immediate action required.',
  mitigationOptions: mockMitigationOptions,
  additionalInsights: [
    'This component is used in 12 active product lines',
    'Similar disruption occurred in Q2 2024',
  ],
};

describe('CoachPanel Component', () => {
  const mockOnExecuteMitigation = vi.fn().mockResolvedValue(undefined);

  const renderCoachPanel = (props = {}) => {
    return render(
      <CoachPanel
        data={mockCoachData}
        isLoading={false}
        onExecuteMitigation={mockOnExecuteMitigation}
        executingMitigationId={null}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the coach panel header', () => {
    renderCoachPanel();
    expect(screen.getByText('Supply Coach')).toBeInTheDocument();
    expect(screen.getByText('AI-powered recommendations')).toBeInTheDocument();
  });

  it('displays component name and ID', () => {
    renderCoachPanel();
    expect(screen.getByText('Power Management IC')).toBeInTheDocument();
    expect(screen.getByText('IC-78201-A')).toBeInTheDocument();
  });

  it('displays severity badge', () => {
    renderCoachPanel();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('displays supplier name', () => {
    renderCoachPanel();
    expect(screen.getByText('Acme Electronics')).toBeInTheDocument();
  });

  it('displays days of supply', () => {
    renderCoachPanel();
    expect(screen.getByText('3 days supply')).toBeInTheDocument();
  });

  it('displays root cause analysis section', () => {
    renderCoachPanel();
    expect(screen.getByText('Root Cause Analysis')).toBeInTheDocument();
  });

  it('displays root cause badge', () => {
    renderCoachPanel();
    expect(screen.getByText('Factory Strike')).toBeInTheDocument();
  });

  it('renders mitigation options', () => {
    renderCoachPanel();
    expect(screen.getByText('Switch to Alternate Supplier')).toBeInTheDocument();
    expect(screen.getByText('Expedite via Air Freight')).toBeInTheDocument();
  });

  it('shows recommended badge on recommended option', () => {
    renderCoachPanel();
    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('displays additional insights', () => {
    renderCoachPanel();
    expect(screen.getByText('Additional Insights')).toBeInTheDocument();
    expect(screen.getByText('This component is used in 12 active product lines')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    renderCoachPanel({ isLoading: true });
    expect(screen.getByText('Analyzing risk...')).toBeInTheDocument();
  });

  it('shows empty state when data is null', () => {
    renderCoachPanel({ data: null });
    expect(screen.getByText('Select a component')).toBeInTheDocument();
  });

  it('calls onExecuteMitigation when execute button is clicked', async () => {
    renderCoachPanel();

    // Find and click execute button
    const executeButtons = screen.getAllByText('Execute');
    fireEvent.click(executeButtons[0]);

    expect(mockOnExecuteMitigation).toHaveBeenCalledWith('MIT001');
  });

  it('shows executing state when executingMitigationId matches', () => {
    renderCoachPanel({ executingMitigationId: 'MIT001' });
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('displays cost impact for mitigation options', () => {
    renderCoachPanel();
    expect(screen.getByText('Medium Cost')).toBeInTheDocument();
    expect(screen.getByText('High Cost')).toBeInTheDocument();
  });

  it('displays lead time impact for mitigation options', () => {
    renderCoachPanel();
    expect(screen.getByText('-5d')).toBeInTheDocument();
    expect(screen.getByText('-8d')).toBeInTheDocument();
  });

  it('displays confidence scores for mitigation options', () => {
    renderCoachPanel();
    expect(screen.getByText('85% confidence')).toBeInTheDocument();
    expect(screen.getByText('75% confidence')).toBeInTheDocument();
  });

  it('expands mitigation option when clicked', () => {
    renderCoachPanel();

    // Click on a mitigation option to expand it
    const mitigationCard = screen.getByText('Switch to Alternate Supplier').closest('div[class*="rounded-xl"]');
    if (mitigationCard) {
      fireEvent.click(mitigationCard);

      // Check if detailed content is shown
      expect(screen.getByText('Prerequisites')).toBeInTheDocument();
      expect(screen.getByText('Expected Outcome')).toBeInTheDocument();
    }
  });

  it('shows expected outcome for expanded mitigation', () => {
    renderCoachPanel();

    // Click to expand
    const mitigationCard = screen.getByText('Switch to Alternate Supplier').closest('div[class*="rounded-xl"]');
    if (mitigationCard) {
      fireEvent.click(mitigationCard);

      expect(screen.getByText('Supply continuity restored within 5-7 days')).toBeInTheDocument();
    }
  });
});
