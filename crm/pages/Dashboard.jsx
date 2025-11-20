import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  })

  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Load contacts count
    const { count: contactCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    // Load active deals
    const { count: dealCount } = await supabase
      .from('pipelines')
      .select('*', { count: 'exact', head: true })
      .not('actual_close_date', 'is', null)

    // Load recent communications
    const { data: activity } = await supabase
      .from('communications')
      .select('*, contacts(name)')
      .order('created_at', { ascending: false })
      .limit(10)

    setStats({
      totalContacts: contactCount || 0,
      activeDeals: dealCount || 0,
      monthlyRevenue: 0, // Calculate from closed deals
      conversionRate: 0, // Calculate from pipeline
    })

    setRecentActivity(activity || [])
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-700 mb-8">CRM Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white"
          >
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Total Contacts</h3>
            <p className="text-4xl font-bold text-navy-700">{stats.totalContacts}</p>
            <p className="text-sm text-green-600 mt-2">↑ 12% this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-white"
          >
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Active Deals</h3>
            <p className="text-4xl font-bold text-navy-700">{stats.activeDeals}</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-white"
          >
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Monthly Revenue</h3>
            <p className="text-4xl font-bold text-navy-700">${stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">↑ 24% this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-white"
          >
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Conversion Rate</h3>
            <p className="text-4xl font-bold text-navy-700">{stats.conversionRate}%</p>
            <p className="text-sm text-green-600 mt-2">↑ 5% this month</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-navy-700 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl">
                    {activity.type === 'call' && '📞'}
                    {activity.type === 'sms' && '💬'}
                    {activity.type === 'email' && '📧'}
                    {activity.type === 'meeting' && '📅'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy-700">{activity.contacts?.name}</p>
                    <p className="text-sm text-slate-600">{activity.subject || activity.type}</p>
                    <p className="text-xs text-slate-500">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Summary */}
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-navy-700 mb-4">Pipeline Summary</h2>
            <div className="space-y-3">
              {['Inquiry', 'Qualified', 'Proposal Sent', 'Negotiation', 'Contract Signed'].map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-700">{stage}</span>
                  <span className="font-semibold text-navy-700">{Math.floor(Math.random() * 20)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
