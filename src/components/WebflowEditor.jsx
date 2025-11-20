import React, { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const GOOGLE_FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway',
  'Poppins', 'Merriweather', 'Playfair Display', 'Inter', 'Nunito'
]

const COMPONENT_LIBRARY = [
  {
    id: 'heading',
    name: 'Heading',
    icon: '📝',
    defaultContent: '<h2>Heading Text</h2>',
    category: 'text'
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    icon: '📄',
    defaultContent: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
    category: 'text'
  },
  {
    id: 'button',
    name: 'Button',
    icon: '🔘',
    defaultContent: '<button class="btn-primary">Click Me</button>',
    category: 'interactive'
  },
  {
    id: 'image',
    name: 'Image',
    icon: '🖼️',
    defaultContent: '<img src="https://via.placeholder.com/400x300" alt="Placeholder" />',
    category: 'media'
  },
  {
    id: 'container',
    name: 'Container',
    icon: '📦',
    defaultContent: '<div class="container">Container content</div>',
    category: 'layout'
  },
  {
    id: 'grid',
    name: 'Grid 2-Col',
    icon: '▦',
    defaultContent: '<div class="grid grid-cols-2 gap-4"><div>Column 1</div><div>Column 2</div></div>',
    category: 'layout'
  },
  {
    id: 'section',
    name: 'Section',
    icon: '📋',
    defaultContent: '<section class="py-12"><div class="container mx-auto">Section content</div></section>',
    category: 'layout'
  },
  {
    id: 'card',
    name: 'Card',
    icon: '🃏',
    defaultContent: '<div class="card"><h3>Card Title</h3><p>Card content goes here.</p></div>',
    category: 'layout'
  }
]

