import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { generateSocialCaption } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export default function SocialMediaSuite() {
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin')
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [scheduledFor, setScheduledFor] = useState('')
  const [generating, setGenerating] = useState(false)

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077b5' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000' },
    { id: 'twitter', name: 'X/Twitter', icon: '🐦', color: '#000000' },
  ]

  const handleGenerateCaption = async () => {
    setGenerating(true)
    try {
      const caption = await generateSocialCaption(selectedPlatform, 'cost segregation tax savings', 'educational')
      setContent(caption)
    } catch (error) {
      console.error('Error generating caption:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleSchedulePost = async () => {
    try {
      await supabase.from('social_posts').insert([
        {
          platform: selectedPlatform,
          content: content,
          hashtags: hashtags.split(' ').filter(h => h.startsWith('#')),
          scheduled_for: scheduledFor || new Date().toISOString(),
          status: scheduledFor ? 'scheduled' : 'draft',
        },
      ])
      alert('Post scheduled successfully!')
      setContent('')
      setHashtags('')
      setScheduledFor('')
    } catch (error) {
      console.error('Error scheduling post:', error)
      alert('Error scheduling post')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-700 mb-8">Social Media Suite</h1>

        {/* Platform Selector */}
        <div className="card bg-white mb-6">
          <h3 className="text-lg font-bold text-navy-700 mb-4">Select Platform</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPlatform === platform.id
                    ? 'border-navy-600 bg-navy-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">{platform.icon}</div>
                <div className="text-xs font-semibold text-slate-700">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Composer */}
          <div className="card bg-white">
            <h3 className="text-lg font-bold text-navy-700 mb-4">Create Post</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field resize-none"
                rows={8}
                placeholder="Write your post here..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="input-field"
                placeholder="#CostSegregation #TaxSavings #RealEstate"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Schedule For (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerateCaption}
                disabled={generating}
                className="btn-outline flex-1"
              >
                {generating ? '🤖 Generating...' : '🤖 AI Generate'}
              </button>
              <button
                onClick={handleSchedulePost}
                className="btn-primary flex-1"
              >
                {scheduledFor ? '📅 Schedule' : '📤 Post Now'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="card bg-white">
            <h3 className="text-lg font-bold text-navy-700 mb-4">Preview</h3>
            <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  K
                </div>
                <div>
                  <div className="font-bold text-navy-700">Kathy Ferguson</div>
                  <div className="text-xs text-slate-600">Cost Segregation Specialist</div>
                </div>
              </div>
              <div className="text-slate-800 mb-3 whitespace-pre-wrap">{content || 'Your post content will appear here...'}</div>
              {hashtags && (
                <div className="text-sm text-blue-600 mb-3">{hashtags}</div>
              )}
              <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-200">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗️ Share</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-8 card bg-white">
          <h3 className="text-lg font-bold text-navy-700 mb-4">Recent Posts</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 bg-slate-50 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-navy-700">LinkedIn Post</span>
                <span className="text-xs text-green-600">✓ Posted 2 hours ago</span>
              </div>
              <p className="text-sm text-slate-600">100% Bonus Depreciation is back for 2025! Here's what that means...</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span>👍 45 likes</span>
                <span>💬 12 comments</span>
                <span>↗️ 8 shares</span>
              </div>
            </div>
            <div className="border-l-4 border-blue-500 bg-slate-50 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-navy-700">Instagram Post</span>
                <span className="text-xs text-blue-600">📅 Scheduled for tomorrow</span>
              </div>
              <p className="text-sm text-slate-600">Quick tip: Did you know you can accelerate depreciation on...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
