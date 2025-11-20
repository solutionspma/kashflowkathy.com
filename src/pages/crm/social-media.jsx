import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_SOCIAL_POSTS, formatDateTime } from '@/lib/testData'

const PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Twitter']

export default function SocialMedia() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState(TEST_SOCIAL_POSTS)
  const [showForm, setShowForm] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    platform: 'LinkedIn',
    content: '',
    media_urls: [],
    hashtags: '',
    scheduled_for: '',
    status: 'draft'
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('scheduled_for', { ascending: true })

      if (error) throw error
      setPosts(data && data.length > 0 ? data : TEST_SOCIAL_POSTS)
    } catch (error) {
      console.log('Using test data for social media')
      setPosts(TEST_SOCIAL_POSTS)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const hashtags_array = formData.hashtags.split(',').map(h => h.trim()).filter(Boolean)
      
      const { error } = await supabase
        .from('social_posts')
        .insert([{
          ...formData,
          hashtags: hashtags_array,
          created_by: user.username
        }])

      if (error) throw error

      setShowForm(false)
      setFormData({
        platform: 'LinkedIn',
        content: '',
        media_urls: [],
        hashtags: '',
        scheduled_for: '',
        status: 'draft'
      })
      loadPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('social_posts')
        .update({ 
          status: newStatus,
          posted_at: newStatus === 'posted' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error
      loadPosts()
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  if (!user) return null

  const scheduled = posts.filter(p => p.status === 'scheduled')
  const drafted = posts.filter(p => p.status === 'draft')
  const posted = posts.filter(p => p.status === 'posted')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Social Media Scheduler</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + New Post
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
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold">{drafted.length}</div>
            <div className="text-slate-600">Drafts</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold">{scheduled.length}</div>
            <div className="text-slate-600">Scheduled</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">{posted.length}</div>
            <div className="text-slate-600">Posted</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-slate-600">Total Posts</div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Create New Post</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                >
                  {PLATFORMS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <textarea
                placeholder="Post content..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Hashtags (comma separated)"
                value={formData.hashtags}
                onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {formData.status === 'scheduled' && (
                <input
                  type="datetime-local"
                  value={formData.scheduled_for}
                  onChange={(e) => setFormData({...formData, scheduled_for: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              )}
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Create Post
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {post.platform}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === 'posted' ? 'bg-green-100 text-green-800' :
                  post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {post.status}
                </span>
              </div>
              
              <p className="text-slate-700 mb-3 line-clamp-3">{post.content}</p>
              
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-blue-600 text-sm">#{tag}</span>
                  ))}
                </div>
              )}
              
              {post.scheduled_for && (
                <div className="text-sm text-slate-500 mb-3">
                  📅 {new Date(post.scheduled_for).toLocaleString()}
                </div>
              )}
              
              {post.status === 'scheduled' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(post.id, 'posted')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Mark Posted
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
