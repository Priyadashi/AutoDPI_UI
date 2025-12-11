# Supply Risk Control Tower

A next-generation digital control tower for short-term supply resilience management. This application enables Supply Chain Managers to monitor, analyze, and mitigate supply disruption risks across critical components.

![Supply Risk Control Tower](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## Features

### Risk Monitoring
- **Filtered Risk List**: View components at risk with advanced filtering by severity, supplier, plant, and root cause
- **Real-time Updates**: Auto-refresh capability with visual indicators
- **Risk Scoring**: Visual risk scores with trend indicators (improving/stable/worsening)

### Timeline Visualization
- **Gantt Chart**: Interactive disruption timeline showing predicted windows
- **Time Horizon Control**: Adjustable 1-4 week view
- **Visual Highlights**: Color-coded severity, today marker, weekend indicators

### AI-Powered Coach
- **Natural Language Explanations**: Human-friendly root cause narratives
- **Smart Recommendations**: Multiple mitigation options with one recommended action
- **Confidence Scoring**: Each option includes lead time impact, cost impact, and confidence scores

### Mitigation Execution
- **One-Click Actions**: Execute mitigations directly from the UI
- **Status Tracking**: Real-time feedback on mitigation status
- **Toast Notifications**: Clear success/failure feedback

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── components/
│   ├── common/           # Shared UI components
│   │   ├── Badge.tsx     # Severity, status, cost badges
│   │   ├── Button.tsx    # Primary/secondary buttons
│   │   ├── Spinner.tsx   # Loading indicators
│   │   └── Toast.tsx     # Notification toasts
│   │
│   ├── layout/           # Layout components
│   │   ├── TopBar.tsx    # Navigation header
│   │   └── MainLayout.tsx # Three-column layout
│   │
│   ├── risk-list/        # Risk overview components
│   │   ├── RiskFilters.tsx
│   │   ├── RiskCard.tsx
│   │   └── RiskList.tsx
│   │
│   ├── timeline/         # Gantt chart components
│   │   └── GanttChart.tsx
│   │
│   └── coach/            # AI coach components
│       ├── CoachPanel.tsx
│       ├── MitigationCard.tsx
│       └── RootCauseChip.tsx
│
├── hooks/                # Custom React hooks
│   ├── useComponentRisks.ts
│   └── useCoachData.ts
│
├── services/             # API and data layer
│   ├── api.ts            # API service interface
│   └── mockData.ts       # Mock data for development
│
├── types/                # TypeScript definitions
│   └── index.ts          # All type definitions
│
├── __tests__/            # Test files
│   ├── RiskList.test.tsx
│   └── CoachPanel.test.tsx
│
├── App.tsx               # Main application component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## Integrating Real APIs

The application is designed for easy backend integration. All API calls are isolated in `src/services/api.ts`.

### To connect real endpoints:

1. **Update Base URL**:
   ```typescript
   // In src/services/api.ts
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api.com';
   ```

2. **Set Environment Variable**:
   ```bash
   # .env
   VITE_API_BASE_URL=https://your-api.com/api
   ```

3. **Replace Mock Implementations**:
   ```typescript
   // Example: Replace fetchComponentRisks
   export async function fetchComponentRisks(filters?: Partial<RiskFilters>) {
     const response = await fetch(`${API_BASE_URL}/risks?${buildQueryParams(filters)}`);
     return response.json();
   }
   ```

### Expected API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/risks` | GET | List all component risks |
| `/risks/:id` | GET | Get single risk details |
| `/coach/:riskId` | GET | Get coach panel data |
| `/mitigations?riskId=` | GET | Get mitigation options |
| `/mitigations/:id/execute` | POST | Execute mitigation |
| `/suppliers` | GET | List suppliers |
| `/plants` | GET | List plants |

## Data Types

### ComponentRisk
```typescript
interface ComponentRisk {
  id: string;
  componentId: string;
  componentName: string;
  supplierName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  daysOfSupply: number;
  disruptionStartDate: string;
  disruptionEndDate: string;
  rootCauseCategory: RootCauseCategory;
  mitigationStatus: 'NONE' | 'PLANNED' | 'EXECUTING' | 'COMPLETED';
  // ... see types/index.ts for full definition
}
```

### MitigationOption
```typescript
interface MitigationOption {
  id: string;
  title: string;
  description: string;
  isRecommended: boolean;
  estimatedLeadTimeImpactDays: number;
  estimatedCostImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  type: MitigationType;
  // ... see types/index.ts for full definition
}
```

## Styling

The UI uses Tailwind CSS with custom design tokens:

- **Primary**: Teal (`primary-500`: #14b89c)
- **Risk Colors**:
  - Critical: Red (#dc2626)
  - High: Orange (#f97316)
  - Medium: Yellow (#eab308)
  - Low: Green (#22c55e)
- **Surface**: Soft neutrals (50-300 scale)

Custom components are styled using utility classes and CSS-in-Tailwind patterns defined in `src/index.css`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Date Utils**: date-fns
- **Testing**: Vitest + React Testing Library

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Submit a pull request

## License

Proprietary - All rights reserved.
