import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import { supabase } from '@/lib/supabase'

export default function RDCredit() {
  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    annualPayroll: '',
    employees: '',
    activities: [],
    name: '',
    email: '',
    phone: '',
  })

  const [results, setResults] = useState(null)

  const activities = [
    'Product development or improvement',
    'Process improvement or automation',
    'Software development',
    'New technology implementation',
    'Manufacturing optimization',
    'Quality improvement initiatives',
    'Engineering design work',
    'Prototype development',
  ]

  const handleActivityToggle = (activity) => {
    const current = formData.activities
    if (current.includes(activity)) {
      setFormData({ ...formData, activities: current.filter((a) => a !== activity) })
    } else {
      setFormData({ ...formData, activities: [...current, activity] })
    }
  }

  const calculateCredit = async (e) => {
    e.preventDefault()

    const payroll = parseFloat(formData.annualPayroll)
    const activityCount = formData.activities.length

    // Simplified calculation
    const eligibilityScore = (activityCount / activities.length) * 100
    const estimatedCredit = payroll * 0.07 * (activityCount / activities.length) // Up to 7% of payroll

    setResults({
      eligibilityScore,
      estimatedCredit,
      qualifyingActivities: formData.activities.length,
    })

    // Save to CRM
    try {
      await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          payroll: payroll,
          lead_source: 'rd-calculator',
          status: 'warm',
          pipeline_stage: 'qualified',
          tags: ['rd-credit', 'high-intent'],
          notes: `R&D Credit estimate: $${estimatedCredit.toLocaleString()} | Activities: ${formData.activities.join(', ')}`,
        },
      ])
    } catch (error) {
      console.error('Error saving lead:', error)
    }
  }

  return (
    <MainLayout title="R&D Tax Credit Calculator - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="mb-6">R&D Tax Credit Estimator</h1>
            <p className="text-xl text-slate-600">
              Discover if your business qualifies for valuable R&D tax credits
            </p>
          </div>

          <form onSubmit={calculateCredit} className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-6 text-navy-700">Company Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="number"
                  placeholder="Annual Payroll ($)"
                  value={formData.annualPayroll}
                  onChange={(e) => setFormData({ ...formData, annualPayroll: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="number"
                  placeholder="Number of Employees"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-navy-700">
                Qualifying Activities
              </h3>
              <p className="text-slate-600 mb-6">
                Select all activities your company performs:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {activities.map((activity, index) => (
                  <label
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border-2 border-slate-200 hover:border-navy-500 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.activities.includes(activity)}
                      onChange={() => handleActivityToggle(activity)}
                      className="mt-1"
                    />
                    <span className="text-slate-700">{activity}</span>
                  </label>
                ))}
              </div>
            </div>

            {!results && (
              <div className="card bg-slate-50">
                <h3 className="text-lg font-bold mb-4 text-navy-700">
                  Get Your Estimate
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            {!results && (
              <button type="submit" className="btn-primary w-full text-lg">
                Calculate R&D Credit
              </button>
            )}
          </form>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              <div className="card bg-gradient-to-br from-navy-700 to-navy-900 text-white text-center p-12">
                <h2 className="text-white mb-4">Estimated R&D Tax Credit</h2>
                <div className="text-6xl font-bold text-gold-400 mb-2">
                  ${results.estimatedCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xl text-slate-300">potential annual credit</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">Eligibility Score</h4>
                  <p className="text-3xl font-bold text-navy-700">
                    {results.eligibilityScore.toFixed(0)}%
                  </p>
                </div>
                <div className="card text-center">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">Qualifying Activities</h4>
                  <p className="text-3xl font-bold text-navy-700">
                    {results.qualifyingActivities}/{activities.length}
                  </p>
                </div>
                <div className="card text-center">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">Retroactive Potential</h4>
                  <p className="text-3xl font-bold text-navy-700">
                    3 Years
                  </p>
                </div>
              </div>

              <div className="card bg-gold-50 p-8 text-center">
                <h3 className="text-2xl font-bold text-navy-700 mb-4">
                  Great News! You May Qualify
                </h3>
                <p className="text-slate-700 mb-6">
                  Based on your inputs, your company shows strong potential for R&D tax credits. Let's discuss how to maximize your claim.
                </p>
                <a href="/schedule" className="btn-primary">
                  Schedule Free Consultation
                </a>
              </div>
            </motion.div>
          )}

          <div className="mt-12 card">
            <h3 className="text-2xl font-bold mb-6 text-navy-700">About R&D Tax Credits</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-navy-600 mb-3">What Qualifies?</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✓ Developing new products or processes</li>
                  <li>✓ Improving existing products</li>
                  <li>✓ Software development</li>
                  <li>✓ Engineering design work</li>
                  <li>✓ Quality improvements</li>
                  <li>✓ Process automation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-navy-600 mb-3">Key Benefits</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>💰 Dollar-for-dollar tax reduction</li>
                  <li>📉 Can offset payroll taxes</li>
                  <li>⏮️ Retroactive claims (3 years)</li>
                  <li>🔄 Recurring annual credit</li>
                  <li>✅ No repayment required</li>
                  <li>🏢 Available to most industries</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  )
}
