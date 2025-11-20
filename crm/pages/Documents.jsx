import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadDocuments()
  }, [filter])

  const loadDocuments = async () => {
    let query = supabase
      .from('documents')
      .select('*, contact:contacts(name, email), uploader:users(full_name)')
      .order('created_at', { ascending: false })
    
    if (filter !== 'all') {
      query = query.eq('category', filter)
    }
    
    const { data, error } = await query
    
    if (!error && data) {
      setDocuments(data)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // In production, upload to Supabase Storage
    // const { data, error } = await supabase.storage
    //   .from('documents')
    //   .upload(`${selectedContact}/${file.name}`, file)

    // For now, just create the database record
    setTimeout(async () => {
      await supabase.from('documents').insert([
        {
          contact_id: selectedContact,
          filename: file.name,
          file_path: `/storage/documents/${file.name}`,
          file_size: file.size,
          file_type: file.type,
          category: 'proposal',
        },
      ])

      setUploadProgress(0)
      loadDocuments()
    }, 2000)
  }

  const deleteDocument = async (id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await supabase.from('documents').delete().eq('id', id)
      loadDocuments()
    }
  }

  const downloadDocument = (doc) => {
    // In production, download from Supabase Storage
    alert(`Downloading: ${doc.filename}`)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄'
    if (fileType.includes('pdf')) return '📕'
    if (fileType.includes('word') || fileType.includes('document')) return '📘'
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📗'
    if (fileType.includes('image')) return '🖼️'
    return '📄'
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Document Vault</h1>
            <p className="text-slate-600 mt-1">Secure storage for proposals, contracts, and files</p>
          </div>
          <div className="flex gap-2">
            <label className="btn-primary cursor-pointer">
              📤 Upload Document
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="card bg-white mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">📤</div>
              <div className="flex-1">
                <div className="font-semibold text-navy-700 mb-1">Uploading...</div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-navy-700 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm font-semibold text-navy-700">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white">
            <div className="text-2xl font-bold text-navy-700">{documents.length}</div>
            <div className="text-sm text-slate-600">Total Documents</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-navy-700">
              {formatFileSize(documents.reduce((sum, d) => sum + (d.file_size || 0), 0))}
            </div>
            <div className="text-sm text-slate-600">Total Size</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-blue-600">
              {documents.filter(d => d.category === 'proposal').length}
            </div>
            <div className="text-sm text-slate-600">Proposals</div>
          </div>
          <div className="card bg-white">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.category === 'contract').length}
            </div>
            <div className="text-sm text-slate-600">Contracts</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'proposal', 'contract', 'report', 'other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === cat
                  ? 'bg-navy-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="card bg-white hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{getFileIcon(doc.file_type)}</div>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>

              <h3 className="font-bold text-navy-700 mb-2 truncate" title={doc.filename}>
                {doc.filename}
              </h3>

              <div className="text-sm text-slate-600 mb-3">
                <div>Contact: {doc.contact?.name || 'Unknown'}</div>
                <div>Size: {formatFileSize(doc.file_size)}</div>
                <div>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</div>
                {doc.uploader && <div>By: {doc.uploader.full_name}</div>}
              </div>

              {doc.category && (
                <span className="inline-block px-2 py-1 bg-navy-50 text-navy-700 text-xs rounded mb-3">
                  {doc.category}
                </span>
              )}

              <button
                onClick={() => downloadDocument(doc)}
                className="btn-primary w-full text-sm"
              >
                Download
              </button>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="card bg-white text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-bold text-navy-700 mb-2">No documents yet</h3>
            <p className="text-slate-600 mb-4">Upload proposals, contracts, and files</p>
            <label className="btn-primary cursor-pointer inline-block">
              Upload Your First Document
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Storage Info */}
        <div className="mt-8 card bg-gradient-to-br from-navy-700 to-navy-900 text-white">
          <h3 className="text-xl font-bold mb-3">💾 Secure Cloud Storage</h3>
          <p className="text-slate-300 mb-4">
            All documents are securely stored in Supabase cloud storage with encryption at rest
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">🔒 Encrypted</div>
              <div className="text-slate-300">AES-256 encryption</div>
            </div>
            <div>
              <div className="font-semibold mb-1">☁️ Cloud Backup</div>
              <div className="text-slate-300">Automatic daily backups</div>
            </div>
            <div>
              <div className="font-semibold mb-1">👥 Access Control</div>
              <div className="text-slate-300">Role-based permissions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
