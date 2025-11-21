import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Head from 'next/head'

// MPC-inspired Plugin Data Structure
const INSTRUMENTS = [
  {
    id: 'drumsynth-multi',
    name: 'Drumsynth Multi',
    category: 'drums',
    manufacturer: 'AKAI',
    status: 'complete',
    icon: '🥁',
    description: 'Complete drum synthesizer with multiple models',
    presets: 24,
    skins: 3,
    color: '#ff6b6b'
  },
  {
    id: 'drumsynth-kick',
    name: 'Drumsynth Kick',
    category: 'drums',
    manufacturer: 'AKAI',
    status: 'wip',
    icon: '👢',
    description: 'Dedicated kick drum synthesis engine',
    presets: 12,
    skins: 1,
    color: '#ee5a6f'
  },
  {
    id: 'solina',
    name: 'Solina',
    category: 'synth',
    manufacturer: 'AIR',
    status: 'wip',
    icon: '🎹',
    description: 'Classic string ensemble synthesizer',
    presets: 18,
    skins: 2,
    color: '#4ecdc4'
  },
  {
    id: 'hype',
    name: 'Hype',
    category: 'synth',
    manufacturer: 'AIR',
    status: 'complete',
    icon: '⚡',
    description: 'Modern synthesizer with wavetable engine',
    presets: 32,
    skins: 4,
    color: '#95e1d3'
  },
  {
    id: 'mellotron',
    name: 'Mellotron',
    category: 'synth',
    manufacturer: 'AIR',
    status: 'planned',
    icon: '📼',
    description: 'Vintage tape-based sampling keyboard',
    presets: 8,
    skins: 0,
    color: '#f38181'
  },
  {
    id: 'odyssey',
    name: 'Odyssey',
    category: 'synth',
    manufacturer: 'AIR',
    status: 'planned',
    icon: '🚀',
    description: 'Classic analog synthesizer recreation',
    presets: 16,
    skins: 1,
    color: '#aa96da'
  },
  {
    id: 'bassline',
    name: 'Bassline',
    category: 'bass',
    manufacturer: 'AKAI',
    status: 'wip',
    icon: '🔊',
    description: 'Monophonic bass synthesizer',
    presets: 20,
    skins: 2,
    color: '#fcbad3'
  },
  {
    id: 'tubesynth',
    name: 'Tubesynth',
    category: 'synth',
    manufacturer: 'AIR',
    status: 'planned',
    icon: '📡',
    description: 'Analog modeled tube synthesizer',
    presets: 14,
    skins: 1,
    color: '#ffffd2'
  }
]

const FX_PLUGINS = [
  {
    id: 'amp-sim',
    name: 'Amp Sim',
    category: 'fx',
    type: 'distortion',
    manufacturer: 'AIR',
    status: 'complete',
    icon: '🎸',
    description: 'Guitar amplifier simulator',
    presets: 28,
    skins: 3,
    color: '#ff8b94'
  },
  {
    id: 'channel-strip',
    name: 'Channel Strip',
    category: 'fx',
    type: 'dynamics',
    manufacturer: 'AKAI',
    status: 'wip',
    icon: '🎚️',
    description: 'Professional channel processing',
    presets: 15,
    skins: 2,
    color: '#a8e6cf'
  }
]

const SEQUENCER_PATTERNS = [
  { id: 1, name: 'Pattern A', bars: 4, active: true },
  { id: 2, name: 'Pattern B', bars: 8, active: false },
  { id: 3, name: 'Pattern C', bars: 2, active: false },
  { id: 4, name: 'Pattern D', bars: 4, active: false }
]

