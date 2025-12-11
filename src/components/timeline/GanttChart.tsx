import { useMemo, useRef, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  format,
  addDays,
  differenceInDays,
  startOfDay,
  isToday,
  isSameDay,
} from 'date-fns';
import { Calendar, ZoomIn, ZoomOut } from 'lucide-react';
import { ComponentRisk, TimeHorizon, SEVERITY_COLORS } from '../../types';
import { SeverityBadge, MitigationStatusBadge } from '../common/Badge';
import { PanelHeader } from '../layout/MainLayout';

interface GanttChartProps {
  risks: ComponentRisk[];
  selectedRiskId: string | null;
  onSelectRisk: (riskId: string) => void;
  timeHorizon: TimeHorizon;
}

export function GanttChart({
  risks,
  selectedRiskId,
  onSelectRisk,
  timeHorizon,
}: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRiskId, setHoveredRiskId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const today = startOfDay(new Date());
  const endDate = addDays(today, timeHorizon * 7);
  const totalDays = differenceInDays(endDate, today) + 1;

  // Configuration
  const ROW_HEIGHT = 56;
  const HEADER_HEIGHT = 60;
  const LEFT_LABEL_WIDTH = 200;
  const DAY_WIDTH = Math.max(30, 800 / totalDays);

  // Generate date headers
  const dateHeaders = useMemo(() => {
    const headers = [];
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(today, i);
      headers.push({
        date,
        dayOfWeek: format(date, 'EEE'),
        dayOfMonth: format(date, 'd'),
        month: format(date, 'MMM'),
        isToday: isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    return headers;
  }, [today, totalDays]);

  // Sort risks by disruption start date
  const sortedRisks = useMemo(() => {
    return [...risks]
      .sort((a, b) => {
        // Selected risk goes first
        if (a.id === selectedRiskId) return -1;
        if (b.id === selectedRiskId) return 1;
        // Then sort by severity and start date
        const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(a.disruptionStartDate).getTime() - new Date(b.disruptionStartDate).getTime();
      })
      .slice(0, 10); // Limit to 10 for display
  }, [risks, selectedRiskId]);

  // Calculate bar position and width
  const getBarProps = (risk: ComponentRisk) => {
    const startDate = new Date(risk.disruptionStartDate);
    const endDateRisk = new Date(risk.disruptionEndDate);

    const startDayOffset = Math.max(0, differenceInDays(startDate, today));
    const endDayOffset = Math.min(totalDays - 1, differenceInDays(endDateRisk, today));

    const x = LEFT_LABEL_WIDTH + startDayOffset * DAY_WIDTH;
    const width = Math.max(DAY_WIDTH, (endDayOffset - startDayOffset + 1) * DAY_WIDTH);

    return { x, width, startDayOffset, endDayOffset };
  };

  // Scroll to selected risk
  useEffect(() => {
    if (selectedRiskId && containerRef.current) {
      const selectedIndex = sortedRisks.findIndex((r) => r.id === selectedRiskId);
      if (selectedIndex >= 0) {
        const targetY = HEADER_HEIGHT + selectedIndex * ROW_HEIGHT;
        containerRef.current.scrollTo({
          top: Math.max(0, targetY - ROW_HEIGHT),
          behavior: 'smooth',
        });
      }
    }
  }, [selectedRiskId, sortedRisks]);

  const chartWidth = LEFT_LABEL_WIDTH + totalDays * DAY_WIDTH;
  const chartHeight = HEADER_HEIGHT + sortedRisks.length * ROW_HEIGHT;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <PanelHeader
        title="Disruption Timeline"
        subtitle={`${timeHorizon} week${timeHorizon > 1 ? 's' : ''} horizon`}
        icon={<Calendar className="w-4 h-4" />}
      />

      {/* Chart Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <svg
          width={chartWidth}
          height={chartHeight}
          className="select-none"
        >
          <defs>
            {/* Gradient for bars */}
            <linearGradient id="barGradientCritical" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="barGradientHigh" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="barGradientMedium" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="barGradientLow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            {/* Drop shadow filter */}
            <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>

            {/* Pattern for weekends */}
            <pattern id="weekendPattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <path d="M0 8L8 0M-2 2L2 -2M6 10L10 6" stroke="#f1f5f9" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width={chartWidth} height={chartHeight} fill="#fafafa" />

          {/* Date Column Headers */}
          <g>
            {dateHeaders.map((header, index) => {
              const x = LEFT_LABEL_WIDTH + index * DAY_WIDTH;
              return (
                <g key={index}>
                  {/* Weekend background */}
                  {header.isWeekend && (
                    <rect
                      x={x}
                      y={0}
                      width={DAY_WIDTH}
                      height={chartHeight}
                      fill="url(#weekendPattern)"
                    />
                  )}

                  {/* Today marker */}
                  {header.isToday && (
                    <rect
                      x={x}
                      y={0}
                      width={DAY_WIDTH}
                      height={chartHeight}
                      fill="#0d948815"
                    />
                  )}

                  {/* Column line */}
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={chartHeight}
                    stroke="#e5e7eb"
                    strokeWidth={header.isToday ? 2 : 1}
                  />

                  {/* Date header */}
                  <g>
                    <rect
                      x={x}
                      y={0}
                      width={DAY_WIDTH}
                      height={HEADER_HEIGHT}
                      fill={header.isToday ? '#0d9488' : '#ffffff'}
                    />
                    <text
                      x={x + DAY_WIDTH / 2}
                      y={20}
                      textAnchor="middle"
                      className={clsx(
                        'text-[10px] font-medium',
                        header.isToday ? 'fill-white' : 'fill-gray-500'
                      )}
                    >
                      {header.dayOfWeek}
                    </text>
                    <text
                      x={x + DAY_WIDTH / 2}
                      y={38}
                      textAnchor="middle"
                      className={clsx(
                        'text-sm font-semibold',
                        header.isToday ? 'fill-white' : 'fill-gray-700'
                      )}
                    >
                      {header.dayOfMonth}
                    </text>
                    <text
                      x={x + DAY_WIDTH / 2}
                      y={52}
                      textAnchor="middle"
                      className={clsx(
                        'text-[10px]',
                        header.isToday ? 'fill-white/80' : 'fill-gray-400'
                      )}
                    >
                      {header.month}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Today indicator line */}
          <line
            x1={LEFT_LABEL_WIDTH + DAY_WIDTH / 2}
            y1={HEADER_HEIGHT}
            x2={LEFT_LABEL_WIDTH + DAY_WIDTH / 2}
            y2={chartHeight}
            stroke="#0d9488"
            strokeWidth={2}
            strokeDasharray="4,4"
          />

          {/* Left Label Column Background */}
          <rect
            x={0}
            y={0}
            width={LEFT_LABEL_WIDTH}
            height={chartHeight}
            fill="#ffffff"
          />
          <line
            x1={LEFT_LABEL_WIDTH}
            y1={0}
            x2={LEFT_LABEL_WIDTH}
            y2={chartHeight}
            stroke="#d1d5db"
            strokeWidth={1}
          />

          {/* Header Label */}
          <text
            x={16}
            y={36}
            className="text-sm font-semibold fill-gray-700"
          >
            Component
          </text>

          {/* Rows */}
          {sortedRisks.map((risk, index) => {
            const y = HEADER_HEIGHT + index * ROW_HEIGHT;
            const isSelected = risk.id === selectedRiskId;
            const isHovered = risk.id === hoveredRiskId;
            const barProps = getBarProps(risk);

            return (
              <g
                key={risk.id}
                onClick={() => onSelectRisk(risk.id)}
                onMouseEnter={(e) => {
                  setHoveredRiskId(risk.id);
                  setTooltipPosition({
                    x: barProps.x + barProps.width / 2,
                    y: y + ROW_HEIGHT / 2,
                  });
                }}
                onMouseLeave={() => setHoveredRiskId(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Row background */}
                <rect
                  x={0}
                  y={y}
                  width={chartWidth}
                  height={ROW_HEIGHT}
                  fill={isSelected ? '#f0fdf9' : isHovered ? '#f9fafb' : 'transparent'}
                  className="transition-colors duration-150"
                />

                {/* Row line */}
                <line
                  x1={0}
                  y1={y + ROW_HEIGHT}
                  x2={chartWidth}
                  y2={y + ROW_HEIGHT}
                  stroke="#f3f4f6"
                />

                {/* Left label */}
                <g>
                  {/* Selection indicator */}
                  {isSelected && (
                    <rect
                      x={0}
                      y={y}
                      width={4}
                      height={ROW_HEIGHT}
                      fill="#0d9488"
                    />
                  )}

                  {/* Severity indicator */}
                  <circle
                    cx={20}
                    cy={y + ROW_HEIGHT / 2}
                    r={5}
                    fill={SEVERITY_COLORS[risk.severity]}
                  />

                  {/* Component name */}
                  <text
                    x={34}
                    y={y + ROW_HEIGHT / 2 - 6}
                    className="text-xs font-medium fill-gray-900"
                  >
                    {risk.componentName.length > 20
                      ? risk.componentName.slice(0, 20) + '...'
                      : risk.componentName}
                  </text>

                  {/* Supplier */}
                  <text
                    x={34}
                    y={y + ROW_HEIGHT / 2 + 10}
                    className="text-[10px] fill-gray-500"
                  >
                    {risk.supplierName.length > 22
                      ? risk.supplierName.slice(0, 22) + '...'
                      : risk.supplierName}
                  </text>
                </g>

                {/* Disruption bar */}
                <g filter={isSelected || isHovered ? 'url(#dropShadow)' : undefined}>
                  <rect
                    x={barProps.x}
                    y={y + 12}
                    width={barProps.width}
                    height={ROW_HEIGHT - 24}
                    rx={6}
                    fill={`url(#barGradient${risk.severity.charAt(0) + risk.severity.slice(1).toLowerCase()})`}
                    className={clsx(
                      'transition-all duration-200',
                      (isSelected || isHovered) && 'opacity-100',
                      !isSelected && !isHovered && 'opacity-85'
                    )}
                  />

                  {/* Bar label */}
                  {barProps.width > 60 && (
                    <text
                      x={barProps.x + 8}
                      y={y + ROW_HEIGHT / 2 + 4}
                      className="text-[10px] font-medium fill-white"
                    >
                      {differenceInDays(new Date(risk.disruptionEndDate), new Date(risk.disruptionStartDate)) + 1}d
                    </text>
                  )}

                  {/* Mitigation status indicator */}
                  {risk.mitigationStatus !== 'NONE' && (
                    <circle
                      cx={barProps.x + barProps.width - 10}
                      cy={y + 18}
                      r={6}
                      fill={
                        risk.mitigationStatus === 'COMPLETED'
                          ? '#22c55e'
                          : risk.mitigationStatus === 'EXECUTING'
                          ? '#f59e0b'
                          : '#3b82f6'
                      }
                      stroke="white"
                      strokeWidth={2}
                    />
                  )}
                </g>
              </g>
            );
          })}

          {/* Tooltip */}
          {hoveredRiskId && (
            <GanttTooltip
              risk={sortedRisks.find((r) => r.id === hoveredRiskId)!}
              x={tooltipPosition.x}
              y={tooltipPosition.y}
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Low</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-primary-500" style={{ borderStyle: 'dashed' }} />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Tooltip Component
// ============================================================================

interface GanttTooltipProps {
  risk: ComponentRisk;
  x: number;
  y: number;
}

function GanttTooltip({ risk, x, y }: GanttTooltipProps) {
  const tooltipWidth = 240;
  const tooltipHeight = 100;

  return (
    <foreignObject
      x={x - tooltipWidth / 2}
      y={y - tooltipHeight - 20}
      width={tooltipWidth}
      height={tooltipHeight}
      style={{ pointerEvents: 'none' }}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 text-xs animate-fade-in">
        <div className="font-semibold mb-1">{risk.componentName}</div>
        <div className="text-gray-300 mb-2">{risk.componentId}</div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400">Disruption Window:</span>
          <span className="font-medium">
            {format(new Date(risk.disruptionStartDate), 'MMM d')} -{' '}
            {format(new Date(risk.disruptionEndDate), 'MMM d')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Root Cause:</span>
          <span className="font-medium">{risk.rootCauseCategory.replace(/_/g, ' ')}</span>
        </div>
        {risk.mitigationStatus !== 'NONE' && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <span className="text-gray-400">Mitigation: </span>
            <span className="font-medium text-primary-400">
              {risk.mitigationStatus.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </foreignObject>
  );
}
