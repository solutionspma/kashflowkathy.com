import React, { useState } from 'react'
import { Line, Bar, Pie } from 'recharts'

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30') // days

  // Sample data - in production, fetch from Supabase
  const revenueData = [
    { month: 'Jan', revenue: 45000, deals: 12 },
    { month: 'Feb', revenue: 52000, deals: 15 },
    { month: 'Mar', revenue: 48000, deals: 13 },
    { month: 'Apr', revenue: 61000, deals: 18 },
    { month: 'May', revenue: 55000, deals: 16 },
    { month: 'Jun', revenue: 67000, deals: 20 },
  ]

  const pipelineData = [
    { stage: 'Inquiry', count: 45, value: 225000 },
    { stage: 'Qualified', count: 32, value: 180000 },
    { stage: 'Proposal Sent', count: 18, value: 145000 },
    { stage: 'Negotiation', count: 12, value: 98000 },
    { stage: 'Contract Signed', count: 8, value: 75000 },
  ]

  const leadSourceData = [
    { name: 'Website', value: 45, color: '#002d69' },
    { name: 'Referral', value: 30, color: '#f5d787' },
    { name: 'Social Media', value: 15, color: '#64748b' },
    { name: 'Direct', value: 10, color: '#10b981' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Analytics</h1>
            <p className="text-slate-600 mt-1">Track performance and insights</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-48"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-navy-700">$328K</div>
            <div className="text-sm text-green-600 mt-1">↑ 12.5% from last period</div>
          </div>
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Active Deals</div>
            <div className="text-3xl font-bold text-navy-700">94</div>
            <div className="text-sm text-green-600 mt-1">↑ 8 new this week</div>
          </div>
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Conversion Rate</div>
            <div className="text-3xl font-bold text-navy-700">24.3%</div>
            <div className="text-sm text-red-600 mt-1">↓ 2.1% from last period</div>
          </div>
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Avg Deal Size</div>
            <div className="text-3xl font-bold text-navy-700">$12.4K</div>
            <div className="text-sm text-green-600 mt-1">↑ 5.2% from last period</div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card bg-white mb-8">
          <h2 className="text-xl font-bold text-navy-700 mb-4">Revenue Trend</h2>
          <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-slate-600">Line chart visualization</p>
              <p className="text-sm text-slate-500 mt-2">
                Recharts component will render here
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pipeline by Stage */}
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-navy-700 mb-4">Pipeline by Stage</h2>
            <div className="space-y-4">
              {pipelineData.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-navy-700">{stage.stage}</span>
                    <span className="text-sm text-slate-600">
                      {stage.count} deals • ${(stage.value / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-navy-700 h-3 rounded-full"
                      style={{ width: `${(stage.count / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-navy-700 mb-4">Lead Sources</h2>
            <div className="space-y-3">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="font-semibold text-navy-700">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{source.value}%</span>
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${source.value}%`,
                          backgroundColor: source.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-white">
            <h3 className="font-bold text-navy-700 mb-4">📞 Communication</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Calls Made</span>
                <span className="font-semibold text-navy-700">147</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Emails Sent</span>
                <span className="font-semibold text-navy-700">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">SMS Sent</span>
                <span className="font-semibold text-navy-700">63</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Meetings</span>
                <span className="font-semibold text-navy-700">24</span>
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <h3 className="font-bold text-navy-700 mb-4">🎯 Performance</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Response Time</span>
                <span className="font-semibold text-navy-700">2.3 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Follow-up Rate</span>
                <span className="font-semibold text-navy-700">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Win Rate</span>
                <span className="font-semibold text-navy-700">31%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Avg Sales Cycle</span>
                <span className="font-semibold text-navy-700">18 days</span>
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <h3 className="font-bold text-navy-700 mb-4">💰 Revenue</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">This Month</span>
                <span className="font-semibold text-navy-700">$67K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Month</span>
                <span className="font-semibold text-navy-700">$55K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">YTD</span>
                <span className="font-semibold text-navy-700">$328K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Forecast</span>
                <span className="font-semibold text-green-600">$425K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
