import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_DOCUMENTS, TEST_CONTACTS, formatFileSize, formatDate } from '@/lib/testData'
import { 
  generateSamplePDF, 
  generateCostSegReport, 
  generateProposal,
  downloadDocument,
  generateSampleSpreadsheet,
  downloadSpreadsheet
} from '@/lib/documentGenerator'

export default function Documents() {
  const [user, setUser] = useState(null)
  const [documents, setDocuments] = useState(TEST_DOCUMENTS)
  const [contacts, setContacts] = useState(TEST_CONTACTS)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState({
    contact_id: '',
    filename: '',
    file_path: '',
    file_size: 0,
    file_type: '',
    category: 'contract'
  })

  const handleDownload = (document) => {
    const today = new Date().toISOString().split('T')[0]
    
    if (document.filename.endsWith('.pdf')) {
      let pdfDoc
      
      // Generate specific PDF based on document type
      if (document.filename.includes('Cost_Seg')) {
        pdfDoc = generateCostSegReport({
          propertyType: 'Commercial Building',
          propertyCost: 1250000,
          acceleratedDep: 425000,
          bonusDep: 187000,
          taxSavings: 125000
        })
      } else if (document.filename.includes('Proposal')) {
        pdfDoc = generateProposal('Sample Client', 'Cost Segregation Study', 8500)
      } else if (document.filename.includes('Contract')) {
        pdfDoc = generateSamplePDF('Service Agreement', `
PROFESSIONAL SERVICES AGREEMENT

This agreement is entered into on ${today} between Kashflow Kathy Tax Services
and the Client for professional tax consulting services.

SCOPE OF WORK:
The consultant agrees to provide cost segregation analysis, tax planning,
and related professional services as outlined in the attached proposal.

FEES AND PAYMENT:
Fees are as specified in the proposal. Payment terms: 50% upfront,
50% upon delivery of final report.

CONFIDENTIALITY:
All client information will be kept strictly confidential.

Both parties agree to the terms outlined in this agreement.
        `)
      } else {
        pdfDoc = generateSamplePDF(document.filename.replace('.pdf', ''))
      }
      
      downloadDocument(pdfDoc, `${today}_${document.filename}`)
      
    } else if (document.filename.endsWith('.xlsx')) {
      // Generate spreadsheet
      const csv = generateSampleSpreadsheet(
        document.filename.replace('.xlsx', ''),
        {
          headers: ['Property', 'Purchase Date', 'Cost Basis', 'Accelerated Dep', 'Tax Savings'],
          rows: [
            ['Office Building', '2024-01-15', '$1,250,000', '$425,000', '$125,000'],
            ['Retail Space', '2024-03-22', '$850,000', '$315,000', '$89,000'],
            ['Warehouse', '2024-06-10', '$2,100,000', '$780,000', '$235,000']
          ]
        }
      )
      downloadSpreadsheet(csv, `${today}_${document.filename.replace('.xlsx', '.csv')}`)
      
    } else if (document.filename.endsWith('.docx')) {
      // Generate Word document as text file (basic fallback)
      const content = `
KASHFLOW KATHY TAX SERVICES
${today}

${document.filename.replace('.docx', '')}

This is a sample document generated for demonstration purposes.

For actual client documents, this would contain detailed analysis,
recommendations, and professionally formatted content.

Thank you for using Kashflow Kathy Tax Services!
      `
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${today}_${document.filename.replace('.docx', '.txt')}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadDocuments()
    loadContacts()
  }, [])

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          contact:contacts(name, email, company)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
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
        .from('documents')
        .insert([{
          ...formData,
          uploaded_by: user.username
        }])

      if (error) throw error

      setShowForm(false)
      setFormData({
        contact_id: '',
        filename: '',
        file_path: '',
        file_size: 0,
        file_type: '',
        category: 'contract'
      })
      loadDocuments()
    } catch (error) {
      console.error('Error creating document:', error)
      alert('Error uploading document')
    }
  }

  if (!user) return null

  const totalSize = documents.reduce((sum, d) => sum + (parseInt(d.file_size) || 0), 0)
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const byCategory = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Documents</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + Upload Document
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
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold">{documents.length}</div>
            <div className="text-slate-600">Total Documents</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold">{byCategory.contract || 0}</div>
            <div className="text-slate-600">Contracts</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{byCategory.report || 0}</div>
            <div className="text-slate-600">Reports</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">💾</div>
            <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
            <div className="text-slate-600">Storage Used</div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Upload Document</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <select
                value={formData.contact_id}
                onChange={(e) => setFormData({...formData, contact_id: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Select Contact (Optional)</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
                ))}
              </select>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="contract">Contract</option>
                <option value="report">Report</option>
                <option value="proposal">Proposal</option>
                <option value="invoice">Invoice</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Filename *"
                required
                value={formData.filename}
                onChange={(e) => setFormData({...formData, filename: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="File Path/URL *"
                required
                value={formData.file_path}
                onChange={(e) => setFormData({...formData, file_path: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="File Size (bytes)"
                value={formData.file_size}
                onChange={(e) => setFormData({...formData, file_size: parseInt(e.target.value) || 0})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="File Type (e.g., pdf, docx)"
                value={formData.file_type}
                onChange={(e) => setFormData({...formData, file_type: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2 col-span-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Upload Document
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Filename</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Uploaded</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{doc.filename}</td>
                  <td className="px-6 py-4">
                    {doc.contact ? (
                      <div>
                        <div className="font-medium">{doc.contact.name}</div>
                        <div className="text-sm text-slate-600">{doc.contact.company}</div>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doc.category === 'contract' ? 'bg-blue-100 text-blue-800' :
                      doc.category === 'report' ? 'bg-green-100 text-green-800' :
                      doc.category === 'proposal' ? 'bg-purple-100 text-purple-800' :
                      doc.category === 'invoice' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 uppercase text-sm">{doc.file_type || '-'}</td>
                  <td className="px-6 py-4">{formatSize(doc.file_size || 0)}</td>
                  <td className="px-6 py-4 text-sm">{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
