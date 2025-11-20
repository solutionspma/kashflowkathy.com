import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Automations() {
  const [automations, setAutomations] = useState([])
  const [showNewModal, setShowNewModal] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger_type: 'time_based',
    trigger_config: {},
    action_type: 'send_email',
    action_config: {},
    is_active: true,
  })

  useEffect(() => {
    loadAutomations()
  }, [])

  const loadAutomations = async () => {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setAutomations(data)
    }
  }

  const handleCreate = async () => {
    const { error } = await supabase.from('automations').insert([newAutomation])
    
    if (!error) {
      setShowNewModal(false)
      loadAutomations()
      setNewAutomation({
        name: '',
        trigger_type: 'time_based',
        trigger_config: {},
        action_type: 'send_email',
        action_config: {},
        is_active: true,
      })
    }
  }

  const toggleActive = async (id, currentStatus) => {
    await supabase
      .from('automations')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    
    loadAutomations()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Automations</h1>
            <p className="text-slate-600 mt-1">Automate your follow-ups and workflows</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary"
          >
            + New Automation
          </button>
        </div>

        {/* Automation List */}
        <div className="grid gap-4">
          {automations.map((automation) => (
            <div key={automation.id} className="card bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-navy-700">{automation.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      automation.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {automation.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                    <div>
                      <span className="font-semibold">Trigger:</span>{' '}
                      {automation.trigger_type === 'time_based' ? '⏰ Time-based' : '⚡ Event-based'}
                    </div>
                    <div>
                      <span className="font-semibold">Action:</span>{' '}
                      {automation.action_type.replace(/_/g, ' ')}
                    </div>
                  </div>

                  {automation.last_run && (
                    <div className="text-xs text-slate-500">
                      Last run: {new Date(automation.last_run).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(automation.id, automation.is_active)}
                    className="btn-outline text-sm"
                  >
                    {automation.is_active ? 'Pause' : 'Activate'}
                  </button>
                  <button className="btn-outline text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-700 px-3 py-2">🗑️</button>
                </div>
              </div>
            </div>
          ))}

          {automations.length === 0 && (
            <div className="card bg-white text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-navy-700 mb-2">No automations yet</h3>
              <p className="text-slate-600 mb-4">Create your first automation to save time</p>
              <button onClick={() => setShowNewModal(true)} className="btn-primary">
                Create Automation
              </button>
            </div>
          )}
        </div>

        {/* Pre-built Automation Templates */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy-700 mb-4">Popular Templates</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-white border-2 border-navy-100 hover:border-navy-300 cursor-pointer transition-all">
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-bold text-navy-700 mb-2">3-Day Follow-up Sequence</h4>
              <p className="text-sm text-slate-600 mb-3">
                Automatically follow up with new leads after 3 days
              </p>
              <button className="text-navy-600 font-semibold text-sm hover:text-navy-700">
                Use Template →
              </button>
            </div>

            <div className="card bg-white border-2 border-navy-100 hover:border-navy-300 cursor-pointer transition-all">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-bold text-navy-700 mb-2">SMS Check-in</h4>
              <p className="text-sm text-slate-600 mb-3">
                Send SMS to warm leads every week
              </p>
              <button className="text-navy-600 font-semibold text-sm hover:text-navy-700">
                Use Template →
              </button>
            </div>

            <div className="card bg-white border-2 border-navy-100 hover:border-navy-300 cursor-pointer transition-all">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-bold text-navy-700 mb-2">Pipeline Stage Notification</h4>
              <p className="text-sm text-slate-600 mb-3">
                Notify when deal moves to negotiation stage
              </p>
              <button className="text-navy-600 font-semibold text-sm hover:text-navy-700">
                Use Template →
              </button>
            </div>
          </div>
        </div>

        {/* New Automation Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold text-navy-700 mb-4">New Automation</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Automation Name
                  </label>
                  <input
                    type="text"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 3-Day Follow-up Email"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Trigger Type
                    </label>
                    <select
                      value={newAutomation.trigger_type}
                      onChange={(e) => setNewAutomation({ ...newAutomation, trigger_type: e.target.value })}
                      className="input-field"
                    >
                      <option value="time_based">Time-based (after X days)</option>
                      <option value="event_based">Event-based (on action)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Action Type
                    </label>
                    <select
                      value={newAutomation.action_type}
                      onChange={(e) => setNewAutomation({ ...newAutomation, action_type: e.target.value })}
                      className="input-field"
                    >
                      <option value="send_email">Send Email</option>
                      <option value="send_sms">Send SMS</option>
                      <option value="update_stage">Update Pipeline Stage</option>
                      <option value="assign_to">Assign to User</option>
                      <option value="add_tag">Add Tag</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newAutomation.is_active}
                    onChange={(e) => setNewAutomation({ ...newAutomation, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm text-slate-700">
                    Activate immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="btn-primary"
                >
                  Create Automation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
