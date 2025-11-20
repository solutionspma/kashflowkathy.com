import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadContacts()
  }, [filterStatus])

  const loadContacts = async () => {
    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading contacts:', error)
    } else {
      setContacts(data || [])
    }
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy-700">Contacts</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Add Contact
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card bg-white mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="card bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Stage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContacts.map((contact) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy-700">{contact.name}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{contact.email}</td>
                    <td className="px-4 py-3 text-slate-600">{contact.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{contact.company || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        contact.status === 'hot' ? 'bg-red-100 text-red-700' :
                        contact.status === 'warm' ? 'bg-orange-100 text-orange-700' :
                        contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        contact.status === 'converted' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{contact.pipeline_stage}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="text-navy-600 hover:text-navy-800">📧</button>
                        <button className="text-navy-600 hover:text-navy-800">📞</button>
                        <button className="text-navy-600 hover:text-navy-800">✏️</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
