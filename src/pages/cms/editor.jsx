import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import Link from 'next/link'

// Map of all existing pages in the site
const SITE_PAGES = {
  'Marketing Pages': [
    { path: '/', name: 'Homepage (Landing)', description: 'Hero section, about, services preview, contact form' },
    { path: '/about', name: 'About Kathy', description: 'Full bio, credentials, testimonials' },
    { path: '/services', name: 'Services Overview', description: 'Cost seg, R&D credit, tax planning' },
    { path: '/calculator', name: 'Cost Seg Calculator', description: 'Interactive savings estimator' },
    { path: '/rd-credit', name: 'R&D Tax Credit', description: 'R&D credit information page' },
    { path: '/schedule', name: 'Schedule Consultation', description: 'Calendly booking integration' },
    { path: '/content', name: 'Content Hub', description: 'Resources and educational content' },
    { path: '/partnerships', name: 'Partnerships', description: 'Partner program information' },
    { path: '/referrals', name: 'Referral Program', description: 'Referral rewards info' },
    { path: '/app-download', name: 'Mobile App', description: 'App download page' },
  ],
  'CRM System': [
    { path: '/crm/dashboard', name: 'CRM Dashboard', description: 'Stats, quick actions, overview' },
    { path: '/crm/contacts', name: 'Contacts', description: 'Contact management with search/filters' },
    { path: '/crm/contacts/[id]', name: 'Contact Detail', description: 'Individual contact profile' },
    { path: '/crm/pipeline', name: 'Pipeline', description: 'Drag-drop deal stages' },
    { path: '/crm/automations', name: 'Automations', description: 'Workflow automation rules' },
    { path: '/crm/templates', name: 'Email/SMS Templates', description: 'Message templates library' },
    { path: '/crm/sequences', name: 'Sequences', description: 'Multi-step drip campaigns' },
    { path: '/crm/social-media', name: 'Social Media Scheduler', description: 'Post scheduling' },
    { path: '/crm/zoom-calls', name: 'Zoom Meetings', description: 'Meeting scheduler and recordings' },
    { path: '/crm/documents', name: 'Document Manager', description: 'File uploads and organization' },
    { path: '/crm/referrals', name: 'Referral Tracking', description: 'Referral sources' },
    { path: '/crm/commissions', name: 'Commission Management', description: 'Commission calculations' },
    { path: '/crm/analytics', name: 'Analytics & Reports', description: 'KPIs and metrics' },
    { path: '/crm/settings', name: 'CRM Settings', description: 'System configuration' },
  ],
  'CMS Admin': [
    { path: '/cms/pages', name: 'Page Builder', description: 'Create/edit custom pages' },
    { path: '/cms/editor', name: 'Visual Editor', description: 'Site structure overview' },
  ],
  'Authentication': [
    { path: '/login', name: 'Login Page', description: 'User authentication' },
  ]
}

export default function CMSEditor() {
  const [user, setUser] = useState(null)
  const [selectedPage, setSelectedPage] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({
    'Marketing Pages': true,
    'CRM System': false,
    'CMS Admin': false,
    'Authentication': false
  })

  useEffect(() => {
    requireAuth()
    const currentUser = getUser()
    setUser(currentUser)
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'masteracct') {
      alert('Access denied - Admin only')
      window.location.href = '/crm/dashboard'
    }
  }, [])

  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-navy-900 text-white shadow-lg sticky top-0 z-50">
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
              <h1 className="text-2xl font-bold">📝 CMS Visual Editor</h1>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-2">📚 Site Structure Overview</h2>
          <p className="text-blue-800">
            Visual map of your entire website. {Object.values(SITE_PAGES).flat().length} pages across {Object.keys(SITE_PAGES).length} categories.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* File Tree Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-navy-900 mb-4">🗂️ Page Directory</h3>
              <div className="space-y-2">
                {Object.entries(SITE_PAGES).map(([category, pages]) => (
                  <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold text-navy-900"
                    >
                      <span>{category} ({pages.length})</span>
                      <span>{expandedCategories[category] ? '▼' : '▶'}</span>
                    </button>
                    {expandedCategories[category] && (
                      <div className="border-t border-slate-200">
                        {pages.map((page, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPage(page)}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-slate-100 last:border-b-0 ${
                              selectedPage?.path === page.path ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                            }`}
                          >
                            <div className="text-sm font-medium text-navy-900">{page.name}</div>
                            <div className="text-xs text-slate-500">{page.path}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Page Details Canvas */}
          <div className="lg:col-span-2">
            {selectedPage ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-navy-900 mb-2">{selectedPage.name}</h2>
                <div className="font-mono bg-slate-100 px-3 py-1 rounded inline-block mb-4">{selectedPage.path}</div>
                <p className="text-slate-700 mb-6">{selectedPage.description}</p>

                <div className="grid gap-4">
                  <a
                    href={selectedPage.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center font-semibold"
                  >
                    👁️ Preview Live Page
                  </a>
                  <Link
                    href="/cms/pages"
                    className="px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 text-center font-semibold block"
                  >
                    📝 Edit in Page Builder
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Select a Page</h3>
                <p className="text-slate-600">Choose from the directory on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
