import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Shield,
  Bell,
  Settings,
  ChevronDown,
  User,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { TimeHorizon } from '../../types';

interface TopBarProps {
  timeHorizon: TimeHorizon;
  onTimeHorizonChange: (value: TimeHorizon) => void;
  lastUpdated?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function TopBar({
  timeHorizon,
  onTimeHorizonChange,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const timeHorizonOptions: { value: TimeHorizon; label: string }[] = [
    { value: 1, label: '1 Week' },
    { value: 2, label: '2 Weeks' },
    { value: 3, label: '3 Weeks' },
    { value: 4, label: '4 Weeks' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              Supply Risk Control Tower
            </h1>
            <p className="text-xs text-gray-500">Short-Term Supply Resilience</p>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-6">
          {/* Time Horizon Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Clock className="w-4 h-4 text-gray-500 ml-2" />
            <span className="text-xs font-medium text-gray-600">Horizon:</span>
            <div className="flex gap-0.5">
              {timeHorizonOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onTimeHorizonChange(option.value)}
                  className={clsx(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
                    timeHorizon === option.value
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Last Updated & Refresh */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {lastUpdated && (
              <span>
                Updated: <span className="font-medium text-gray-700">{lastUpdated}</span>
              </span>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={clsx(
                  'p-1.5 rounded-md hover:bg-gray-100 transition-colors',
                  isRefreshing && 'animate-spin'
                )}
                aria-label="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-700">Supply Manager</p>
                <p className="text-xs text-gray-500">Operations</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elevated border border-gray-200 py-1 animate-fade-in">
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">
                  Profile Settings
                </button>
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">
                  Preferences
                </button>
                <hr className="my-1 border-gray-200" />
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
