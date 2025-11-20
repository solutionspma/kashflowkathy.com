import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PermissionsPanel() {
  const [masterMode, setMasterMode] = useState(false)
  const [kathyPermissions, setKathyPermissions] = useState({
    websiteEditor: true,
    crmEditor: true,
    socialSuite: true,
    calculatorSettings: false,
    employeeManagement: true,
    videoContentHub: true,
    appPermissions: true,
    pipelineEditing: true,
    templateEditing: true,
    zoomControls: true,
    brandingAccess: true,
    fullCMSAccess: false,
    apiCredentials: false,
    masterSettings: false,
  })

  const permissionGroups = [
    {
      title: 'Content Management',
      permissions: [
        { key: 'websiteEditor', label: 'Website Editor', description: 'Edit website text and content' },
        { key: 'videoContentHub', label: 'Video Content Hub', description: 'Manage videos and content' },
        { key: 'brandingAccess', label: 'Branding Access', description: 'Edit branding elements' },
        { key: 'fullCMSAccess', label: 'Full CMS Access', description: 'Complete CMS control (Master only)' },
      ],
    },
    {
      title: 'CRM & Sales',
      permissions: [
        { key: 'crmEditor', label: 'CRM Editor', description: 'Manage contacts and deals' },
        { key: 'pipelineEditing', label: 'Pipeline Editing', description: 'Modify pipeline stages' },
        { key: 'templateEditing', label: 'Template Editing', description: 'Create/edit email & SMS templates' },
        { key: 'zoomControls', label: 'Zoom Controls', description: 'Manage Zoom integrations' },
      ],
    },
    {
      title: 'Marketing',
      permissions: [
        { key: 'socialSuite', label: 'Social Suite', description: 'Manage social media posts' },
        { key: 'calculatorSettings', label: 'Calculator Settings', description: 'Modify calculator logic' },
      ],
    },
    {
      title: 'Administration',
      permissions: [
        { key: 'employeeManagement', label: 'Employee Management', description: 'Manage employee accounts (not permissions)' },
        { key: 'appPermissions', label: 'App Permissions', description: 'Control mobile app access' },
        { key: 'apiCredentials', label: 'API Credentials', description: 'Manage API keys (Master only)' },
        { key: 'masterSettings', label: 'Master Settings', description: 'System-wide settings (Master only)' },
      ],
    },
  ]

  const togglePermission = async (key) => {
    // Master-only permissions cannot be toggled by Kathy
    const masterOnlyPerms = ['fullCMSAccess', 'apiCredentials', 'masterSettings', 'calculatorSettings']
    
    if (!masterMode && masterOnlyPerms.includes(key)) {
      alert('Only Master Account can modify this permission')
      return
    }

    const newPermissions = {
      ...kathyPermissions,
      [key]: !kathyPermissions[key],
    }

    setKathyPermissions(newPermissions)

    // Save to database
    await supabase
      .from('users')
      .update({ permissions: newPermissions })
      .eq('username', 'admin')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy-700">User Permissions</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-600">Master Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={masterMode}
                onChange={(e) => setMasterMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-600"></div>
            </label>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-navy-600 to-navy-800 text-white mb-8 p-6">
          <h2 className="text-2xl font-bold mb-2">Kathy Ferguson (admin)</h2>
          <p className="text-gold-400">Administrator Account</p>
          <div className="mt-4 flex space-x-4 text-sm">
            <span>📧 kathy@costseg.tax</span>
            <span>📞 (225) 247-2890</span>
          </div>
        </div>

        {permissionGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="card bg-white mb-6">
            <h3 className="text-xl font-bold text-navy-700 mb-4">{group.title}</h3>
            <div className="space-y-3">
              {group.permissions.map((permission) => (
                <div
                  key={permission.key}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-navy-700">{permission.label}</h4>
                      {['fullCMSAccess', 'apiCredentials', 'masterSettings', 'calculatorSettings'].includes(permission.key) && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          Master Only
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{permission.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={kathyPermissions[permission.key]}
                      onChange={() => togglePermission(permission.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card bg-gold-50 p-6">
          <h3 className="font-bold text-navy-700 mb-2">💡 Permission Tips</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• <strong>Master Only</strong> permissions cannot be delegated to other users</li>
            <li>• Changes take effect immediately upon saving</li>
            <li>• Master Account always has full system access</li>
            <li>• Kathy can manage employees but cannot change their permissions without Master approval</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
