import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Sequences() {
  const [sequences, setSequences] = useState([])
  const [showNewModal, setShowNewModal] = useState(false)

  useEffect(() => {
    loadSequences()
  }, [])

  const loadSequences = async () => {
    const { data, error } = await supabase
      .from('sequences')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setSequences(data)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Sequences</h1>
            <p className="text-slate-600 mt-1">Multi-step email and SMS campaigns</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary"
          >
            + New Sequence
          </button>
        </div>

        {/* Active Sequences */}
        <div className="grid gap-4">
          {sequences.map((sequence) => (
            <div key={sequence.id} className="card bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-navy-700">{sequence.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sequence.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sequence.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{sequence.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline text-sm">Edit</button>
                  <button className="btn-primary text-sm">Enroll Contacts</button>
                </div>
              </div>

              {/* Sequence Steps */}
              {sequence.steps && (
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200"></div>
                  {sequence.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 mb-4 relative">
                      <div className="w-12 h-12 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold z-10">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-navy-700">
                            {step.type === 'email' ? '📧 Email' : '💬 SMS'}
                          </span>
                          {step.delay && (
                            <span className="text-xs text-slate-500">
                              (Wait {step.delay} days)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-700">{step.subject || step.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {sequences.length === 0 && (
            <div className="card bg-white text-center py-12">
              <div className="text-6xl mb-4">📬</div>
              <h3 className="text-xl font-bold text-navy-700 mb-2">No sequences yet</h3>
              <p className="text-slate-600 mb-4">Create multi-step campaigns to nurture leads</p>
              <button onClick={() => setShowNewModal(true)} className="btn-primary">
                Create Sequence
              </button>
            </div>
          )}
        </div>

        {/* Popular Templates */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy-700 mb-4">Popular Sequence Templates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-white border-2 border-navy-100 hover:border-navy-300 cursor-pointer transition-all">
              <h4 className="font-bold text-navy-700 mb-3">🎯 New Lead Nurture (5 days)</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• Day 0: Welcome email with company intro</div>
                <div>• Day 1: SMS check-in</div>
                <div>• Day 3: Educational email about cost segregation</div>
                <div>• Day 5: Call-to-action to schedule consultation</div>
              </div>
              <button className="mt-4 text-navy-600 font-semibold text-sm hover:text-navy-700">
                Use Template →
              </button>
            </div>

            <div className="card bg-white border-2 border-navy-100 hover:border-navy-300 cursor-pointer transition-all">
              <h4 className="font-bold text-navy-700 mb-3">🔥 Hot Lead Follow-up (3 days)</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• Day 0: Thank you email with next steps</div>
                <div>• Day 1: SMS reminder about consultation</div>
                <div>• Day 3: Final follow-up with case study</div>
              </div>
              <button className="mt-4 text-navy-600 font-semibold text-sm hover:text-navy-700">
                Use Template →
              </button>
            </div>
          </div>
        </div>

        {/* Enrollment Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="card bg-white">
            <div className="text-2xl font-bold text-navy-700">47</div>
            <div className="text-sm text-slate-600">Active Enrollments</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-gold-600">12</div>
            <div className="text-sm text-slate-600">Paused</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-navy-700">68%</div>
            <div className="text-sm text-slate-600">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
