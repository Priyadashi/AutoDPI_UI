import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RiskList } from '../components/risk-list/RiskList';
import { ComponentRisk, RiskFilters, Supplier, Plant } from '../types';

// Mock data
const mockRisks: ComponentRisk[] = [
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
    disruptionStartDate: '2025-01-15',
    disruptionEndDate: '2025-01-25',
    rootCauseCategory: 'FACTORY_STRIKE',
    rootCauseSummary: 'Labor dispute at main production facility.',
    mitigationStatus: 'NONE',
    riskScore: 92,
    trend: 'WORSENING',
    lastUpdated: '2025-01-10',
  },
  {
    id: 'RISK002',
    componentId: 'CAP-550-X2',
    componentName: 'Multilayer Ceramic Capacitor',
    supplierName: 'GlobalTech Components',
    supplierId: 'SUP002',
    plantName: 'Shanghai Production',
    plantId: 'PLT002',
    severity: 'HIGH',
    daysOfSupply: 5,
    demandPerDay: 15000,
    currentStock: 75000,
    disruptionStartDate: '2025-01-18',
    disruptionEndDate: '2025-01-28',
    rootCauseCategory: 'PORT_CONGESTION',
    rootCauseSummary: 'Severe congestion at Kaohsiung port.',
    mitigationStatus: 'PLANNED',
    riskScore: 88,
    trend: 'STABLE',
    lastUpdated: '2025-01-11',
  },
  {
    id: 'RISK003',
    componentId: 'SENSOR-01',
    componentName: 'Temperature Sensor',
    supplierName: 'Nordic Precision',
    supplierId: 'SUP003',
    plantName: 'Berlin Manufacturing',
    plantId: 'PLT003',
    severity: 'LOW',
    daysOfSupply: 18,
    demandPerDay: 2000,
    currentStock: 36000,
    disruptionStartDate: '2025-02-01',
    disruptionEndDate: '2025-02-07',
    rootCauseCategory: 'CAPACITY',
    rootCauseSummary: 'Minor capacity constraints.',
    mitigationStatus: 'NONE',
    riskScore: 32,
    trend: 'STABLE',
    lastUpdated: '2025-01-08',
  },
];

const mockSuppliers: Supplier[] = [
  { id: 'SUP001', name: 'Acme Electronics', location: 'Shenzhen, China' },
  { id: 'SUP002', name: 'GlobalTech Components', location: 'Taipei, Taiwan' },
  { id: 'SUP003', name: 'Nordic Precision', location: 'Stockholm, Sweden' },
];

const mockPlants: Plant[] = [
  { id: 'PLT001', name: 'Austin Assembly', region: 'North America' },
  { id: 'PLT002', name: 'Shanghai Production', region: 'Asia Pacific' },
  { id: 'PLT003', name: 'Berlin Manufacturing', region: 'Europe' },
];

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

describe('RiskList Component', () => {
  const mockOnSelectRisk = vi.fn();
  const mockOnFiltersChange = vi.fn();

  const renderRiskList = (props = {}) => {
    return render(
      <RiskList
        risks={mockRisks}
        selectedRiskId={null}
        onSelectRisk={mockOnSelectRisk}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        suppliers={mockSuppliers}
        plants={mockPlants}
        isLoading={false}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the risk list header', () => {
    renderRiskList();
    expect(screen.getByText('Risk Overview')).toBeInTheDocument();
  });

  it('displays the correct number of risks', () => {
    renderRiskList();
    expect(screen.getByText('3 at-risk components')).toBeInTheDocument();
  });

  it('renders all risk cards', () => {
    renderRiskList();
    expect(screen.getByText('Power Management IC')).toBeInTheDocument();
    expect(screen.getByText('Multilayer Ceramic Capacitor')).toBeInTheDocument();
    expect(screen.getByText('Temperature Sensor')).toBeInTheDocument();
  });

  it('displays component IDs', () => {
    renderRiskList();
    expect(screen.getByText('IC-78201-A')).toBeInTheDocument();
    expect(screen.getByText('CAP-550-X2')).toBeInTheDocument();
    expect(screen.getByText('SENSOR-01')).toBeInTheDocument();
  });

  it('displays severity badges', () => {
    renderRiskList();
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('calls onSelectRisk when a risk card is clicked', () => {
    renderRiskList();
    const firstRiskCard = screen.getByText('Power Management IC').closest('[role="button"]');
    if (firstRiskCard) {
      fireEvent.click(firstRiskCard);
      expect(mockOnSelectRisk).toHaveBeenCalledWith('RISK001');
    }
  });

  it('shows loading state when isLoading is true', () => {
    renderRiskList({ isLoading: true });
    // Skeleton loaders should be present
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no risks match filters', () => {
    renderRiskList({ risks: [] });
    expect(screen.getByText('No risks found')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    renderRiskList();
    expect(screen.getByPlaceholderText(/Search components/i)).toBeInTheDocument();
  });

  it('updates filters when search input changes', () => {
    renderRiskList();
    const searchInput = screen.getByPlaceholderText(/Search components/i);
    fireEvent.change(searchInput, { target: { value: 'Power' } });
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      searchQuery: 'Power',
    });
  });

  it('displays supplier filter dropdown', () => {
    renderRiskList();
    expect(screen.getByText('Supplier')).toBeInTheDocument();
    expect(screen.getByText('All Suppliers')).toBeInTheDocument();
  });

  it('displays severity filter dropdown', () => {
    renderRiskList();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('All Severities')).toBeInTheDocument();
  });

  it('highlights selected risk card', () => {
    renderRiskList({ selectedRiskId: 'RISK001' });
    const selectedCard = screen.getByText('Power Management IC').closest('[role="button"]');
    expect(selectedCard).toHaveClass('bg-primary-50');
  });

  it('displays days of supply for each risk', () => {
    renderRiskList();
    expect(screen.getByText('3d')).toBeInTheDocument();
    expect(screen.getByText('5d')).toBeInTheDocument();
    expect(screen.getByText('18d')).toBeInTheDocument();
  });

  it('displays filter count correctly', () => {
    renderRiskList();
    expect(screen.getByText('3')).toBeInTheDocument(); // filtered count
    expect(screen.getByText('of 3 risks')).toBeInTheDocument();
  });
});
