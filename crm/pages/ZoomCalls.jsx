import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ZoomCalls() {
  const [calls, setCalls] = useState([])
  const [filter, setFilter] = useState('all') // all, upcoming, completed

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = async () => {
    const { data, error } = await supabase
      .from('zoom_logs')
      .select('*, contact:contacts(name, email, phone)')
      .order('start_time', { ascending: false })
    
    if (!error && data) {
      setCalls(data)
    }
  }

  const openZoomMeeting = (url) => {
    window.open(url, '_blank')
  }

  const scheduleMeeting = () => {
    // Deep link to Zoom app
    window.open('zoommtg://zoom.us/join', '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Zoom Meetings</h1>
            <p className="text-slate-600 mt-1">Schedule and manage video calls</p>
          </div>
          <button
            onClick={scheduleMeeting}
            className="btn-primary"
          >
            📹 Schedule Meeting
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white">
            <div className="text-2xl font-bold text-navy-700">{calls.length}</div>
            <div className="text-sm text-slate-600">Total Meetings</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-green-600">
              {calls.filter(c => c.start_time && new Date(c.start_time) < new Date()).length}
            </div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-blue-600">
              {calls.filter(c => c.recording_url).length}
            </div>
            <div className="text-sm text-slate-600">Recorded</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-navy-700">
              {calls.reduce((sum, c) => sum + (c.duration || 0), 0)} min
            </div>
            <div className="text-sm text-slate-600">Total Duration</div>
          </div>
        </div>

        {/* Meeting List */}
        <div className="space-y-4">
          {calls.map((call) => (
            <div key={call.id} className="card bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-navy-700">
                      {call.contact?.name || 'Unknown Contact'}
                    </h3>
                    {call.recording_url && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-semibold">
                        🔴 Recorded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                    <div>
                      📧 {call.contact?.email || 'No email'}
                    </div>
                    <div>
                      📱 {call.contact?.phone || 'No phone'}
                    </div>
                    {call.duration && (
                      <div>
                        ⏱️ {call.duration} minutes
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-slate-700">
                      <span className="font-semibold">Start:</span>{' '}
                      {call.start_time 
                        ? new Date(call.start_time).toLocaleString()
                        : 'Not scheduled'
                      }
                    </div>
                    {call.participants && (
                      <div className="text-slate-700">
                        <span className="font-semibold">Participants:</span>{' '}
                        {JSON.parse(call.participants).length || 0}
                      </div>
                    )}
                  </div>

                  {call.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                      <div className="font-semibold mb-1">Notes:</div>
                      {call.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {call.meeting_url && (
                    <button
                      onClick={() => openZoomMeeting(call.meeting_url)}
                      className="btn-primary text-sm"
                    >
                      Join Meeting
                    </button>
                  )}
                  {call.recording_url && (
                    <button
                      onClick={() => window.open(call.recording_url, '_blank')}
                      className="btn-outline text-sm"
                    >
                      View Recording
                    </button>
                  )}
                  <button className="btn-outline text-sm">Edit</button>
                </div>
              </div>
            </div>
          ))}

          {calls.length === 0 && (
            <div className="card bg-white text-center py-12">
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-xl font-bold text-navy-700 mb-2">No meetings yet</h3>
              <p className="text-slate-600 mb-4">Schedule your first Zoom meeting</p>
              <button onClick={scheduleMeeting} className="btn-primary">
                Schedule Meeting
              </button>
            </div>
          )}
        </div>

        {/* Integration Info */}
        <div className="mt-8 card bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">🎥 Zoom Integration</h3>
              <p className="text-blue-100 mb-4">
                Schedule meetings directly from the CRM and automatically log call details
              </p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>✓ One-click meeting scheduling</li>
                <li>✓ Automatic call logging</li>
                <li>✓ Recording storage and playback</li>
                <li>✓ Contact integration</li>
              </ul>
            </div>
            <div className="text-6xl">📹</div>
          </div>
        </div>
      </div>
    </div>
  )
}
