import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CRMSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'Kashflow Kathy',
    timezone: 'America/Chicago',
    currency: 'USD',
    fiscalYearStart: '01',
    
    // Email Settings
    emailSignature: '',
    defaultEmailFrom: 'kathy@costseg.tax',
    bccEmail: 'helloworld@pitchmarketing.agency',
    
    // SMS Settings
    smsFrom: '',
    smsSignature: '- Kathy Ferguson',
    
    // Automation Settings
    autoFollowUpEnabled: true,
    autoFollowUpDelay: 3,
    autoAssignLeads: true,
    autoTagging: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyDigest: true,
    
    // Pipeline Settings
    defaultPipelineStage: 'inquiry',
    autoMoveDeals: false,
    dealRotting: 30,
    
    // Commission Settings
    referralRate: 0.10,
    directSaleRate: 0.40,
    paymentDay: 15,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    // In production, save to company_settings table
    await supabase.from('company_settings').upsert(
      Object.entries(settings).map(([key, value]) => ({
        key,
        value: { data: value },
      }))
    )
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-700">CRM Settings</h1>
            <p className="text-slate-600 mt-1">Configure your CRM preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`btn-primary ${saved ? 'bg-green-600' : ''}`}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {/* General Settings */}
        <div className="card bg-white mb-6">
          <h2 className="text-xl font-bold text-navy-700 mb-4">⚙️ General Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="input-field"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="input-field"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Fiscal Year Start
              </label>
              <select
                value={settings.fiscalYearStart}
                onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })}
                className="input-field"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="card bg-white mb-6">
          <h2 className="text-xl font-bold text-navy-700 mb-4">📧 Email Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Default From Email
              </label>
              <input
                type="email"
                value={settings.defaultEmailFrom}
                onChange={(e) => setSettings({ ...settings, defaultEmailFrom: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                BCC Email (for tracking)
              </label>
              <input
                type="email"
                value={settings.bccEmail}
                onChange={(e) => setSettings({ ...settings, bccEmail: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Email Signature
              </label>
              <textarea
                value={settings.emailSignature}
                onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                className="input-field resize-none"
                rows={4}
                placeholder="Best regards,&#10;Kathy Ferguson&#10;Cost Segregation Specialist&#10;kathy@costseg.tax"
              />
            </div>
          </div>
        </div>

        {/* SMS Settings */}
        <div className="card bg-white mb-6">
          <h2 className="text-xl font-bold text-navy-700 mb-4">💬 SMS Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                SMS From Number (Telnyx)
              </label>
              <input
                type="tel"
                value={settings.smsFrom}
                onChange={(e) => setSettings({ ...settings, smsFrom: e.target.value })}
                className="input-field"
                placeholder="+1 (225) 247-2890"
              />
              <p className="text-xs text-slate-500 mt-1">
                Configure in Telnyx dashboard first
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                SMS Signature
              </label>
              <input
                type="text"
                value={settings.smsSignature}
                onChange={(e) => setSettings({ ...settings, smsSignature: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="card bg-white mb-6">
          <h2 className="text-xl font-bold text-navy-700 mb-4">🤖 Automation Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">Auto Follow-up</div>
                <div className="text-sm text-slate-600">
                  Automatically send follow-up emails to new leads
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoFollowUpEnabled}
                  onChange={(e) => setSettings({ ...settings, autoFollowUpEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>

            {settings.autoFollowUpEnabled && (
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Follow-up Delay (days)
                </label>
                <input
                  type="number"
                  value={settings.autoFollowUpDelay}
                  onChange={(e) => setSettings({ ...settings, autoFollowUpDelay: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  max="30"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">Auto-assign Leads</div>
                <div className="text-sm text-slate-600">
                  Automatically assign new leads to team members
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoAssignLeads}
                  onChange={(e) => setSettings({ ...settings, autoAssignLeads: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">Auto-tagging</div>
                <div className="text-sm text-slate-600">
                  Automatically tag leads based on source and behavior
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoTagging}
                  onChange={(e) => setSettings({ ...settings, autoTagging: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card bg-white mb-6">
          <h2 className="text-xl font-bold text-navy-700 mb-4">🔔 Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">Email Notifications</div>
                <div className="text-sm text-slate-600">Receive email alerts for new leads</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">SMS Notifications</div>
                <div className="text-sm text-slate-600">Text alerts for urgent updates</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">Push Notifications</div>
                <div className="text-sm text-slate-600">Mobile app push notifications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy-700">Daily Digest</div>
                <div className="text-sm text-slate-600">Daily summary email at 8 AM</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyDigest}
                  onChange={(e) => setSettings({ ...settings, dailyDigest: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-navy-700 mb-4">💰 Commission Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Referral Commission Rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.referralRate * 100}
                  onChange={(e) => setSettings({ ...settings, referralRate: parseFloat(e.target.value) / 100 })}
                  className="input-field"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="text-navy-700 font-semibold">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Direct Sale Commission Rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.directSaleRate * 100}
                  onChange={(e) => setSettings({ ...settings, directSaleRate: parseFloat(e.target.value) / 100 })}
                  className="input-field"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="text-navy-700 font-semibold">%</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-navy-700 mb-2">
                Payment Day (of each month)
              </label>
              <select
                value={settings.paymentDay}
                onChange={(e) => setSettings({ ...settings, paymentDay: parseInt(e.target.value) })}
                className="input-field"
              >
                <option value="1">1st</option>
                <option value="15">15th</option>
                <option value="30">Last day of month</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
