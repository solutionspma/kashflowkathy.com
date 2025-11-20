import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import WebflowEditor from '@/components/WebflowEditor'

export default function CMSPagesNew() {
  const [user, setUser] = useState(null)
  const [pages, setPages] = useState([])
  const [editingPage, setEditingPage] = useState(null)
  const [activeTab, setActiveTab] = useState('edit') // edit, preview, meta
  const [showPreview, setShowPreview] = useState(false)
  const [useVisualEditor, setUseVisualEditor] = useState(false)

  useEffect(() => {
    requireAuth()
    const currentUser = getUser()
    setUser(currentUser)
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'masteracct') {
      alert('Access denied')
      window.location.href = '/crm/dashboard'
    }
    
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  }

  const savePage = async (pageData) => {
    try {
      const now = new Date().toISOString()
      const dataToSave = {
        slug: pageData.slug,
        content: { 
          html: pageData.content,
          title: pageData.title,
          meta_title: pageData.meta_title,
          meta_description: pageData.meta_description,
          featured_image: pageData.featured_image
        },
        updated_at: now
      }
      
      if (!pageData.id) {
        // New page - insert
        const { error } = await supabase
          .from('cms_pages')
          .insert([dataToSave])
        if (error) throw error
      } else {
        // Existing page - update
        const { error} = await supabase
          .from('cms_pages')
          .update(dataToSave)
          .eq('id', pageData.id)
        if (error) throw error
      }
      
      alert('Page saved successfully!')
      setEditingPage(null)
      loadPages()
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page: ' + error.message)
    }
  }

  const deletePage = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page')
    }
  }

  // Rich text toolbar actions
  const insertFormatting = (format) => {
    const formats = {
      h1: { before: '<h1 class="text-4xl font-bold mb-4">', after: '</h1>' },
      h2: { before: '<h2 class="text-3xl font-bold mb-3">', after: '</h2>' },
      h3: { before: '<h3 class="text-2xl font-bold mb-2">', after: '</h3>' },
      p: { before: '<p class="mb-4">', after: '</p>' },
      bold: { before: '<strong>', after: '</strong>' },
      italic: { before: '<em>', after: '</em>' },
      link: { before: '<a href="URL" class="text-gold-500 hover:text-gold-400 underline">', after: '</a>' },
      button: { before: '<a href="URL" class="inline-block px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 font-semibold">', after: '</a>' },
      list: { before: '<ul class="list-disc pl-6 mb-4">\n  <li>', after: '</li>\n</ul>' },
      image: { before: '<img src="URL" alt="Description" class="w-full max-w-2xl rounded-lg mb-4" />', after: '' },
      section: { before: '<section class="py-16">\n  <div class="max-w-6xl mx-auto px-4">\n    ', after: '\n  </div>\n</section>' },
      grid: { before: '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">\n  ', after: '\n</div>' },
      card: { before: '<div class="bg-white rounded-xl shadow-lg p-6">\n  ', after: '\n</div>' },
      container: { before: '<div class="max-w-6xl mx-auto px-4">\n  ', after: '\n</div>' },
    }
    
    const format_data = formats[format]
    if (format_data) {
      setEditingPage({
        ...editingPage,
        content: (editingPage.content || '') + '\n\n' + format_data.before + format_data.after
      })
    }
  }

  const createNewPage = () => {
    setEditingPage({ 
      title: '', 
      slug: '', 
      content: '', 
      meta_title: '',
      meta_description: '',
      featured_image: ''
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/cms/editor" className="text-gold-400 hover:text-gold-300">← CMS</Link>
              <h1 className="text-2xl font-bold">Pages Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              {!editingPage && (
                <button 
                  onClick={createNewPage}
                  className="px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 font-semibold"
                >
                  + New Page
                </button>
              )}
              <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {editingPage ? (
          <div className="bg-white rounded-xl shadow-lg">
            {/* Tabs */}
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'edit' 
                    ? 'border-b-2 border-navy-900 text-navy-900' 
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                ✏️ Edit Content
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'meta' 
                    ? 'border-b-2 border-navy-900 text-navy-900' 
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                🔍 SEO & Meta
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-4 font-medium text-slate-600 hover:text-navy-900 ml-auto"
              >
                {showPreview ? '📝 Hide Preview' : '👁️ Show Preview'}
              </button>
            </div>

            <div className="p-8">
              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <div className="space-y-6">
                  {/* Visual Editor Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div>
                      <h3 className="font-bold text-lg">🎨 Visual Page Builder</h3>
                      <p className="text-sm text-slate-600">Webflow-style drag & drop editor with live preview</p>
                    </div>
                    <button
                      onClick={() => setUseVisualEditor(!useVisualEditor)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        useVisualEditor 
                          ? 'bg-purple-600 text-white shadow-lg' 
                          : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {useVisualEditor ? '✓ Visual Editor Active' : 'Enable Visual Editor'}
                    </button>
                  </div>

                  {useVisualEditor ? (
                    <div className="-mx-8 -mb-8">
                      <WebflowEditor
                        initialContent={editingPage.content || ''}
                        onSave={(content) => {
                          setEditingPage({...editingPage, content})
                          setUseVisualEditor(false)
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., About Us"
                        value={editingPage.title || ''}
                        onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">URL Slug *</label>
                      <input
                        type="text"
                        placeholder="about-us"
                        value={editingPage.slug || ''}
                        onChange={(e) => setEditingPage({...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <p className="text-xs text-slate-500 mt-1">URL: /{editingPage.slug}</p>
                    </div>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium mb-3">Quick Insert:</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => insertFormatting('h1')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">H1</button>
                      <button onClick={() => insertFormatting('h2')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">H2</button>
                      <button onClick={() => insertFormatting('h3')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">H3</button>
                      <button onClick={() => insertFormatting('p')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">Paragraph</button>
                      <button onClick={() => insertFormatting('bold')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm font-bold">B</button>
                      <button onClick={() => insertFormatting('italic')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm italic">I</button>
                      <button onClick={() => insertFormatting('link')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">🔗 Link</button>
                      <button onClick={() => insertFormatting('button')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">Button</button>
                      <button onClick={() => insertFormatting('list')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">• List</button>
                      <button onClick={() => insertFormatting('image')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">🖼️ Image</button>
                      <button onClick={() => insertFormatting('section')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">Section</button>
                      <button onClick={() => insertFormatting('grid')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">Grid</button>
                      <button onClick={() => insertFormatting('card')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">Card</button>
                      <button onClick={() => insertFormatting('container')} className="px-3 py-1 bg-white border rounded hover:bg-slate-100 text-sm">Container</button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Content (HTML/Tailwind)</label>
                    <textarea
                      placeholder="Write your content here... HTML and Tailwind CSS classes supported"
                      value={editingPage.content || ''}
                      onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                      rows={20}
                      className="w-full px-4 py-3 border rounded-lg font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">💡 Use Tailwind CSS classes for styling. Click toolbar buttons to insert common elements.</p>
                  </div>
                    </>
                  )}
                </div>
              )}

              {/* Meta Tab */}
              {activeTab === 'meta' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={editingPage.featured_image || ''}
                      onChange={(e) => setEditingPage({...editingPage, featured_image: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    {editingPage.featured_image && (
                      <img src={editingPage.featured_image} alt="Preview" className="mt-2 w-64 rounded-lg" />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Title (Meta Title)</label>
                    <input
                      type="text"
                      placeholder="Optimized page title for search engines"
                      value={editingPage.meta_title || ''}
                      onChange={(e) => setEditingPage({...editingPage, meta_title: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      maxLength={60}
                    />
                    <p className="text-xs text-slate-500 mt-1">{(editingPage.meta_title || '').length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      placeholder="Brief description for search engine results"
                      value={editingPage.meta_description || ''}
                      onChange={(e) => setEditingPage({...editingPage, meta_description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                      maxLength={160}
                    />
                    <p className="text-xs text-slate-500 mt-1">{(editingPage.meta_description || '').length}/160 characters</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={() => savePage(editingPage)}
                  className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 font-semibold"
                >
                  💾 Save Page
                </button>
                <button
                  onClick={() => setEditingPage(null)}
                  className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="border-t bg-slate-50 p-8">
                <h3 className="text-lg font-bold mb-4">Preview:</h3>
                <div className="bg-white rounded-lg p-8 shadow-inner min-h-[400px]">
                  <h1 className="text-4xl font-bold mb-6">{editingPage.title || 'Untitled Page'}</h1>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: editingPage.content || '<p class="text-slate-400">No content yet...</p>' }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-2xl font-bold">{pages.length}</div>
                <div className="text-slate-600">Total Pages</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-2">✏️</div>
                <div className="text-2xl font-bold">{pages.filter(p => p.content?.html).length}</div>
                <div className="text-slate-600">With Content</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-2">🕐</div>
                <div className="text-2xl font-bold">
                  {pages.length > 0 ? new Date(pages[0].updated_at).toLocaleDateString() : '-'}
                </div>
                <div className="text-slate-600">Last Updated</div>
              </div>
            </div>

            {/* Pages List */}
            <div className="grid gap-6">
              {pages.map(page => (
                <div key={page.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{page.content?.title || page.slug}</h3>
                      </div>
                      <p className="text-slate-600 mb-2">
                        <span className="font-mono text-sm">/{page.slug}</span>
                      </p>
                      {page.content?.meta_description && (
                        <p className="text-sm text-slate-500 line-clamp-2">{page.content.meta_description}</p>
                      )}
                      <div className="text-xs text-slate-400 mt-2">
                        Updated {new Date(page.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingPage({
                          id: page.id,
                          slug: page.slug,
                          title: page.content?.title || '',
                          content: page.content?.html || '',
                          meta_title: page.content?.meta_title || '',
                          meta_description: page.content?.meta_description || '',
                          featured_image: page.content?.featured_image || ''
                        })}
                        className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePage(page.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {pages.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-bold mb-2">No pages yet</h3>
                  <p className="text-slate-600 mb-4">Create your first page to get started</p>
                  <button 
                    onClick={createNewPage}
                    className="px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 font-semibold"
                  >
                    + Create First Page
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
