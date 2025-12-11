import { useState, useEffect, useCallback } from 'react';
import { CoachPanelData, MitigationExecutionResult } from '../types';
import { api, updateComponentRiskStatus } from '../services/api';

interface UseCoachDataResult {
  coachData: CoachPanelData | null;
  isLoading: boolean;
  error: string | null;
  executeMitigation: (mitigationId: string) => Promise<MitigationExecutionResult>;
  executingMitigationId: string | null;
  lastExecutionResult: MitigationExecutionResult | null;
}

export function useCoachData(selectedRiskId: string | null): UseCoachDataResult {
  const [coachData, setCoachData] = useState<CoachPanelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executingMitigationId, setExecutingMitigationId] = useState<string | null>(null);
  const [lastExecutionResult, setLastExecutionResult] = useState<MitigationExecutionResult | null>(null);

  // Fetch coach data when selected risk changes
  useEffect(() => {
    if (!selectedRiskId) {
      setCoachData(null);
      return;
    }

    const fetchCoachData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.coach.getData(selectedRiskId);

        if (response.success && response.data) {
          setCoachData(response.data);
        } else {
          setError(response.message || 'Failed to fetch coach data');
          setCoachData(null);
        }
      } catch (err) {
        setError('An error occurred while fetching coach data');
        console.error('Error fetching coach data:', err);
        setCoachData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoachData();
  }, [selectedRiskId]);

  // Execute mitigation
  const executeMitigation = useCallback(
    async (mitigationId: string): Promise<MitigationExecutionResult> => {
      if (!selectedRiskId) {
        throw new Error('No component risk selected');
      }

      setExecutingMitigationId(mitigationId);
      setLastExecutionResult(null);

      try {
        const response = await api.mitigations.execute(mitigationId, selectedRiskId);

        if (response.success && response.data) {
          setLastExecutionResult(response.data);

          // Update the component risk status optimistically
          if (response.data.success) {
            updateComponentRiskStatus(selectedRiskId, {
              mitigationStatus: 'EXECUTING',
              activeMitigationId: mitigationId,
            });

            // Update local coach data
            if (coachData) {
              setCoachData({
                ...coachData,
                componentRisk: {
                  ...coachData.componentRisk,
                  mitigationStatus: 'EXECUTING',
                  activeMitigationId: mitigationId,
                },
              });
            }
          }

          return response.data;
        } else {
          const errorResult: MitigationExecutionResult = {
            success: false,
            mitigationId,
            componentRiskId: selectedRiskId,
            message: response.message || 'Failed to execute mitigation',
            timestamp: new Date().toISOString(),
          };
          setLastExecutionResult(errorResult);
          return errorResult;
        }
      } catch (err) {
        const errorResult: MitigationExecutionResult = {
          success: false,
          mitigationId,
          componentRiskId: selectedRiskId,
          message: 'An error occurred while executing mitigation',
          timestamp: new Date().toISOString(),
        };
        setLastExecutionResult(errorResult);
        console.error('Error executing mitigation:', err);
        return errorResult;
      } finally {
        setExecutingMitigationId(null);
      }
    },
    [selectedRiskId, coachData]
  );

  return {
    coachData,
    isLoading,
    error,
    executeMitigation,
    executingMitigationId,
    lastExecutionResult,
  };
}
