import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function CMSPages() {
  const [user, setUser] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    requireAuth()
    const userData = getUser()
    if (userData && (userData.role === 'admin' || userData.role === 'masteracct')) {
      setUser(userData)
      loadPages()
    } else {
      window.location.href = '/crm/dashboard'
    }
  }, [])

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('slug')

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  }

  const savePage = async () => {
    if (!selectedPage) return
    
    try {
      const { error } = await supabase
        .from('cms_pages')
        .update({ 
          content: { html: content },
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPage.id)

      if (error) throw error
      alert('Page saved successfully!')
      loadPages()
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/cms/editor" className="text-gold-400 hover:text-gold-300">← CMS</Link>
              <h1 className="text-2xl font-bold">Manage Pages</h1>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Pages List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Pages</h3>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setSelectedPage(page)
                    setContent(page.content?.html || '')
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedPage?.id === page.id 
                      ? 'bg-navy-900 text-white' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {page.slug}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
            {selectedPage ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Editing: {selectedPage.slug}</h3>
                  <button
                    onClick={savePage}
                    className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800"
                  >
                    Save Changes
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 px-4 py-2 border rounded-lg font-mono text-sm"
                  placeholder="Enter HTML content..."
                />
              </>
            ) : (
              <div className="text-center text-slate-400 py-12">
                Select a page to edit
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
