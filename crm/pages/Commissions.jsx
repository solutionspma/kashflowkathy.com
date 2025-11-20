import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Commissions() {
  const [commissions, setCommissions] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, approved, paid
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalPaid: 0,
    nextPaymentDate: '',
  })

  useEffect(() => {
    loadCommissions()
  }, [filter])

  const loadCommissions = async () => {
    let query = supabase
      .from('commissions')
      .select('*, contact:contacts(name, email), referral:referrals(referrer_name)')
      .order('created_at', { ascending: false })
    
    if (filter !== 'all') {
      query = query.eq('status', filter)
    }
    
    const { data, error } = await query
    
    if (!error && data) {
      setCommissions(data)
      
      // Calculate stats
      const pending = data.filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + (c.commission_amount || 0), 0)
      const approved = data.filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + (c.commission_amount || 0), 0)
      const paid = data.filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + (c.commission_amount || 0), 0)
      
      // Calculate next payment date (15th of next month)
      const today = new Date()
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15)
      
      setStats({
        totalPending: pending,
        totalApproved: approved,
        totalPaid: paid,
        nextPaymentDate: nextMonth.toLocaleDateString(),
      })
    }
  }

  const updateStatus = async (id, status) => {
    const updates = { status }
    if (status === 'paid') {
      updates.payment_date = new Date().toISOString()
    }
    
    await supabase
      .from('commissions')
      .update(updates)
      .eq('id', id)
    
    loadCommissions()
  }

  const approveAll = async () => {
    const pendingIds = commissions
      .filter(c => c.status === 'pending')
      .map(c => c.id)
    
    if (pendingIds.length === 0) return
    
    await supabase
      .from('commissions')
      .update({ status: 'approved' })
      .in('id', pendingIds)
    
    loadCommissions()
  }

  const markAllPaid = async () => {
    const approvedIds = commissions
      .filter(c => c.status === 'approved')
      .map(c => c.id)
    
    if (approvedIds.length === 0) return
    
    await supabase
      .from('commissions')
      .update({ 
        status: 'paid',
        payment_date: new Date().toISOString()
      })
      .in('id', approvedIds)
    
    loadCommissions()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Commissions</h1>
            <p className="text-slate-600 mt-1">Manage referral and direct sale commissions</p>
          </div>
          <div className="flex gap-2">
            <button onClick={approveAll} className="btn-outline">
              Approve All Pending
            </button>
            <button onClick={markAllPaid} className="btn-primary">
              Mark Approved as Paid
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Pending Approval</div>
            <div className="text-3xl font-bold text-gold-600">
              ${stats.totalPending.toLocaleString()}
            </div>
          </div>
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600">
              ${stats.totalApproved.toLocaleString()}
            </div>
          </div>
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Paid to Date</div>
            <div className="text-3xl font-bold text-navy-700">
              ${stats.totalPaid.toLocaleString()}
            </div>
          </div>
          <div className="card bg-white">
            <div className="text-sm text-slate-600 mb-1">Next Payment</div>
            <div className="text-2xl font-bold text-navy-700">
              {stats.nextPaymentDate}
            </div>
            <div className="text-xs text-slate-500 mt-1">15th of each month</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === 'all'
                ? 'bg-navy-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Commissions
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === 'pending'
                ? 'bg-navy-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === 'approved'
                ? 'bg-navy-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === 'paid'
                ? 'bg-navy-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Paid
          </button>
        </div>

        {/* Commission Table */}
        <div className="card bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Deal Value</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Commission</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy-700">
                        {commission.contact?.name || 'N/A'}
                      </div>
                      {commission.referral && (
                        <div className="text-xs text-slate-500">
                          via {commission.referral.referrer_name}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        commission.type === 'referral'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {commission.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-700">
                      ${commission.deal_value?.toLocaleString() || '0'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {(commission.commission_rate * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-lg font-bold text-navy-700">
                      ${commission.commission_amount?.toLocaleString() || '0'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        commission.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : commission.status === 'approved'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gold-100 text-gold-700'
                      }`}>
                        {commission.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {commission.payment_date
                        ? new Date(commission.payment_date).toLocaleDateString()
                        : new Date(commission.created_at).toLocaleDateString()
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {commission.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(commission.id, 'approved')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {commission.status === 'approved' && (
                          <button
                            onClick={() => updateStatus(commission.id, 'paid')}
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
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

            {commissions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💵</div>
                <h3 className="text-xl font-bold text-navy-700 mb-2">
                  No {filter !== 'all' ? filter : ''} commissions
                </h3>
                <p className="text-slate-600">Commission data will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Commission Rates Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card bg-gradient-to-br from-purple-600 to-purple-800 text-white">
            <h3 className="text-xl font-bold mb-3">🤝 Referral Commission</h3>
            <div className="text-4xl font-bold mb-2">10%</div>
            <p className="text-sm text-purple-100">
              Earn 10% on any referred client who becomes a paying customer
            </p>
          </div>
          <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <h3 className="text-xl font-bold mb-3">💼 Direct Sale Commission</h3>
            <div className="text-4xl font-bold mb-2">40%</div>
            <p className="text-sm text-blue-100">
              Earn 40% commission on deals you close directly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
