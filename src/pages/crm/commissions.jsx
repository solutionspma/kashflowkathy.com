import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_COMMISSIONS, formatCurrency, formatDate } from '@/lib/testData'

export default function Commissions() {
  const [user, setUser] = useState(null)
  const [commissions, setCommissions] = useState(TEST_COMMISSIONS)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadCommissions()
  }, [])

  const loadCommissions = async () => {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .select(`
          *,
          referral:referrals(referrer_name, referred_contact_id),
          contact:contacts(name, email, company)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCommissions(data || [])
    } catch (error) {
      console.error('Error loading commissions:', error)
    }
  }

  const approveCommission = async (id) => {
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ status: 'approved' })
        .eq('id', id)

      if (error) throw error
      loadCommissions()
    } catch (error) {
      console.error('Error approving commission:', error)
    }
  }

  const markPaid = async (id) => {
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ 
          status: 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      loadCommissions()
    } catch (error) {
      console.error('Error marking commission paid:', error)
    }
  }

  if (!user) return null

  const filtered = filterStatus === 'all' 
    ? commissions 
    : commissions.filter(c => c.status === filterStatus)

  const totalPending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0)

  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Commissions</h1>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{commissions.length}</div>
            <div className="text-slate-600">Total</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold">\${totalPending.toLocaleString()}</div>
            <div className="text-slate-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">{commissions.filter(c => c.status === 'approved').length}</div>
            <div className="text-slate-600">Approved</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">\${totalPaid.toLocaleString()}</div>
            <div className="text-slate-600">Paid</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-navy-900 text-white' : 'bg-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg ${filterStatus === 'pending' ? 'bg-navy-900 text-white' : 'bg-slate-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg ${filterStatus === 'approved' ? 'bg-navy-900 text-white' : 'bg-slate-200'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 rounded-lg ${filterStatus === 'paid' ? 'bg-navy-900 text-white' : 'bg-slate-200'}`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Commissions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Referrer/Contact</th>
                <th className="px-6 py-3 text-left">Deal Value</th>
                <th className="px-6 py-3 text-left">Rate</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((commission) => (
                <tr key={commission.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      commission.type === 'referral' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {commission.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {commission.referral?.referrer_name || commission.contact?.name}
                  </td>
                  <td className="px-6 py-4 font-medium">\${parseFloat(commission.deal_value || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">{(parseFloat(commission.commission_rate || 0) * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-green-600 font-bold">\${parseFloat(commission.commission_amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      commission.status === 'paid' ? 'bg-green-100 text-green-800' :
                      commission.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {commission.payment_date ? new Date(commission.payment_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {commission.status === 'pending' && (
                        <button
                          onClick={() => approveCommission(commission.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Approve
                        </button>
                      )}
                      {commission.status === 'approved' && (
                        <button
                          onClick={() => markPaid(commission.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
