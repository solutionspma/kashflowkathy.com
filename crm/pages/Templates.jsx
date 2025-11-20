import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Templates() {
  const [activeTab, setActiveTab] = useState('email')
  const [emailTemplates, setEmailTemplates] = useState([])
  const [smsTemplates, setSmsTemplates] = useState([])
  const [showNewModal, setShowNewModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    const { data: emails } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    const { data: sms } = await supabase
      .from('sms_templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (emails) setEmailTemplates(emails)
    if (sms) setSmsTemplates(sms)
  }

  const handleSaveEmail = async (template) => {
    if (template.id) {
      await supabase
        .from('email_templates')
        .update(template)
        .eq('id', template.id)
    } else {
      await supabase
        .from('email_templates')
        .insert([template])
    }
    
    setShowNewModal(false)
    setEditingTemplate(null)
    loadTemplates()
  }

  const handleSaveSMS = async (template) => {
    if (template.id) {
      await supabase
        .from('sms_templates')
        .update(template)
        .eq('id', template.id)
    } else {
      await supabase
        .from('sms_templates')
        .insert([template])
    }
    
    setShowNewModal(false)
    setEditingTemplate(null)
    loadTemplates()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">Message Templates</h1>
            <p className="text-slate-600 mt-1">Create reusable email and SMS templates</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary"
          >
            + New Template
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === 'email'
                ? 'text-navy-700 border-b-2 border-navy-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📧 Email Templates ({emailTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === 'sms'
                ? 'text-navy-700 border-b-2 border-navy-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            💬 SMS Templates ({smsTemplates.length})
          </button>
        </div>

        {/* Email Templates */}
        {activeTab === 'email' && (
          <div className="grid gap-4">
            {emailTemplates.map((template) => (
              <div key={template.id} className="card bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-navy-700">{template.name}</h3>
                      {template.category && (
                        <span className="px-2 py-1 bg-navy-50 text-navy-700 text-xs rounded">
                          {template.category}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${
                        template.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Subject: {template.subject}
                    </div>
                    <div className="text-sm text-slate-600 line-clamp-2">
                      {template.body?.substring(0, 150)}...
                    </div>
                    {template.variables && Object.keys(template.variables).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.keys(template.variables).map((varName) => (
                          <span key={varName} className="px-2 py-1 bg-gold-100 text-gold-800 text-xs rounded">
                            {`{{${varName}}}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTemplate(template)
                        setShowNewModal(true)
                      }}
                      className="btn-outline text-sm"
                    >
                      Edit
                    </button>
                    <button className="btn-primary text-sm">Use</button>
                  </div>
                </div>
              </div>
            ))}

            {emailTemplates.length === 0 && (
              <div className="card bg-white text-center py-12">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-navy-700 mb-2">No email templates yet</h3>
                <p className="text-slate-600 mb-4">Create reusable templates to save time</p>
                <button onClick={() => setShowNewModal(true)} className="btn-primary">
                  Create Template
                </button>
              </div>
            )}
          </div>
        )}

        {/* SMS Templates */}
        {activeTab === 'sms' && (
          <div className="grid gap-4">
            {smsTemplates.map((template) => (
              <div key={template.id} className="card bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-navy-700">{template.name}</h3>
                      {template.category && (
                        <span className="px-2 py-1 bg-navy-50 text-navy-700 text-xs rounded">
                          {template.category}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-700 mb-2">
                      {template.body}
                    </div>
                    <div className="text-xs text-slate-500">
                      {template.body?.length || 0} / 160 characters
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTemplate(template)
                        setShowNewModal(true)
                      }}
                      className="btn-outline text-sm"
                    >
                      Edit
                    </button>
                    <button className="btn-primary text-sm">Use</button>
                  </div>
                </div>
              </div>
            ))}

            {smsTemplates.length === 0 && (
              <div className="card bg-white text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-navy-700 mb-2">No SMS templates yet</h3>
                <p className="text-slate-600 mb-4">Create quick SMS templates for follow-ups</p>
                <button onClick={() => setShowNewModal(true)} className="btn-primary">
                  Create Template
                </button>
              </div>
            )}
          </div>
        )}

        {/* Template Creation Modal */}
        {showNewModal && (
          <TemplateModal
            type={activeTab}
            template={editingTemplate}
            onSave={activeTab === 'email' ? handleSaveEmail : handleSaveSMS}
            onClose={() => {
              setShowNewModal(false)
              setEditingTemplate(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

function TemplateModal({ type, template, onSave, onClose }) {
  const [formData, setFormData] = useState(
    template || {
      name: '',
      subject: type === 'email' ? '' : undefined,
      body: '',
      category: '',
      is_active: true,
      variables: {},
    }
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-navy-700 mb-4">
          {template ? 'Edit' : 'New'} {type === 'email' ? 'Email' : 'SMS'} Template
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Follow-up Email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              placeholder="e.g., Follow-up, Introduction, Reminder"
            />
          </div>

          {type === 'email' && (
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-field"
                placeholder="Use {{name}} for personalization"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-2">
              Message Body {type === 'sms' && <span className="text-slate-500 text-xs">({formData.body?.length || 0}/160)</span>}
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="input-field resize-none"
              rows={type === 'email' ? 10 : 4}
              placeholder="Use variables like {{name}}, {{company}}, {{property_cost}}"
            />
            <p className="text-xs text-slate-500 mt-1">
              Available variables: name, company, email, phone, property_cost, property_type
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="btn-primary"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  )
}
