import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_DEALS, TEST_CONTACTS, formatCurrency } from '@/lib/testData'

export default function Analytics() {
  const [user, setUser] = useState(null)
  const wonDeals = TEST_DEALS.filter(d => d.stage === 'won')
  const totalRevenue = wonDeals.reduce((sum, d) => sum + d.deal_value, 0)
  const [stats, setStats] = useState({
    totalRevenue: totalRevenue,
    avgDealSize: wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0,
    winRate: TEST_DEALS.length > 0 ? Math.round((wonDeals.length / TEST_DEALS.length) * 100) : 0,
    totalDeals: TEST_DEALS.length,
    wonDeals: wonDeals.length,
    lostDeals: TEST_DEALS.filter(d => d.stage === 'lost').length,
    activeDeals: TEST_DEALS.filter(d => !['won', 'lost'].includes(d.stage)).length,
    avgSalesCycle: 45,
    contactsAdded: TEST_CONTACTS.length,
    conversionRate: TEST_CONTACTS.length > 0 ? Math.round((wonDeals.length / TEST_CONTACTS.length) * 100) : 0
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // Load pipeline data
      const { data: deals, error: dealsError } = await supabase
        .from('pipelines')
        .select('*')

      if (dealsError) throw dealsError

      // Load contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('created_at')

      if (contactsError) throw contactsError

      // Load activity log
      const { data: activity, error: activityError } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (activityError) throw activityError
      setRecentActivity(activity || [])

      // Calculate stats
      const totalDeals = deals?.length || 0
      const wonDeals = deals?.filter(d => d.status === 'won').length || 0
      const lostDeals = deals?.filter(d => d.status === 'lost').length || 0
      const activeDeals = deals?.filter(d => d.status === 'active').length || 0
      
      const totalRevenue = deals
        ?.filter(d => d.status === 'won')
        .reduce((sum, d) => sum + (parseFloat(d.deal_value) || 0), 0) || 0

      const avgDealSize = wonDeals > 0 ? totalRevenue / wonDeals : 0
      const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0

      // Recent contacts (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const contactsAdded = contacts?.filter(c => 
        new Date(c.created_at) > thirtyDaysAgo
      ).length || 0

      const conversionRate = contactsAdded > 0 ? (wonDeals / contactsAdded) * 100 : 0

      setStats({
        totalRevenue,
        avgDealSize,
        winRate,
        totalDeals,
        wonDeals,
        lostDeals,
        activeDeals,
        avgSalesCycle: 0, // Would need date tracking
        contactsAdded,
        conversionRate
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Analytics</h1>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-green-600">\${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-slate-600">Total Revenue</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold">\${stats.avgDealSize.toLocaleString()}</div>
              <div className="text-slate-600">Avg Deal Size</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-blue-600">{stats.winRate.toFixed(1)}%</div>
              <div className="text-slate-600">Win Rate</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</div>
              <div className="text-slate-600">Conversion Rate</div>
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Pipeline Overview</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold">{stats.totalDeals}</div>
              <div className="text-slate-600">Total Deals</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600">{stats.activeDeals}</div>
              <div className="text-slate-600">Active Deals</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">{stats.wonDeals}</div>
              <div className="text-slate-600">Won Deals</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-2xl font-bold text-red-600">{stats.lostDeals}</div>
              <div className="text-slate-600">Lost Deals</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity ({stats.contactsAdded} contacts added last 30 days)</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <tr key={activity.id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {activity.action_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{activity.description}</td>
                      <td className="px-6 py-4">{activity.user_id}</td>
                      <td className="px-6 py-4 text-sm">{new Date(activity.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No recent activity logged
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Summary */}
        <div>
          <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-medium">Revenue Goal Progress</span>
                <span className="text-2xl font-bold text-green-600">\${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-medium">Average Deal Value</span>
                <span className="text-lg font-semibold">\${stats.avgDealSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-medium">Win/Loss Ratio</span>
                <span className="text-lg font-semibold">{stats.wonDeals}:{stats.lostDeals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Contact to Deal Conversion</span>
                <span className="text-lg font-semibold">{stats.conversionRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
