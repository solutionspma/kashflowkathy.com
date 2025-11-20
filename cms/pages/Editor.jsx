import React, { useState } from 'react'

export default function CMSEditor() {
  const [activeTab, setActiveTab] = useState('pages')
  const [selectedPage, setSelectedPage] = useState(null)

  const pages = [
    { id: 1, name: 'Home Page', slug: '/', lastEdited: '2 hours ago' },
    { id: 2, name: 'About Page', slug: '/about', lastEdited: '1 day ago' },
    { id: 3, name: 'Services', slug: '/services', lastEdited: '3 days ago' },
    { id: 4, name: 'Contact', slug: '/contact', lastEdited: '1 week ago' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 p-4">
          <h2 className="text-2xl font-bold text-navy-700 mb-6">CMS Editor</h2>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('pages')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'pages'
                  ? 'bg-navy-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              📄 Pages
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'media'
                  ? 'bg-navy-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              🖼️ Media
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'branding'
                  ? 'bg-navy-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              🎨 Branding
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'settings'
                  ? 'bg-navy-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-navy-700 mb-8">
              {activeTab === 'pages' && 'Page Editor'}
              {activeTab === 'media' && 'Media Library'}
              {activeTab === 'branding' && 'Branding Settings'}
              {activeTab === 'settings' && 'Site Settings'}
            </h1>

            {activeTab === 'pages' && (
              <div className="grid md:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className="card bg-white cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-navy-700 mb-2">{page.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{page.slug}</p>
                    <p className="text-xs text-slate-500">Last edited: {page.lastEdited}</p>
                    <button className="btn-primary mt-4 w-full">Edit Page</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="card bg-white">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-bold text-navy-700 mb-2">Upload Media</h3>
                  <p className="text-slate-600 mb-4">Drag and drop files here or click to browse</p>
                  <button className="btn-primary">Choose Files</button>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="card bg-white max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input type="color" value="#002d69" className="h-10 w-20" />
                      <span className="text-slate-600">#002d69 (Navy)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input type="color" value="#f5d787" className="h-10 w-20" />
                      <span className="text-slate-600">#f5d787 (Gold)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Logo
                    </label>
                    <button className="btn-outline">Upload Logo</button>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Favicon
                    </label>
                    <button className="btn-outline">Upload Favicon</button>
                  </div>
                  <button className="btn-primary w-full">Save Branding</button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card bg-white max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Kashflow Kathy"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="kathy@costseg.tax"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="(225) 247-2890"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      className="input-field resize-none"
                      rows={4}
                      defaultValue="Expert cost segregation and R&D tax credit services"
                    />
                  </div>
                  <button className="btn-primary w-full">Save Settings</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
