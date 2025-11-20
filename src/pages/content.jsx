import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'

export default function Content() {
  const [activeTab, setActiveTab] = useState('videos')

  const videos = [
    {
      title: 'What is Cost Segregation?',
      platform: 'YouTube',
      embedId: 'dQw4w9WgXcQ', // Replace with actual video IDs
      description: 'Learn the basics of cost segregation and how it can save you thousands',
    },
    {
      title: '100% Bonus Depreciation Explained',
      platform: 'YouTube',
      embedId: 'dQw4w9WgXcQ',
      description: 'How the return of 100% bonus depreciation in 2025 affects your taxes',
    },
    {
      title: 'R&D Tax Credits for Small Business',
      platform: 'YouTube',
      embedId: 'dQw4w9WgXcQ',
      description: 'Discover if your business qualifies for R&D tax credits',
    },
  ]

  const tiktoks = [
    { title: 'Quick Tax Tip #1', url: '#' },
    { title: 'Property Owner Mistakes', url: '#' },
    { title: 'Tax Savings Hack', url: '#' },
  ]

  const articles = [
    {
      title: 'The Ultimate Guide to Cost Segregation',
      excerpt: 'Everything property owners need to know about accelerating depreciation...',
      readTime: '8 min read',
    },
    {
      title: '2025 Tax Planning Strategies',
      excerpt: 'Key strategies to maximize your tax savings this year...',
      readTime: '6 min read',
    },
    {
      title: 'Real Estate Tax Deductions You\'re Missing',
      excerpt: 'Common deductions that property owners overlook...',
      readTime: '5 min read',
    },
  ]

  return (
    <MainLayout title="Content Hub - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-6">Educational Content</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Learn about cost segregation, R&D credits, and tax-saving strategies
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-navy-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            📺 Videos
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'tiktok'
                ? 'bg-navy-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            🎵 TikTok
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-navy-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            📝 Articles
          </button>
        </div>

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="aspect-video bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl">▶️</div>
                  {/* In production: <iframe src={`https://www.youtube.com/embed/${video.embedId}`} /> */}
                </div>
                <h3 className="text-lg font-bold mb-2 text-navy-700">{video.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{video.description}</p>
                <span className="text-xs text-slate-500 uppercase">{video.platform}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* TikTok Tab */}
        {activeTab === 'tiktok' && (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tiktoks.map((tiktok, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="aspect-[9/16] bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg mb-3 flex items-center justify-center text-white text-4xl">
                  🎵
                </div>
                <h4 className="font-semibold text-navy-700">{tiktok.title}</h4>
              </motion.div>
            ))}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-3 text-navy-700">{article.title}</h3>
                <p className="text-slate-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{article.readTime}</span>
                  <button className="text-navy-600 font-semibold hover:text-navy-800">
                    Read More →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 card bg-gradient-to-br from-navy-700 to-navy-900 text-white text-center p-12"
        >
          <h2 className="text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-gold-400 mb-8">
            Get tax-saving tips and industry insights delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-field flex-1"
            />
            <button className="btn-secondary">Subscribe</button>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  )
}
