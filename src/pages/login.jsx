import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import MainLayout from '@/layouts/MainLayout'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple hardcoded login for now (replace with Supabase auth later)
    if (credentials.username === 'admin' && credentials.password === 'kathy2025') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'admin')
      localStorage.setItem('username', 'admin')
      router.push('/crm/dashboard')
    } else if (credentials.username === 'master' && credentials.password === 'pitch2025') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'masteracct')
      localStorage.setItem('username', 'master')
      router.push('/crm/dashboard')
    } else {
      setError('Invalid username or password')
    }
    
    setLoading(false)
  }

  return (
    <MainLayout title="Login - Kashflow Kathy">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-center text-3xl font-bold text-navy-900">
              Sign in to Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Access your CRM and CMS
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-navy-900 hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center text-sm text-slate-600 space-y-1">
              <p><strong>Admin Login:</strong> admin / kathy2025</p>
              <p><strong>Master Login:</strong> master / pitch2025</p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
