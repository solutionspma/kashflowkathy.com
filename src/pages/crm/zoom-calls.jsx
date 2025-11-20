import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_ZOOM_CALLS, TEST_CONTACTS, formatDateTime } from '@/lib/testData'

export default function ZoomCalls() {
  const [user, setUser] = useState(null)
  const [calls, setCalls] = useState(TEST_ZOOM_CALLS)
  const [contacts, setContacts] = useState(TEST_CONTACTS)
  const [showForm, setShowForm] = useState(false)
  const [timeFilter, setTimeFilter] = useState('all')
  const [formData, setFormData] = useState({
    contact_id: '',
    meeting_id: '',
    meeting_url: '',
    start_time: '',
    duration: 30,
    notes: ''
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadCalls()
    loadContacts()
  }, [])

  const loadCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('zoom_logs')
        .select(`
          *,
          contact:contacts(name, email, company)
        `)
        .order('start_time', { ascending: false })

      if (error) throw error
      setCalls(data || [])
    } catch (error) {
      console.error('Error loading calls:', error)
    }
  }

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, email, company')
        .order('name')

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('zoom_logs')
        .insert([{
          ...formData,
          created_by: user.username
        }])

      if (error) throw error

      setShowForm(false)
      setFormData({
        contact_id: '',
        meeting_id: '',
        meeting_url: '',
        start_time: '',
        duration: 30,
        notes: ''
      })
      loadCalls()
    } catch (error) {
      console.error('Error creating call:', error)
      alert('Error scheduling call')
    }
  }

  if (!user) return null

  const now = new Date()
  const upcoming = calls.filter(c => new Date(c.start_time) > now)
  const past = calls.filter(c => new Date(c.start_time) <= now)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Zoom Calls</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + Schedule Call
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
            <div className="text-3xl mb-2">📞</div>
            <div className="text-2xl font-bold">{upcoming.length}</div>
            <div className="text-slate-600">Upcoming Calls</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">{past.length}</div>
            <div className="text-slate-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">🎥</div>
            <div className="text-2xl font-bold">{calls.filter(c => c.recording_url).length}</div>
            <div className="text-slate-600">With Recordings</div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Schedule Zoom Call</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <select
                value={formData.contact_id}
                onChange={(e) => setFormData({...formData, contact_id: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Contact *</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Meeting ID"
                value={formData.meeting_id}
                onChange={(e) => setFormData({...formData, meeting_id: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="Meeting URL"
                value={formData.meeting_url}
                onChange={(e) => setFormData({...formData, meeting_url: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="px-4 py-2 border rounded-lg"
                min="15"
                step="15"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="col-span-2 px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2 col-span-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Schedule Call
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Upcoming Calls */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Calls ({upcoming.length})</h2>
          <div className="space-y-4">
            {upcoming.map((call) => (
              <div key={call.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{call.contact?.name}</h3>
                    <p className="text-slate-600">{call.contact?.company}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      📅 {new Date(call.start_time).toLocaleString()} ({call.duration} min)
                    </p>
                    {call.notes && <p className="text-sm mt-2">{call.notes}</p>}
                  </div>
                  {call.meeting_url && (
                    <a
                      href={call.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Calls */}
        <div>
          <h2 className="text-xl font-bold mb-4">Past Calls ({past.length})</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Contact</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                  <th className="px-6 py-3 text-left">Notes</th>
                  <th className="px-6 py-3 text-left">Recording</th>
                </tr>
              </thead>
              <tbody>
                {past.map((call) => (
                  <tr key={call.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{call.contact?.name}</div>
                      <div className="text-sm text-slate-600">{call.contact?.company}</div>
                    </td>
                    <td className="px-6 py-4">{new Date(call.start_time).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{call.duration} min</td>
                    <td className="px-6 py-4 text-sm">{call.notes || '-'}</td>
                    <td className="px-6 py-4">
                      {call.recording_url ? (
                        <a href={call.recording_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