export default function MayhemModule() {
  const [activeView, setActiveView] = useState('library')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlugin, setSelectedPlugin] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const allPlugins = [...INSTRUMENTS, ...FX_PLUGINS]

  const filteredPlugins = allPlugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = [
    { id: 'all', name: 'All Plugins', icon: '🎵', count: allPlugins.length },
    { id: 'drums', name: 'Drums', icon: '🥁', count: allPlugins.filter(p => p.category === 'drums').length },
    { id: 'synth', name: 'Synths', icon: '🎹', count: allPlugins.filter(p => p.category === 'synth').length },
    { id: 'bass', name: 'Bass', icon: '🔊', count: allPlugins.filter(p => p.category === 'bass').length },
    { id: 'fx', name: 'Effects', icon: '✨', count: allPlugins.filter(p => p.category === 'fx').length }
  ]

  return (
    <>
      <Head>
        <title>Mayhem Module - Pitch Studio | Sound Design Hub</title>
        <meta name="description" content="Professional audio plugin library and sound design tools" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl"
                >
                  🎛️
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Mayhem Module</h1>
                  <p className="text-sm text-purple-300">Pitch Studio Sound Design Hub</p>
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ Stop' : '▶️ Play'}
                </button>
                <div className="flex items-center space-x-2 bg-black/40 px-4 py-2 rounded-lg">
                  <span className="text-purple-300 text-sm">BPM:</span>
                  <span className="text-white font-mono font-bold">120</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mt-4">
              {['library', 'sequencer', 'presets', 'skins', 'api'].map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${
                    activeView === view
                      ? 'bg-purple-600 text-white'
                      : 'bg-black/20 text-purple-300 hover:bg-black/40'
                  }`}
                >
                  {view === 'library' && '📚 Library'}
                  {view === 'sequencer' && '🎹 Sequencer'}
                  {view === 'presets' && '💾 Presets'}
                  {view === 'skins' && '🎨 Skins'}
                  {view === 'api' && '📖 API Docs'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {/* Library View */}
            {activeView === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-12 gap-6"
              >
                {/* Sidebar */}
                <div className="col-span-3 space-y-4">
                  {/* Search */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
                    <input
                      type="text"
                      placeholder="🔍 Search plugins..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/60 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Categories */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
                    <h3 className="text-white font-bold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                            selectedCategory === cat.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-black/40 text-purple-300 hover:bg-black/60'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span>{cat.icon}</span>
                            <span className="font-semibold">{cat.name}</span>
                          </span>
                          <span className="text-sm opacity-60">{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white">
                    <h3 className="font-bold mb-3">📊 Library Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Plugins:</span>
                        <span className="font-bold">{allPlugins.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Presets:</span>
                        <span className="font-bold">{allPlugins.reduce((sum, p) => sum + p.presets, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custom Skins:</span>
                        <span className="font-bold">{allPlugins.reduce((sum, p) => sum + p.skins, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plugin Grid */}
                <div className="col-span-9">
                  <div className="grid grid-cols-3 gap-4">
                    {filteredPlugins.map((plugin, index) => (
                      <motion.div
                        key={plugin.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedPlugin(plugin)}
                        className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30 hover:border-purple-500 cursor-pointer transition-all hover:scale-105"
                      >
                        {/* Status Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            plugin.status === 'complete' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            plugin.status === 'wip' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {plugin.status === 'complete' ? '✓ Complete' : 
                             plugin.status === 'wip' ? '⏳ WIP' : '📋 Planned'}
                          </span>
                          <span className="text-xs text-purple-300">{plugin.manufacturer}</span>
                        </div>

                        {/* Icon */}
                        <div 
                          className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl"
                          style={{ background: `linear-gradient(135deg, ${plugin.color}20, ${plugin.color}40)` }}
                        >
                          {plugin.icon}
                        </div>

                        {/* Info */}
                        <h3 className="text-white font-bold text-lg mb-2 text-center">{plugin.name}</h3>
                        <p className="text-purple-300 text-sm text-center mb-4">{plugin.description}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/40 rounded-lg px-3 py-2 text-center">
                            <div className="text-purple-300">Presets</div>
                            <div className="text-white font-bold">{plugin.presets}</div>
                          </div>
                          <div className="bg-black/40 rounded-lg px-3 py-2 text-center">
                            <div className="text-purple-300">Skins</div>
                            <div className="text-white font-bold">{plugin.skins}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredPlugins.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-purple-300 text-xl">No plugins found</p>
                      <p className="text-purple-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Sequencer View */}
            {activeView === 'sequencer' && (
              <motion.div
                key="sequencer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-purple-500/30">
                  <h2 className="text-white text-2xl font-bold mb-6">🎹 Step Sequencer</h2>
                  
                  {/* Pattern Selector */}
                  <div className="flex space-x-2 mb-6">
                    {SEQUENCER_PATTERNS.map(pattern => (
                      <button
                        key={pattern.id}
                        className={`px-6 py-3 rounded-lg font-semibold ${
                          pattern.active
                            ? 'bg-purple-600 text-white'
                            : 'bg-black/40 text-purple-300 hover:bg-black/60'
                        }`}
                      >
                        {pattern.name} ({pattern.bars} bars)
                      </button>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-16 gap-1">
                    {[...Array(16)].map((_, col) => (
                      <div key={col} className="space-y-1">
                        {[...Array(8)].map((_, row) => (
                          <div
                            key={`${row}-${col}`}
                            className="w-full aspect-square bg-black/60 hover:bg-purple-600 rounded cursor-pointer transition-all border border-purple-500/20 hover:border-purple-500"
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                        ▶️ Play Pattern
                      </button>
                      <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg">
                        Clear
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        Randomize
                      </button>
                    </div>
                    <div className="text-purple-300 text-sm">
                      Swing: <span className="text-white font-mono">50%</span> | 
                      Gate: <span className="text-white font-mono">75%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Presets View */}
            {activeView === 'presets' && (
              <motion.div
                key="presets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-purple-500/30">
                  <h2 className="text-white text-2xl font-bold mb-6">💾 Preset Manager</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {allPlugins.map(plugin => (
                      <div key={plugin.id} className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                        <div className="text-2xl mb-2">{plugin.icon}</div>
                        <h4 className="text-white font-bold mb-1">{plugin.name}</h4>
                        <p className="text-purple-300 text-sm">{plugin.presets} presets available</p>
                        <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm">
                          Browse Presets
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skins View */}
            {activeView === 'skins' && (
              <motion.div
                key="skins"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-purple-500/30">
                  <h2 className="text-white text-2xl font-bold mb-6">🎨 Custom Skins Gallery</h2>
                  <div className="grid grid-cols-3 gap-6">
                    {allPlugins.filter(p => p.skins > 0).map(plugin => (
                      <div key={plugin.id} className="bg-black/40 rounded-xl overflow-hidden border border-purple-500/20">
                        <div 
                          className="h-48 flex items-center justify-center text-6xl"
                          style={{ background: `linear-gradient(135deg, ${plugin.color}40, ${plugin.color}80)` }}
                        >
                          {plugin.icon}
                        </div>
                        <div className="p-4">
                          <h4 className="text-white font-bold mb-1">{plugin.name}</h4>
                          <p className="text-purple-300 text-sm mb-3">{plugin.skins} custom skins</p>
                          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg">
                            Download Skins
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* API Docs View */}
            {activeView === 'api' && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-purple-500/30">
                  <h2 className="text-white text-2xl font-bold mb-6">📖 API Documentation</h2>
                  <div className="space-y-4">
                    <div className="bg-black/60 rounded-lg p-6 border border-purple-500/20">
                      <h3 className="text-purple-300 font-bold mb-3">📚 Available Documentation</h3>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-center space-x-2">
                          <span>📄</span>
                          <span>Instruments-API-Drumsynth Models.md</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span>📄</span>
                          <span>Instruments-API-Drumsynth Multi GUI.md</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span>📄</span>
                          <span>Instruments-API-Hype GUI.md</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span>📄</span>
                          <span>Instruments-API-Solina GUI.md</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span>📄</span>
                          <span>Fx-API-Amp Sim Presets.md</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
                      <h3 className="text-white font-bold mb-2">🔧 XML/JSON Structure</h3>
                      <p className="text-purple-200 text-sm">
                        Each plugin includes XML configuration files for UI layout and JSON preset definitions.
                        Documentation covers parameter ranges, GUI element positioning, and preset formatting.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plugin Detail Modal */}
        <AnimatePresence>
          {selectedPlugin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlugin(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500/50"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-white text-3xl font-bold mb-2">{selectedPlugin.icon} {selectedPlugin.name}</h2>
                    <p className="text-purple-300">{selectedPlugin.manufacturer}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPlugin(null)}
                    className="text-white hover:text-red-400 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-white">
                  <p className="text-lg">{selectedPlugin.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-purple-300 mb-2">Category</div>
                      <div className="font-bold capitalize">{selectedPlugin.category}</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-purple-300 mb-2">Presets</div>
                      <div className="font-bold">{selectedPlugin.presets}</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-purple-300 mb-2">Custom Skins</div>
                      <div className="font-bold">{selectedPlugin.skins}</div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold">
                      Load Plugin
                    </button>
                    <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold">
                      Browse Presets
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
