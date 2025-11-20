import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Settings() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('company')
  const [companySettings, setCompanySettings] = useState({
    company_name: '',
    address: '',
    phone: '',
    email: '',
    timezone: '',
    logo_url: ''
  })
  const [apiSettings, setApiSettings] = useState({
    telnyx_api_key: '',
    zoom_api_key: '',
    openai_api_key: ''
  })

  useEffect(() => {
    requireAuth()
    const currentUser = getUser()
    setUser(currentUser)
    
    // Only allow admin or masteracct to access settings
    if (currentUser.role !== 'admin' && currentUser.role !== 'masteracct') {
      alert('Access denied. Admin privileges required.')
      window.location.href = '/crm/dashboard'
    }
    
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Try localStorage first
      const savedCompany = localStorage.getItem('company_settings')
      const savedApi = localStorage.getItem('api_settings')
      
      if (savedCompany) {
        setCompanySettings(JSON.parse(savedCompany))
      }
      if (savedApi) {
        setApiSettings(JSON.parse(savedApi))
      }
      
      // Try Supabase as backup (but don't fail if it errors)
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        
        if (data) {
          setCompanySettings({
            company_name: data.company_name || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            timezone: data.timezone || '',
            logo_url: data.logo_url || ''
          })
          
          setApiSettings({
            telnyx_api_key: data.telnyx_api_key || '',
            zoom_api_key: data.zoom_api_key || '',
            openai_api_key: data.openai_api_key || ''
          })
        }
      } catch (dbError) {
        console.log('Using localStorage settings (Supabase unavailable)')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = async (type) => {
    try {
      let settingsToSave = {}
      
      if (type === 'company') {
        settingsToSave = { ...companySettings }
        localStorage.setItem('company_settings', JSON.stringify(companySettings))
      } else if (type === 'api') {
        settingsToSave = { ...apiSettings }
        localStorage.setItem('api_settings', JSON.stringify(apiSettings))
      }
      
      // Try to save to Supabase as backup (but don't fail if it errors)
      try {
        const { data: existing } = await supabase
          .from('settings')
          .select('id')
          .single()
        
        let error
        if (existing) {
          const result = await supabase
            .from('settings')
            .update(settingsToSave)
            .eq('id', existing.id)
          error = result.error
        } else {
          const result = await supabase
            .from('settings')
            .insert([{ ...settingsToSave, user_id: user.id }])
          error = result.error
        }

        if (error) console.log('Supabase save failed, using localStorage only')
      } catch (dbError) {
        console.log('Settings saved to localStorage (Supabase unavailable)')
      }
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings: ' + error.message)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'company' 
                  ? 'border-b-2 border-navy-900 text-navy-900' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Company Profile
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'integrations' 
                  ? 'border-b-2 border-navy-900 text-navy-900' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              API Integrations
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'users' 
                  ? 'border-b-2 border-navy-900 text-navy-900' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Users & Permissions
            </button>
          </div>

          <div className="p-6">
            {/* Company Profile Tab */}
            {activeTab === 'company' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Company Information</h3>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companySettings.company_name}
                  onChange={(e) => setCompanySettings({...companySettings, company_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                    className="px-4 py-2 border rounded-lg"
                  />
                </div>
                <select
                  value={companySettings.timezone}
                  onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Timezone</option>
                  <option value="America/New_York">Eastern (ET)</option>
                  <option value="America/Chicago">Central (CT)</option>
                  <option value="America/Denver">Mountain (MT)</option>
                  <option value="America/Los_Angeles">Pacific (PT)</option>
                </select>
                <input
                  type="url"
                  placeholder="Logo URL"
                  value={companySettings.logo_url}
                  onChange={(e) => setCompanySettings({...companySettings, logo_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <button 
                  onClick={() => saveSettings('company')}
                  className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800"
                >
                  Save Company Settings
                </button>
              </div>
            )}

            {/* API Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold mb-4">API Keys & Integrations</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Telnyx API Key</label>
                  <input
                    type="password"
                    placeholder="KEY019A9882C31D01095C859872CA76ED8B..."
                    value={apiSettings.telnyx_api_key}
                    onChange={(e) => setApiSettings({...apiSettings, telnyx_api_key: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">For calls & SMS functionality</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zoom API Key</label>
                  <input
                    type="password"
                    placeholder="Enter Zoom API Key"
                    value={apiSettings.zoom_api_key}
                    onChange={(e) => setApiSettings({...apiSettings, zoom_api_key: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">For Zoom integration</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiSettings.openai_api_key}
                    onChange={(e) => setApiSettings({...apiSettings, openai_api_key: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">For AI-powered features</p>
                </div>

                <button 
                  onClick={() => saveSettings('api')}
                  className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800"
                >
                  Save API Settings
                </button>
              </div>
            )}

            {/* Users & Permissions Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-bold mb-4">User Management</h3>
                <div className="bg-slate-50 p-6 rounded-lg mb-4">
                  <p className="text-slate-600 mb-2"><strong>Current User:</strong> {user.username}</p>
                  <p className="text-slate-600"><strong>Role:</strong> {user.role}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    �� <strong>Note:</strong> User management requires database integration. Use Supabase dashboard to manage users, roles, and permissions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
