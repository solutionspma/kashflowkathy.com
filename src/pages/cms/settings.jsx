import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function CMSSettings() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requireAuth()
    const userData = getUser()
    if (userData && (userData.role === 'admin' || userData.role === 'masteracct')) {
      setUser(userData)
      loadSettings()
    } else {
      window.location.href = '/crm/dashboard'
    }
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')

      if (error) throw error
      
      const settingsObj = {}
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value
      })
      setSettings(settingsObj)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (key, value) => {
    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })

      if (error) throw error
      alert('Setting saved!')
    } catch (error) {
      console.error('Error saving setting:', error)
      alert('Error saving setting')
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
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Site Configuration</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="Kashflow Kathy"
                className="w-full px-4 py-2 border rounded-lg"
                onBlur={(e) => saveSetting('site_name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="kathy@costseg.tax"
                className="w-full px-4 py-2 border rounded-lg"
                onBlur={(e) => saveSetting('contact_email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="225-247-2890"
                className="w-full px-4 py-2 border rounded-lg"
                onBlur={(e) => saveSetting('phone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Hours</label>
              <input
                type="text"
                defaultValue="Mon-Fri 9am-5pm CST"
                className="w-full px-4 py-2 border rounded-lg"
                onBlur={(e) => saveSetting('business_hours', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                defaultValue="Expert cost segregation and R&D tax credit services"
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                onBlur={(e) => saveSetting('meta_description', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
