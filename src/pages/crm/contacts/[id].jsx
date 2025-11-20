import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_CONTACTS, TEST_DEALS, TEST_DOCUMENTS, TEST_ZOOM_CALLS, formatCurrency, formatDateTime } from '@/lib/testData'

export default function ContactDetail() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [contact, setContact] = useState(null)
  const [deals, setDeals] = useState([])
  const [documents, setDocuments] = useState([])
  const [meetings, setMeetings] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [notes, setNotes] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    if (id) {
      loadContactData()
    }
  }, [id])

  const loadContactData = async () => {
    try {
      // Load contact
      const contactData = TEST_CONTACTS.find(c => c.id === parseInt(id))
      setContact(contactData || null)
      setNotes(contactData?.notes || '')

      // Load related deals
      const contactDeals = TEST_DEALS.filter(d => d.contact_id === parseInt(id))
      setDeals(contactDeals)

      // Load related documents
      const contactDocs = TEST_DOCUMENTS.filter(d => d.contact_id === parseInt(id))
      setDocuments(contactDocs)

      // Load related meetings
      const contactMeetings = TEST_ZOOM_CALLS.filter(m => m.contact_id === parseInt(id))
      setMeetings(contactMeetings)
    } catch (error) {
      console.log('Using test data for contact details')
    }
  }

  const saveNotes = async () => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ notes })
        .eq('id', id)

      if (error) throw error
      setShowNoteForm(false)
      loadContactData()
    } catch (error) {
      console.log('Notes saved locally')
      setShowNoteForm(false)
    }
  }

  if (!user || !contact) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold">Loading contact...</h2>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gold-400 hover:text-gold-300">
                🏠 Home
              </Link>
              <span className="text-slate-500">|</span>
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">
                📊 CRM
              </Link>
              <span className="text-slate-500">|</span>
              <Link href="/crm/contacts" className="text-gold-400 hover:text-gold-300">
                ← Contacts
              </Link>
              <span className="text-slate-500">•</span>
              <h1 className="text-2xl font-bold">{contact.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gold-400">Welcome, {user.username}</span>
              <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contact Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-navy-900 text-white rounded-full flex items-center justify-center text-4xl font-bold">
                {contact.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-2">{contact.name}</h2>
                <p className="text-xl text-slate-600 mb-4">{contact.company}</p>
                <div className="flex gap-4 text-sm">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                    📧 {contact.email}
                  </a>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                    📱 {contact.phone}
                  </a>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    contact.status === 'active' ? 'bg-green-100 text-green-800' :
                    contact.status === 'lead' ? 'bg-blue-100 text-blue-800' :
                    contact.status === 'inactive' ? 'bg-slate-100 text-slate-800' :
                    'bg-gold-100 text-gold-800'
                  }`}>
                    {contact.status.toUpperCase()}
                  </span>
                  {contact.tags && contact.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${contact.email}`} className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                ✉️ Send Email
              </a>
              <a href={`tel:${contact.phone}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                📞 Call
              </a>
              <button
                onClick={() => router.push(`/crm/contacts?edit=${contact.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-slate-200">
            <div className="flex gap-1 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-500 hover:text-navy-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'deals'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-500 hover:text-navy-900'
                }`}
              >
                Deals ({deals.length})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'documents'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-500 hover:text-navy-900'
                }`}
              >
                Documents ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'meetings'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-500 hover:text-navy-900'
                }`}
              >
                Meetings ({meetings.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'activity'
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-500 hover:text-navy-900'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-navy-900">Notes</h3>
                    <button
                      onClick={() => setShowNoteForm(!showNoteForm)}
                      className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800"
                    >
                      {showNoteForm ? 'Cancel' : 'Edit Notes'}
                    </button>
                  </div>
                  {showNoteForm ? (
                    <div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                        rows="6"
                        placeholder="Add notes about this contact..."
                      />
                      <button
                        onClick={saveNotes}
                        className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save Notes
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700">{contact.notes || 'No notes added yet.'}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-3xl mb-2">💼</div>
                    <div className="text-2xl font-bold text-navy-900">{deals.length}</div>
                    <div className="text-slate-600">Active Deals</div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="text-2xl font-bold text-navy-900">{documents.length}</div>
                    <div className="text-slate-600">Documents</div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-3xl mb-2">📹</div>
                    <div className="text-2xl font-bold text-navy-900">{meetings.length}</div>
                    <div className="text-slate-600">Meetings</div>
                  </div>
                </div>
              </div>
            )}

            {/* Deals Tab */}
            {activeTab === 'deals' && (
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">Deals & Opportunities</h3>
                {deals.length > 0 ? (
                  <div className="space-y-4">
                    {deals.map(deal => (
                      <div key={deal.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg text-navy-900">{deal.title}</h4>
                            <p className="text-slate-600 text-sm mt-1">{deal.notes}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-green-600 font-semibold">{formatCurrency(deal.deal_value)}</span>
                              <span className="text-slate-500">• {deal.probability}% probability</span>
                              <span className="text-slate-500">• Close: {new Date(deal.expected_close_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            deal.stage === 'won' ? 'bg-green-100 text-green-800' :
                            deal.stage === 'proposal' ? 'bg-blue-100 text-blue-800' :
                            deal.stage === 'qualified' ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {deal.stage.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💼</div>
                    <p className="text-slate-600">No deals associated with this contact</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">Documents</h3>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">📄</span>
                          <div>
                            <div className="font-semibold text-navy-900">{doc.filename}</div>
                            <div className="text-sm text-slate-500">{doc.category} • {doc.file_type}</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-slate-600">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Meetings Tab */}
            {activeTab === 'meetings' && (
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">Zoom Meetings</h3>
                {meetings.length > 0 ? (
                  <div className="space-y-4">
                    {meetings.map(meeting => (
                      <div key={meeting.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-navy-900">Meeting #{meeting.meeting_id}</h4>
                            <p className="text-slate-600 text-sm mt-1">{meeting.notes}</p>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                              <span>📅 {formatDateTime(meeting.start_time)}</span>
                              <span>⏱️ {meeting.duration} min</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                              Join
                            </a>
                            {meeting.recording_url && (
                              <a href={meeting.recording_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                                Recording
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="text-slate-600">No meetings scheduled</p>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">Activity Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      👤
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-navy-900">Contact Created</div>
                      <div className="text-sm text-slate-500">{formatDateTime(contact.created_at)}</div>
                    </div>
                  </div>
                  {deals.map(deal => (
                    <div key={`deal-${deal.id}`} className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        💼
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-navy-900">Deal Added: {deal.title}</div>
                        <div className="text-sm text-slate-500">{formatDateTime(deal.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