const CODE_SNIPPETS = [
  {
    name: 'Hero Section',
    code: `<section class="hero-gradient min-h-screen flex items-center justify-center">
  <div class="text-center text-white px-4">
    <h1 class="text-5xl font-bold mb-6">Welcome to Kashflow Kathy</h1>
    <p class="text-xl mb-8">Cost Segregation & Tax Strategy Specialists</p>
    <button class="btn-primary">Get Started</button>
  </div>
</section>`
  },
  {
    name: 'Features Grid',
    code: `<section class="py-16">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">Our Services</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card text-center">
        <div class="text-4xl mb-4">💰</div>
        <h3 class="text-xl font-bold mb-2">Cost Segregation</h3>
        <p>Accelerate depreciation and reduce tax liability</p>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-4">🔬</div>
        <h3 class="text-xl font-bold mb-2">R&D Tax Credits</h3>
        <p>Claim credits for innovation and development</p>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-4">📊</div>
        <h3 class="text-xl font-bold mb-2">Tax Planning</h3>
        <p>Strategic planning to maximize savings</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    name: 'Contact Form',
    code: `<section class="py-16 bg-slate-50">
  <div class="max-w-2xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Get In Touch</h2>
    <form class="space-y-4">
      <input type="text" placeholder="Name" class="input-field" />
      <input type="email" placeholder="Email" class="input-field" />
      <textarea placeholder="Message" class="input-field" rows="5"></textarea>
      <button type="submit" class="btn-primary w-full">Send Message</button>
    </form>
  </div>
</section>`
  }
]

export default function WebflowEditor({ initialContent = '', onSave }) {
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [activePanel, setActivePanel] = useState('components') // components, typography, positioning, fx, snippets
  const [previewMode, setPreviewMode] = useState(false)
  const canvasRef = useRef(null)

  // Styling state for selected element
  const [elementStyles, setElementStyles] = useState({
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    backgroundColor: 'transparent',
    padding: '0px',
    margin: '0px',
    width: 'auto',
    height: 'auto',
    display: 'block',
    textAlign: 'left',
    borderRadius: '0px',
    borderWidth: '0px',
    borderColor: '#000000',
    boxShadow: 'none',
    opacity: '1',
    transform: 'none'
  })

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS.join('&family=').replace(/ /g, '+')}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Parse initial content into elements
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent)
        setElements(parsed)
      } catch {
        // If not JSON, treat as HTML
        setElements([{
          id: 'element-1',
          type: 'html',
          content: initialContent,
          styles: {}
        }])
      }
    }
  }, [initialContent])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(elements)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setElements(items)
  }

  const addComponent = (component) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: component.id,
      content: component.defaultContent,
      styles: {}
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const updateElementContent = (id, content) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, content } : el
    ))
  }

  const updateElementStyles = (id, styles) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, styles: { ...el.styles, ...styles } } : el
    ))
  }

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElement === id) setSelectedElement(null)
  }

  const insertSnippet = (snippet) => {
    const newElement = {
      id: `snippet-${Date.now()}`,
      type: 'snippet',
      content: snippet.code,
      styles: {}
    }
    setElements([...elements, newElement])
  }

  const handleSave = () => {
    const output = {
      elements,
      html: elements.map(el => el.content).join('\n')
    }
    onSave(JSON.stringify(output))
  }

  const renderStyleControls = () => {
    const selected = elements.find(el => el.id === selectedElement)
    if (!selected) return <div className="text-center text-slate-500 py-8">Select an element to edit</div>

    return (
      <div className="space-y-4">
        {activePanel === 'typography' && (
          <>
            <div>
              <label className="block text-xs font-medium mb-1">Font Family</label>
              <select
                value={selected.styles.fontFamily || 'Inter'}
                onChange={(e) => updateElementStyles(selected.id, { fontFamily: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm"
                style={{ fontFamily: selected.styles.fontFamily || 'Inter' }}
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Size</label>
                <input
                  type="text"
                  value={selected.styles.fontSize || '16px'}
                  onChange={(e) => updateElementStyles(selected.id, { fontSize: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="16px"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Weight</label>
                <select
                  value={selected.styles.fontWeight || '400'}
                  onChange={(e) => updateElementStyles(selected.id, { fontWeight: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selected.styles.color || '#000000'}
                    onChange={(e) => updateElementStyles(selected.id, { color: e.target.value })}
                    className="w-12 h-10 border rounded"
                  />
                  <input
                    type="text"
                    value={selected.styles.color || '#000000'}
                    onChange={(e) => updateElementStyles(selected.id, { color: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Align</label>
                <div className="flex gap-1">
                  {['left', 'center', 'right', 'justify'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateElementStyles(selected.id, { textAlign: align })}
                      className={`flex-1 px-2 py-2 border rounded text-xs ${selected.styles.textAlign === align ? 'bg-navy-900 text-white' : 'bg-white'}`}
                    >
                      {align[0].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activePanel === 'positioning' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Width</label>
                <input
                  type="text"
                  value={selected.styles.width || 'auto'}
                  onChange={(e) => updateElementStyles(selected.id, { width: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Height</label>
                <input
                  type="text"
                  value={selected.styles.height || 'auto'}
                  onChange={(e) => updateElementStyles(selected.id, { height: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Padding</label>
                <input
                  type="text"
                  value={selected.styles.padding || '0px'}
                  onChange={(e) => updateElementStyles(selected.id, { padding: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="10px"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Margin</label>
                <input
                  type="text"
                  value={selected.styles.margin || '0px'}
                  onChange={(e) => updateElementStyles(selected.id, { margin: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="10px"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Display</label>
              <select
                value={selected.styles.display || 'block'}
                onChange={(e) => updateElementStyles(selected.id, { display: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selected.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => updateElementStyles(selected.id, { backgroundColor: e.target.value })}
                  className="w-12 h-10 border rounded"
                />
                <input
                  type="text"
                  value={selected.styles.backgroundColor || 'transparent'}
                  onChange={(e) => updateElementStyles(selected.id, { backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
              </div>
            </div>
          </>
        )}

        {activePanel === 'fx' && (
          <>
            <div>
              <label className="block text-xs font-medium mb-1">Border Radius</label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(selected.styles.borderRadius) || 0}
                onChange={(e) => updateElementStyles(selected.id, { borderRadius: `${e.target.value}px` })}
                className="w-full"
              />
              <div className="text-xs text-center">{selected.styles.borderRadius || '0px'}</div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selected.styles.opacity || 1}
                onChange={(e) => updateElementStyles(selected.id, { opacity: e.target.value })}
                className="w-full"
              />
              <div className="text-xs text-center">{Math.round((selected.styles.opacity || 1) * 100)}%</div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Box Shadow</label>
              <select
                value={selected.styles.boxShadow || 'none'}
                onChange={(e) => updateElementStyles(selected.id, { boxShadow: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.15)">XLarge</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Border Width</label>
                <input
                  type="text"
                  value={selected.styles.borderWidth || '0px'}
                  onChange={(e) => updateElementStyles(selected.id, { borderWidth: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="1px"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Border Color</label>
                <input
                  type="color"
                  value={selected.styles.borderColor || '#000000'}
                  onChange={(e) => updateElementStyles(selected.id, { borderColor: e.target.value })}
                  className="w-full h-10 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Transform</label>
              <div className="space-y-2">
                <button
                  onClick={() => updateElementStyles(selected.id, { transform: 'scale(1.1)' })}
                  className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                >
                  Scale Up
                </button>
                <button
                  onClick={() => updateElementStyles(selected.id, { transform: 'rotate(5deg)' })}
                  className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                >
                  Rotate
                </button>
                <button
                  onClick={() => updateElementStyles(selected.id, { transform: 'none' })}
                  className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Left Sidebar - Component Library & Styles */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Visual Editor</h2>
        </div>

        {/* Panel Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActivePanel('components')}
            className={`flex-1 px-3 py-2 text-sm ${activePanel === 'components' ? 'bg-navy-900 text-white' : 'bg-slate-50'}`}
          >
            Components
          </button>
          <button
            onClick={() => setActivePanel('typography')}
            className={`flex-1 px-3 py-2 text-sm ${activePanel === 'typography' ? 'bg-navy-900 text-white' : 'bg-slate-50'}`}
          >
            Typography
          </button>
          <button
            onClick={() => setActivePanel('positioning')}
            className={`flex-1 px-3 py-2 text-sm ${activePanel === 'positioning' ? 'bg-navy-900 text-white' : 'bg-slate-50'}`}
          >
            Layout
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActivePanel('fx')}
            className={`flex-1 px-3 py-2 text-sm ${activePanel === 'fx' ? 'bg-navy-900 text-white' : 'bg-slate-50'}`}
          >
            Effects
          </button>
          <button
            onClick={() => setActivePanel('snippets')}
            className={`flex-1 px-3 py-2 text-sm ${activePanel === 'snippets' ? 'bg-navy-900 text-white' : 'bg-slate-50'}`}
          >
            Snippets
          </button>
        </div>

        <div className="p-4">
          {activePanel === 'components' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-3">Drag or Click to Add</h3>
              {COMPONENT_LIBRARY.map(component => (
                <button
                  key={component.id}
                  onClick={() => addComponent(component)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left flex items-center gap-3 border border-slate-200"
                >
                  <span className="text-2xl">{component.icon}</span>
                  <span className="font-medium">{component.name}</span>
                </button>
              ))}
            </div>
          )}

          {activePanel === 'snippets' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-3">Code Snippets</h3>
              {CODE_SNIPPETS.map((snippet, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSnippet(snippet)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left border border-slate-200"
                >
                  <div className="font-medium text-sm">{snippet.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Click to insert</div>
                </button>
              ))}
            </div>
          )}

          {(activePanel === 'typography' || activePanel === 'positioning' || activePanel === 'fx') && (
            renderStyleControls()
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded ${previewMode ? 'bg-green-600 text-white' : 'bg-slate-100'}`}
            >
              {previewMode ? '👁️ Preview' : '✏️ Edit'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-navy-900 text-white rounded hover:bg-navy-800"
            >
              💾 Save Page
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-slate-100">
          <div ref={canvasRef} className="max-w-6xl mx-auto bg-white shadow-xl min-h-screen">
            {previewMode ? (
              <div className="p-8">
                {elements.map(el => (
                  <div
                    key={el.id}
                    dangerouslySetInnerHTML={{ __html: el.content }}
                    style={el.styles}
                  />
                ))}
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="canvas">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="p-8 min-h-screen"
                    >
                      {elements.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                          <div className="text-6xl mb-4">🎨</div>
                          <p className="text-lg">Click components on the left to start building</p>
                        </div>
                      ) : (
                        elements.map((el, index) => (
                          <Draggable key={el.id} draggableId={el.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`mb-4 group relative ${selectedElement === el.id ? 'ring-2 ring-blue-500' : ''} ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                onClick={() => setSelectedElement(el.id)}
                              >
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 cursor-move bg-slate-700 text-white p-2 rounded"
                                >
                                  ⋮⋮
                                </div>

                                {/* Element Content */}
                                <div
                                  contentEditable={!previewMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => updateElementContent(el.id, e.target.innerHTML)}
                                  dangerouslySetInnerHTML={{ __html: el.content }}
                                  style={el.styles}
                                  className="outline-none"
                                />

                                {/* Delete Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteElement(el.id)
                                  }}
                                  className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
