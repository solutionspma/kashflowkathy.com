import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_REFERRALS, TEST_CONTACTS, formatCurrency, formatDate } from '@/lib/testData'
import NotesTimeline from '@/components/NotesTimeline'

export default function Referrals() {
  const [user, setUser] = useState(null)
  const [referrals, setReferrals] = useState(TEST_REFERRALS)
  const [contacts, setContacts] = useState(TEST_CONTACTS)
  const [showForm, setShowForm] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [notes, setNotes] = useState([])
  const [formData, setFormData] = useState({
    referrer_name: '',
    referrer_email: '',
    referrer_phone: '',
    referred_name: '',
    referred_email: '',
    referred_phone: '',
    referred_company: '',
    commission_rate: 0.10,
    status: 'pending',
    source: '',
    notes: ''
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadReferrals()
    loadContacts()
  }, [])

  const loadReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReferrals(data && data.length > 0 ? data : TEST_REFERRALS)
    } catch (error) {
      console.error('Error loading referrals:', error)
      setReferrals(TEST_REFERRALS)
    }
  }

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, email, company')
        .order('name')

      if (error) throw error
      setContacts(data && data.length > 0 ? data : TEST_CONTACTS)
    } catch (error) {
      console.error('Error loading contacts:', error)
      setContacts(TEST_CONTACTS)
    }
  }

  const loadNotes = async (referralId) => {
    try {
      const { data, error } = await supabase
        .from('contact_notes')
        .select('*')
        .eq('contact_id', referralId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
      setNotes([])
    }
  }

  const handleSelectReferral = (referral) => {
    setSelectedReferral(referral)
    loadNotes(referral.id)
  }

  const handleEdit = (referral) => {
    setEditMode(referral.id)
    setFormData({
      referrer_name: referral.referrer_name,
      referrer_email: referral.referrer_email,
      referrer_phone: referral.referrer_phone,
      referred_name: referral.referred_name,
      referred_email: referral.referred_email,
      referred_phone: referral.referred_phone,
      referred_company: referral.referred_company,
      commission_rate: referral.commission_rate,
      status: referral.status,
      source: referral.source,
      notes: referral.notes
    })
  }

  const handleSaveEdit = async (referralId) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update(formData)
        .eq('id', referralId)

      if (error) throw error

      setEditMode(null)
      loadReferrals()
      if (selectedReferral?.id === referralId) {
        setSelectedReferral({ ...selectedReferral, ...formData })
      }
    } catch (error) {
      console.error('Error updating referral:', error)
      alert('Error updating referral')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('referrals')
        .insert([formData])

      if (error) throw error

      setShowForm(false)
      setFormData({
        referrer_name: '',
        referrer_email: '',
        referrer_phone: '',
        referred_contact_id: '',
        commission_rate: 0.10,
        status: 'pending'
      })
      loadReferrals()
    } catch (error) {
      console.error('Error creating referral:', error)
      alert('Error creating referral')
    }
  }

  const markConverted = async (id) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status: 'converted' })
        .eq('id', id)

      if (error) throw error
      loadReferrals()
    } catch (error) {
      console.error('Error updating referral:', error)
    }
  }

  if (!user) return null

  const totalCommissions = referrals
    .filter(r => r.status === 'converted')
    .reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Referrals</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + New Referral
              </button>
              <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">🤝</div>
            <div className="text-2xl font-bold">{referrals.length}</div>
            <div className="text-slate-600">Total Referrals</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">{referrals.filter(r => r.status === 'converted').length}</div>
            <div className="text-slate-600">Converted</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">\${totalCommissions.toLocaleString()}</div>
            <div className="text-slate-600">Total Commissions</div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">New Referral</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Referrer Name *"
                required
                value={formData.referrer_name}
                onChange={(e) => setFormData({...formData, referrer_name: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Referrer Email"
                value={formData.referrer_email}
                onChange={(e) => setFormData({...formData, referrer_email: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Referrer Phone"
                value={formData.referrer_phone}
                onChange={(e) => setFormData({...formData, referrer_phone: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={formData.referred_contact_id}
                onChange={(e) => setFormData({...formData, referred_contact_id: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Select Referred Contact</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="Commission Rate (0.10 = 10%)"
                value={formData.commission_rate}
                onChange={(e) => setFormData({...formData, commission_rate: parseFloat(e.target.value)})}
                className="px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2 col-span-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Create Referral
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Referrals Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Referrer</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Rate</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{referral.referrer_name}</td>
                  <td className="px-6 py-4">{referral.referred_contact?.name}</td>
                  <td className="px-6 py-4">{referral.referrer_email}</td>
                  <td className="px-6 py-4">{referral.referrer_phone}</td>
                  <td className="px-6 py-4">{(parseFloat(referral.commission_rate) * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      referral.status === 'converted' ? 'bg-green-100 text-green-800' :
                      referral.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {referral.status === 'pending' && (
                      <button
                        onClick={() => markConverted(referral.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Mark Converted
                      </button>
                    )}
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
