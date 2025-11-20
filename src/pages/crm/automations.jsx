import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_AUTOMATIONS } from '@/lib/testData'

export default function Automations() {
  const [user, setUser] = useState(null)
  const [automations, setAutomations] = useState(TEST_AUTOMATIONS)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    trigger_type: 'event_based',
    trigger_config: { event: 'contact_created' },
    action_type: 'send_email',
    action_config: { template_id: '', delay_hours: 0 },
    is_active: true
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadAutomations()
  }, [])

  const loadAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAutomations(data && data.length > 0 ? data : TEST_AUTOMATIONS)
    } catch (error) {
      console.log('Using test data for automations')
      setAutomations(TEST_AUTOMATIONS)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('automations')
        .insert([formData])

      if (error) throw error

      setShowForm(false)
      setFormData({
        name: '',
        trigger_type: 'event_based',
        trigger_config: { event: 'contact_created' },
        action_type: 'send_email',
        action_config: { template_id: '', delay_hours: 0 },
        is_active: true
      })
      loadAutomations()
    } catch (error) {
      console.error('Error creating automation:', error)
      alert('Error creating automation')
    }
  }

  const toggleActive = async (id, isActive) => {
    try {
      const { error } = await supabase
        .from('automations')
        .update({ is_active: !isActive })
        .eq('id', id)

      if (error) throw error
      loadAutomations()
    } catch (error) {
      console.error('Error toggling automation:', error)
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
              <h1 className="text-2xl font-bold">Automations</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + New Automation
              </button>
              <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">New Automation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Automation Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trigger Type</label>
                  <select
                    value={formData.trigger_type}
                    onChange={(e) => setFormData({...formData, trigger_type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="event_based">Event Based</option>
                    <option value="time_based">Time Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trigger Event</label>
                  <select
                    onChange={(e) => setFormData({
                      ...formData, 
                      trigger_config: { event: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="contact_created">Contact Created</option>
                    <option value="deal_created">Deal Created</option>
                    <option value="deal_won">Deal Won</option>
                    <option value="deal_lost">Deal Lost</option>
                    <option value="stage_changed">Stage Changed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Action Type</label>
                  <select
                    value={formData.action_type}
                    onChange={(e) => setFormData({...formData, action_type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="send_email">Send Email</option>
                    <option value="send_sms">Send SMS</option>
                    <option value="update_stage">Update Stage</option>
                    <option value="assign_to">Assign To User</option>
                    <option value="add_tag">Add Tag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delay (hours)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = immediate"
                    onChange={(e) => setFormData({
                      ...formData,
                      action_config: { ...formData.action_config, delay_hours: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Create Automation
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {automations.map((automation) => (
            <div key={automation.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-navy-900">{automation.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      automation.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {automation.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Trigger:</span> {automation.trigger_type.replace('_', ' ')}
                      {automation.trigger_config?.event && ` (${automation.trigger_config.event.replace('_', ' ')})`}
                    </div>
                    <div>
                      <span className="font-medium">Action:</span> {automation.action_type.replace('_', ' ')}
                    </div>
                    {automation.action_config?.delay_hours > 0 && (
                      <div>
                        <span className="font-medium">Delay:</span> {automation.action_config.delay_hours}h
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(automation.id, automation.is_active)}
                  className={`px-4 py-2 rounded-lg ${
                    automation.is_active 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {automation.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
