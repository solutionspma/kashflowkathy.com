import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_SEQUENCES, formatDate } from '@/lib/testData'

export default function Sequences() {
  const [user, setUser] = useState(null)
  const [sequences, setSequences] = useState(TEST_SEQUENCES)
  const [enrollments, setEnrollments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedSequence, setSelectedSequence] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [{ type: 'email', delay_days: 0, template_id: '', content: '' }]
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadSequences()
    loadEnrollments()
  }, [])

  const loadSequences = async () => {
    try {
      const { data, error } = await supabase
        .from('sequences')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSequences(data || [])
    } catch (error) {
      console.error('Error loading sequences:', error)
    }
  }

  const loadEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('sequence_enrollments')
        .select(`
          *,
          sequence:sequences(name),
          contact:contacts(name, email)
        `)
        .eq('status', 'active')

      if (error) throw error
      setEnrollments(data || [])
    } catch (error) {
      console.error('Error loading enrollments:', error)
    }
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { type: 'email', delay_days: 1, template_id: '', content: '' }]
    })
  }

  const removeStep = (index) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    })
  }

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps]
    newSteps[index][field] = value
    setFormData({ ...formData, steps: newSteps })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('sequences')
        .insert([formData])

      if (error) throw error

      setShowForm(false)
      setFormData({
        name: '',
        description: '',
        steps: [{ type: 'email', delay_days: 0, template_id: '', content: '' }]
      })
      loadSequences()
    } catch (error) {
      console.error('Error creating sequence:', error)
      alert('Error creating sequence')
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
              <h1 className="text-2xl font-bold">Sequences</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + New Sequence
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
            <h3 className="text-xl font-bold mb-4">New Sequence</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Sequence Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Sequence Steps</h4>
                  <button type="button" onClick={addStep} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    + Add Step
                  </button>
                </div>

                {formData.steps.map((step, index) => (
                  <div key={index} className="border-2 border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Step {index + 1}</h5>
                      {formData.steps.length > 1 && (
                        <button type="button" onClick={() => removeStep(index)} className="text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={step.type}
                        onChange={(e) => updateStep(index, 'type', e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="task">Create Task</option>
                      </select>

                      <input
                        type="number"
                        min="0"
                        placeholder="Delay (days)"
                        value={step.delay_days}
                        onChange={(e) => updateStep(index, 'delay_days', parseInt(e.target.value))}
                        className="px-4 py-2 border rounded-lg"
                      />

                      <textarea
                        placeholder="Content or template ID"
                        value={step.content}
                        onChange={(e) => updateStep(index, 'content', e.target.value)}
                        className="col-span-2 px-4 py-2 border rounded-lg"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Create Sequence
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sequences */}
          <div>
            <h2 className="text-xl font-bold mb-4">Active Sequences</h2>
            <div className="space-y-4">
              {sequences.filter(s => s.is_active).map((sequence) => (
                <div key={sequence.id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-2">{sequence.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{sequence.description}</p>
                  <div className="text-sm text-slate-500">
                    {Array.isArray(sequence.steps) ? sequence.steps.length : 0} steps
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollments */}
          <div>
            <h2 className="text-xl font-bold mb-4">Active Enrollments ({enrollments.length})</h2>
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{enrollment.contact?.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Step {enrollment.current_step + 1}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {enrollment.sequence?.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
