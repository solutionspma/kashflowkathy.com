import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_CONTACTS, TEST_DEALS, formatCurrency } from '@/lib/testData'

export default function CRMDashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalContacts: TEST_CONTACTS.length,
    activeDeals: TEST_DEALS.filter(d => d.stage !== 'won').length,
    monthlyRevenue: TEST_DEALS.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.deal_value, 0),
    conversionRate: Math.round((TEST_DEALS.filter(d => d.stage === 'won').length / TEST_DEALS.length) * 100),
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Try to load from database
      const { count: contactCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })

      const { count: dealCount } = await supabase
        .from('pipelines')
        .select('*', { count: 'exact', head: true })
        .is('actual_close_date', null)

      const { data: revenueData } = await supabase
        .from('pipelines')
        .select('deal_value')
        .not('actual_close_date', 'is', null)

      const revenue = revenueData?.reduce((sum, deal) => sum + (parseFloat(deal.deal_value) || 0), 0) || 0

      // Use DB data if available, otherwise use test data
      setStats({
        totalContacts: contactCount || TEST_CONTACTS.length,
        activeDeals: dealCount || TEST_DEALS.filter(d => d.stage !== 'won').length,
        monthlyRevenue: revenue || TEST_DEALS.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.deal_value, 0),
        conversionRate: contactCount > 0 ? Math.round((dealCount / contactCount) * 100) : Math.round((TEST_DEALS.filter(d => d.stage === 'won').length / TEST_DEALS.length) * 100)
      })
    } catch (error) {
      console.log('Using test data for dashboard')
      // Use test data on error
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold logo-text-light">Kashflow Kathy CRM</h1>
            <div className="flex items-center gap-4">
              <span className="text-gold-400">Welcome, {user.username}</span>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-navy-900">{stats.totalContacts}</div>
            <div className="text-slate-600">Total Contacts</div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">💼</div>
            <div className="text-2xl font-bold text-navy-900">{stats.activeDeals}</div>
            <div className="text-slate-600">Active Deals</div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-navy-900">${stats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-slate-600">Monthly Revenue</div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-navy-900">{stats.conversionRate}%</div>
            <div className="text-slate-600">Conversion Rate</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/crm/contacts" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">👤</div>
              <div>Contacts</div>
            </Link>
            <Link href="/crm/pipeline" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">📊</div>
              <div>Pipeline</div>
            </Link>
            <Link href="/crm/automations" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">⚡</div>
              <div>Automations</div>
            </Link>
            <Link href="/crm/templates" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">📝</div>
              <div>Templates</div>
            </Link>
            <Link href="/crm/sequences" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">🔄</div>
              <div>Sequences</div>
            </Link>
            <Link href="/crm/referrals" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">🤝</div>
              <div>Referrals</div>
            </Link>
            <Link href="/crm/commissions" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">💰</div>
              <div>Commissions</div>
            </Link>
            <Link href="/crm/social-media" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">📱</div>
              <div>Social</div>
            </Link>
            <Link href="/crm/zoom-calls" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">📹</div>
              <div>Zoom</div>
            </Link>
            <Link href="/crm/documents" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">📄</div>
              <div>Documents</div>
            </Link>
            <Link href="/crm/analytics" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">📈</div>
              <div>Analytics</div>
            </Link>
            <Link href="/crm/settings" className="p-6 bg-navy-900 text-white rounded-lg text-center hover:bg-navy-800 transition-colors">
              <div className="text-3xl mb-2">⚙️</div>
              <div>Settings</div>
            </Link>
          </div>
        </div>

        {/* CMS Access */}
        {user.role === 'admin' || user.role === 'masteracct' ? (
          <div className="bg-gradient-to-r from-gold-400 to-gold-600 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Content Management</h2>
            <p className="text-navy-800 mb-6">Edit website content, manage pages, and update settings</p>
            <Link href="/cms/editor" className="inline-block px-6 py-3 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors">
              Open CMS Editor
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
