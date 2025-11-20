import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TEST_TEMPLATES } from '@/lib/testData'

export default function Templates() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [templates, setTemplates] = useState(TEST_TEMPLATES)
  const [emailTemplates, setEmailTemplates] = useState(TEST_TEMPLATES.filter(t => t.type === 'email'))
  const [smsTemplates, setSmsTemplates] = useState(TEST_TEMPLATES.filter(t => t.type === 'sms'))
  const [showForm, setShowForm] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatingAI, setGeneratingAI] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    category: '',
    is_active: true,
    styling: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#333333',
      bold: false,
      italic: false,
      underline: false,
      alignment: 'left'
    }
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const allTemplates = data && data.length > 0 ? data : TEST_TEMPLATES
      setTemplates(allTemplates)
      setEmailTemplates(allTemplates.filter(t => t.type === 'email'))
      setSmsTemplates(allTemplates.filter(t => t.type === 'sms'))
    } catch (error) {
      console.error('Error loading templates:', error)
      setTemplates(TEST_TEMPLATES)
      setEmailTemplates(TEST_TEMPLATES.filter(t => t.type === 'email'))
      setSmsTemplates(TEST_TEMPLATES.filter(t => t.type === 'sms'))
    }
  }

  const generateAITemplate = async () => {
    setGeneratingAI(true)
    try {
      // Get OpenAI API key from settings
      const { data: settings } = await supabase
        .from('settings')
        .select('openai_api_key')
        .single()

      if (!settings?.openai_api_key) {
        alert('Please add your OpenAI API key in Settings first!')
        setGeneratingAI(false)
        return
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.openai_api_key}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: `Generate a professional ${activeTab} template for: ${aiPrompt}. 
            ${activeTab === 'email' ? 'Include a subject line and email body with placeholders like [NAME], [COMPANY], etc.' : 'Keep it under 160 characters with placeholders like [NAME].'}
            Format: Return ONLY the template text, nothing else.`
          }],
          max_tokens: 500
        })
      })

      const data = await response.json()
      const generatedText = data.choices[0].message.content

      // Parse subject and body for email
      if (activeTab === 'email') {
        const lines = generatedText.split('\n')
        const subject = lines[0].replace('Subject:', '').trim()
        const body = lines.slice(1).join('\n').trim()
        
        setFormData({
          ...formData,
          name: aiPrompt,
          subject: subject,
          body: body,
          category: 'ai-generated'
        })
      } else {
        setFormData({
          ...formData,
          name: aiPrompt,
          body: generatedText,
          category: 'ai-generated'
        })
      }

      setShowAIModal(false)
      setShowForm(true)
    } catch (error) {
      console.error('Error generating template:', error)
      alert('Error generating template: ' + error.message)
    }
    setGeneratingAI(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const templateData = {
        name: formData.name,
        type: activeTab === 'email' ? 'email' : 'sms',
        subject: activeTab === 'email' ? formData.subject : '',
        content: formData.body,
        category: formData.category,
        is_active: formData.is_active,
        styling: formData.styling
      }

      const { error } = await supabase
        .from('templates')
        .insert([templateData])

      if (error) throw error

      setShowForm(false)
      setFormData({ 
        name: '', 
        subject: '', 
        body: '', 
        category: '', 
        is_active: true,
        styling: {
          fontFamily: 'Arial',
          fontSize: 14,
          color: '#333333',
          bold: false,
          italic: false,
          underline: false,
          alignment: 'left'
        }
      })
      loadTemplates()
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Error creating template')
    }
  }

  const toggleActive = async (id, isActive, type) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({ is_active: !isActive })
        .eq('id', id)

      if (error) throw error
      loadTemplates()
    } catch (error) {
      console.error('Error toggling template:', error)
    }
  }

  const updateStyling = (field, value) => {
    setFormData({
      ...formData,
      styling: {
        ...formData.styling,
        [field]: value
      }
    })
  }

  const insertVariable = (variable) => {
    setFormData({
      ...formData,
      body: formData.body + `{{${variable}}}`
    })
  }

  const variables = ['name', 'email', 'company', 'phone', 'property_type', 'property_cost']

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Templates</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowAIModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
              >
                <span>✨</span> Generate with AI
              </button>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + New Template
              </button>
              <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 mb-4">
          Home | CRM | Templates
        </div>

        {/* AI Generation Modal */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">✨ Generate Template with AI</h2>
              <p className="text-slate-600 mb-4">
                Describe what kind of {activeTab} template you need and AI will create it for you.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., 'Welcome email for new cost segregation clients' or 'SMS reminder for document upload'"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4"
                rows="4"
              />
              <div className="flex gap-3">
                <button
                  onClick={generateAITemplate}
                  disabled={generatingAI || !aiPrompt}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg font-medium"
                >
                  {generatingAI ? 'Generating...' : 'Generate Template'}
                </button>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'email' 
                ? 'bg-navy-900 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Email Templates ({emailTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'sms' 
                ? 'bg-navy-900 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            SMS Templates ({smsTemplates.length})
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">New {activeTab === 'email' ? 'Email' : 'SMS'} Template</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Template Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {activeTab === 'email' && (
                <input
                  type="text"
                  placeholder="Email Subject *"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message Body * {activeTab === 'sms' && `(${formData.body.length}/160 chars)`}
                </label>
                <textarea
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="6"
                  maxLength={activeTab === 'sms' ? 160 : undefined}
                  placeholder="Use variables like [NAME], [COMPANY], [EMAIL]"
                  style={{
                    fontFamily: formData.styling.fontFamily,
                    fontSize: `${formData.styling.fontSize}px`,
                    color: formData.styling.color,
                    fontWeight: formData.styling.bold ? 'bold' : 'normal',
                    fontStyle: formData.styling.italic ? 'italic' : 'normal',
                    textDecoration: formData.styling.underline ? 'underline' : 'none',
                    textAlign: formData.styling.alignment
                  }}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {variables.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      + {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styling Controls */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Template Styling</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Font</label>
                    <select
                      value={formData.styling.fontFamily}
                      onChange={(e) => updateStyling('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Size</label>
                    <input
                      type="number"
                      min="10"
                      max="24"
                      value={formData.styling.fontSize}
                      onChange={(e) => updateStyling('fontSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Color</label>
                    <input
                      type="color"
                      value={formData.styling.color}
                      onChange={(e) => updateStyling('color', e.target.value)}
                      className="w-full h-10 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Align</label>
                    <select
                      value={formData.styling.alignment}
                      onChange={(e) => updateStyling('alignment', e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.styling.bold}
                      onChange={(e) => updateStyling('bold', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-bold">Bold</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.styling.italic}
                      onChange={(e) => updateStyling('italic', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm italic">Italic</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.styling.underline}
                      onChange={(e) => updateStyling('underline', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm underline">Underline</span>
                  </label>
                </div>
              </div>

              <input
                type="text"
                placeholder="Category (e.g., onboarding, follow-up, closing)"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Create Template
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Templates List */}
        <div className="grid gap-4">
          {(activeTab === 'email' ? emailTemplates : smsTemplates).map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-navy-900">{template.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      template.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {template.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {template.category}
                      </span>
                    )}
                  </div>
                  {template.subject && (
                    <div className="text-sm font-medium text-slate-700 mb-2">
                      Subject: {template.subject}
                    </div>
                  )}
                  <div className="text-sm text-slate-600 whitespace-pre-wrap">
                    {template.body}
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(template.id, template.is_active, activeTab)}
                  className={`px-4 py-2 rounded-lg ml-4 ${
                    template.is_active 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {template.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
