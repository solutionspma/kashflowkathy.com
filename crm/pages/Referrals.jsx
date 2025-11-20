import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Referrals() {
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    converted: 0,
    totalCommission: 0,
  })

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    const { data, error } = await supabase
      .from('referrals')
      .select('*, referred_contact:contacts(name, email, status)')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setReferrals(data)
      
      // Calculate stats
      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        converted: data.filter(r => r.status === 'converted').length,
        totalCommission: data.reduce((sum, r) => sum + (r.commission_amount || 0), 0),
      }
      setStats(stats)
    }
  }

  const updateStatus = async (id, status) => {
    await supabase
      .from('referrals')
      .update({ status })
      .eq('id', id)
    
    loadReferrals()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Referral Program</h1>
            <p className="text-slate-600 mt-1">Track referrals and commission payments</p>
          </div>
          <button className="btn-primary">+ New Referral</button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white">
            <div className="text-3xl font-bold text-navy-700">{stats.total}</div>
            <div className="text-sm text-slate-600">Total Referrals</div>
          </div>
          <div className="card bg-white">
            <div className="text-3xl font-bold text-gold-600">{stats.pending}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </div>
          <div className="card bg-white">
            <div className="text-3xl font-bold text-green-600">{stats.converted}</div>
            <div className="text-sm text-slate-600">Converted</div>
          </div>
          <div className="card bg-white">
            <div className="text-3xl font-bold text-navy-700">
              ${stats.totalCommission.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Commissions</div>
          </div>
        </div>

        {/* Referral List */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-navy-700 mb-4">Referrals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Referrer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Commission</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy-700">{referral.referrer_name}</div>
                      <div className="text-xs text-slate-500">{referral.referrer_phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {referral.referred_contact?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {referral.referrer_email}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'converted' 
                          ? 'bg-green-100 text-green-700' 
                          : referral.status === 'paid'
                          ? 'bg-navy-100 text-navy-700'
                          : 'bg-gold-100 text-gold-700'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-700">
                      {referral.commission_amount 
                        ? `$${referral.commission_amount.toLocaleString()}`
                        : `${(referral.commission_rate * 100).toFixed(0)}%`
                      }
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {referral.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(referral.id, 'converted')}
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
                          >
                            Mark Converted
                          </button>
                        )}
                        {referral.status === 'converted' && (
                          <button
                            onClick={() => updateStatus(referral.id, 'paid')}
                            className="text-sm text-navy-600 hover:text-navy-700 font-semibold"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button className="text-slate-400 hover:text-slate-600">⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {referrals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-navy-700 mb-2">No referrals yet</h3>
                <p className="text-slate-600 mb-4">Start tracking referrals to grow your business</p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Program Info */}
        <div className="mt-8 card bg-gradient-to-br from-navy-700 to-navy-900 text-white">
          <h3 className="text-2xl font-bold mb-4">💰 Referral Commission Structure</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-4xl font-bold text-gold-300 mb-2">10%</div>
              <div className="text-lg font-semibold mb-1">Referral Commission</div>
              <div className="text-sm text-slate-300">
                Earn 10% commission on any referred client who becomes a customer
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-300 mb-2">15th</div>
              <div className="text-lg font-semibold mb-1">Payment Schedule</div>
              <div className="text-sm text-slate-300">
                Commissions paid on the 15th of each month for closed deals
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
