import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Test data - will be replaced with DB data when available
const SAMPLE_CONTACTS = [
  {
    id: 1,
    name: 'Kathy Ferguson',
    email: 'kathy@kashflowkathy.com',
    phone: '(555) 123-4567',
    company: 'Kashflow Kathy Tax Services',
    status: 'active',
    tags: ['VIP', 'Tax Services'],
    notes: 'Primary business owner - specializes in R&D tax credits',
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Jason Harris',
    email: 'jason@pitchmarketingagency.com',
    phone: '(225) 418-8858',
    company: 'Pitch Marketing Agency',
    status: 'active',
    tags: ['Partner', 'Marketing'],
    notes: 'Marketing agency owner - collaboration on digital strategies',
    created_at: '2025-11-05T14:30:00Z'
  },
  {
    id: 3,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@techstartup.com',
    phone: '(555) 234-5678',
    company: 'Tech Startup Inc',
    status: 'lead',
    tags: ['R&D Credit', 'Startup'],
    notes: 'Tech startup founder - interested in R&D tax credit program',
    created_at: '2025-11-10T09:15:00Z'
  },
  {
    id: 4,
    name: 'Michael Chen',
    email: 'm.chen@manufacturingco.com',
    phone: '(555) 345-6789',
    company: 'Manufacturing Co LLC',
    status: 'active',
    tags: ['Manufacturing', 'Tax Planning'],
    notes: 'Manufacturing business - quarterly tax planning client',
    created_at: '2025-11-12T11:45:00Z'
  },
  {
    id: 5,
    name: 'Emily Rodriguez',
    email: 'emily.r@consultinggroup.com',
    phone: '(555) 456-7890',
    company: 'Consulting Group',
    status: 'inactive',
    tags: ['Consulting', 'Referral'],
    notes: 'Consulting firm - referred 3 clients last quarter',
    created_at: '2025-10-28T16:20:00Z'
  }
]

export default function Contacts() {
  const [user, setUser] = useState(null)
  const [contacts, setContacts] = useState(SAMPLE_CONTACTS)
  const [filteredContacts, setFilteredContacts] = useState(SAMPLE_CONTACTS)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    tags: '',
    notes: ''
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadContacts()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [searchQuery, statusFilter, contacts])

  const loadContacts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.log('Using sample data (database not connected yet)')
      } else if (data && data.length > 0) {
        setContacts(data)
      }
    } catch (error) {
      console.log('Using sample data')
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = [...contacts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.includes(query) ||
        (contact.company && contact.company.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    setFilteredContacts(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newContact = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('contacts')
        .insert([newContact])

      if (error) {
        // Add to local state if DB fails
        const localContact = { ...newContact, id: Date.now() }
        setContacts([localContact, ...contacts])
      } else {
        await loadContacts()
      }
      
      setShowForm(false)
      resetForm()
    } catch (error) {
      // Add to local state
      const localContact = { ...formData, id: Date.now(), created_at: new Date().toISOString() }
      setContacts([localContact, ...contacts])
      setShowForm(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
      tags: '',
      notes: ''
    })
  }

  const deleteContact = async (id) => {
    if (!confirm('Delete this contact?')) return

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error
      setContacts(contacts.filter(c => c.id !== id))
    } catch (error) {
      setContacts(contacts.filter(c => c.id !== id))
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      lead: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors.new
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold">👥 Contacts</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 font-semibold"
              >
                + Add Contact
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
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <div className="text-slate-600">Total Contacts</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">🟢</div>
            <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'active').length}</div>
            <div className="text-slate-600">Active</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'lead').length}</div>
            <div className="text-slate-600">Leads</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold">
              {new Date(contacts[0]?.created_at || new Date()).toLocaleDateString()}
            </div>
            <div className="text-slate-600">Last Added</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">🔍 Search Contacts</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-navy-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-navy-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 text-sm text-slate-600">
              Found {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Add Contact Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="new">New</option>
                    <option value="lead">Lead</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="VIP, Tax Services"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Additional notes about this contact..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 font-semibold"
                >
                  Save Contact
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold border-r border-navy-700">Name</th>
                  <th className="px-6 py-4 text-left font-semibold border-r border-navy-700">Contact Info</th>
                  <th className="px-6 py-4 text-left font-semibold border-r border-navy-700">Company</th>
                  <th className="px-6 py-4 text-left font-semibold border-r border-navy-700">Status</th>
                  <th className="px-6 py-4 text-left font-semibold border-r border-navy-700">Tags</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 border-r border-slate-200">
                      <div className="font-semibold text-navy-900">{contact.name}</div>
                      <div className="text-xs text-slate-500">
                        Added {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-500">📧</span>
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">📱</span>
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200">
                      <div className="font-medium">{contact.company || '-'}</div>
                      {contact.notes && (
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {contact.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                        {contact.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags && contact.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gold-100 text-gold-800 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link href={`/crm/contacts/${contact.id}`} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 inline-block">
                          View
                        </Link>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No contacts found</h3>
              <p className="text-slate-600">
                {searchQuery ? 'Try adjusting your search' : 'Add your first contact to get started'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
