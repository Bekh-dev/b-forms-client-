import React from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  // Mock data for demonstration
  const stats = [
    {
      name: 'Total Responses',
      value: '2,543',
      change: '+12.5%',
      changeType: 'increase',
      icon: DocumentTextIcon
    },
    {
      name: 'Active Forms',
      value: '45',
      change: '+5.2%',
      changeType: 'increase',
      icon: ChartBarIcon
    },
    {
      name: 'Total Users',
      value: '1,280',
      change: '+3.8%',
      changeType: 'increase',
      icon: UserGroupIcon
    },
    {
      name: 'Avg. Response Time',
      value: '2.4m',
      change: '-8.1%',
      changeType: 'decrease',
      icon: ClockIcon
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-800 overflow-hidden rounded-lg p-5"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-white">
                        {stat.value}
                      </p>
                      <p
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {stat.change}
                      </p>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Response Trends */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Response Trends</h2>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-400">Chart will be implemented here</p>
          </div>
        </div>

        {/* Form Performance */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Form Performance</h2>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-400">Chart will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
