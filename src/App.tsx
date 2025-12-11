import { useState, useCallback } from 'react';
import { format } from 'date-fns';

// Layout Components
import { TopBar } from './components/layout/TopBar';
import { MainLayout, ResponsiveLayout } from './components/layout/MainLayout';

// Feature Components
import { RiskList } from './components/risk-list/RiskList';
import { GanttChart } from './components/timeline/GanttChart';
import { CoachPanel } from './components/coach/CoachPanel';

// Common Components
import { ToastContainer, useToast } from './components/common/Toast';

// Hooks
import { useComponentRisks } from './hooks/useComponentRisks';
import { useCoachData } from './hooks/useCoachData';

/**
 * Supply Risk Control Tower
 *
 * A next-generation digital control tower for supply chain managers
 * to monitor and mitigate short-term supply disruption risks.
 */
function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, dismissToast, success, error } = useToast();

  // Component risks state
  const {
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
    isLoading: risksLoading,
    refresh: refreshRisks,
  } = useComponentRisks();

  // Coach data state
  const {
    coachData,
    isLoading: coachLoading,
    executeMitigation,
    executingMitigationId,
  } = useCoachData(selectedRiskId);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshRisks();
      success('Data Refreshed', 'Risk data has been updated successfully.');
    } catch (err) {
      error('Refresh Failed', 'Unable to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshRisks, success, error]);

  // Handle mitigation execution
  const handleExecuteMitigation = useCallback(
    async (mitigationId: string) => {
      const result = await executeMitigation(mitigationId);

      if (result.success) {
        success(
          'Mitigation Initiated',
          `${result.message}${result.referenceNumber ? ` Reference: ${result.referenceNumber}` : ''}`
        );
      } else {
        error('Mitigation Failed', result.message);
      }
    },
    [executeMitigation, success, error]
  );

  // Handle risk selection
  const handleSelectRisk = useCallback((riskId: string) => {
    setSelectedRiskId(riskId);
  }, [setSelectedRiskId]);

  // Format last updated time
  const lastUpdated = format(new Date(), 'h:mm a');

  return (
    <ResponsiveLayout>
      {/* Top Navigation Bar */}
      <TopBar
        timeHorizon={timeHorizon}
        onTimeHorizonChange={setTimeHorizon}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <MainLayout
        leftPanel={
          <RiskList
            risks={risks}
            selectedRiskId={selectedRiskId}
            onSelectRisk={handleSelectRisk}
            filters={filters}
            onFiltersChange={setFilters}
            suppliers={suppliers}
            plants={plants}
            isLoading={risksLoading}
          />
        }
        centerPanel={
          <GanttChart
            risks={filteredRisks}
            selectedRiskId={selectedRiskId}
            onSelectRisk={handleSelectRisk}
            timeHorizon={timeHorizon}
          />
        }
        rightPanel={
          <CoachPanel
            data={coachData}
            isLoading={coachLoading}
            onExecuteMitigation={handleExecuteMitigation}
            executingMitigationId={executingMitigationId}
          />
        }
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ResponsiveLayout>
  );
}

export default App;
