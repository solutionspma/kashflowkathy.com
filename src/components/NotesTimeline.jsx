import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

const NOTE_DISPOSITIONS = [
  { value: 'call-inbound', label: '📞 Inbound Call', color: 'bg-blue-100 text-blue-800' },
  { value: 'call-outbound', label: '📱 Outbound Call', color: 'bg-green-100 text-green-800' },
  { value: 'email-sent', label: '📧 Email Sent', color: 'bg-purple-100 text-purple-800' },
  { value: 'email-received', label: '📬 Email Received', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'meeting', label: '🤝 Meeting', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'task', label: '✅ Task', color: 'bg-teal-100 text-teal-800' },
  { value: 'note', label: '📝 General Note', color: 'bg-slate-100 text-slate-800' },
  { value: 'proposal', label: '📄 Proposal Sent', color: 'bg-orange-100 text-orange-800' },
  { value: 'contract', label: '📑 Contract Signed', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'payment', label: '💰 Payment Received', color: 'bg-gold-100 text-gold-800' }
]

export default function NotesTimeline({ contactId, notes = [], onNoteAdded }) {
  const [showForm, setShowForm] = useState(false)
  const [newNote, setNewNote] = useState({
    disposition: 'note',
    content: ''
  })
  const [saving, setSaving] = useState(false)

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNote.content.trim()) return

    setSaving(true)
    try {
      const noteData = {
        contact_id: contactId,
        disposition: newNote.disposition,
        content: newNote.content,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('contact_notes')
        .insert([noteData])
        .select()

      if (error) throw error

      // Add to local notes array (non-destructive)
      if (onNoteAdded && data) {
        onNoteAdded(data[0])
      }

      // Reset form
      setNewNote({ disposition: 'note', content: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Error adding note')
    }
    setSaving(false)
  }

  const getDispositionInfo = (disposition) => {
    return NOTE_DISPOSITIONS.find(d => d.value === disposition) || NOTE_DISPOSITIONS[6]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-navy-900">Activity Timeline</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 text-sm"
        >
          + Add Note
        </button>
      </div>

      {/* Add Note Form */}
      {showForm && (
        <form onSubmit={handleAddNote} className="mb-6 p-4 bg-slate-50 rounded-lg border-2 border-navy-200">
          <label className="block text-sm font-medium mb-2">Disposition Type</label>
          <select
            value={newNote.disposition}
            onChange={(e) => setNewNote({ ...newNote, disposition: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg mb-3"
          >
            {NOTE_DISPOSITIONS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-2">Note Content *</label>
          <textarea
            required
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            placeholder="Add details about this interaction..."
            className="w-full px-3 py-2 border rounded-lg mb-3"
            rows="4"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-slate-300"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No notes yet. Click "Add Note" to create one.</p>
        ) : (
          notes.map((note, index) => {
            const dispositionInfo = getDispositionInfo(note.disposition)
            return (
              <div key={note.id || index} className="flex gap-4 relative">
                {/* Timeline line */}
                {index < notes.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-200"></div>
                )}

                {/* Disposition badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${dispositionInfo.color} flex items-center justify-center text-xl z-10`}>
                  {dispositionInfo.label.split(' ')[0]}
                </div>

                {/* Note content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${dispositionInfo.color}`}>
                      {dispositionInfo.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(note.created_at || new Date())}
                    </span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
                  {note.created_by && (
                    <p className="text-xs text-slate-500 mt-1">by {note.created_by}</p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
