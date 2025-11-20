import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import { supabase } from '@/lib/supabase'

export default function Calculator() {
  const [formData, setFormData] = useState({
    propertyType: 'commercial',
    propertyCost: '',
    dateInService: '',
    taxFilingYear: new Date().getFullYear(),
    bonusDepreciationPercent: 100,
    name: '',
    email: '',
    phone: '',
  })

  const [results, setResults] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const calculateSavings = () => {
    const cost = parseFloat(formData.propertyCost)
    if (!cost || cost <= 0) {
      alert('Please enter a valid property cost')
      return
    }

    // Simplified calculation - actual would be more complex
    const typicalCostSegPercentage = 0.25 // 25% of building can typically be accelerated
    const acceleratedAmount = cost * typicalCostSegPercentage
    const bonusMultiplier = formData.bonusDepreciationPercent / 100
    const firstYearDeduction = acceleratedAmount * bonusMultiplier
    const taxSavings = firstYearDeduction * 0.37 // Assuming 37% tax bracket

    setResults({
      propertyCost: cost,
      acceleratedDepreciation: acceleratedAmount,
      bonusDepreciation: firstYearDeduction,
      estimatedTaxSavings: taxSavings,
      yearOneSavings: taxSavings,
      fiveYearSavings: taxSavings * 1.5, // Rough estimate
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    calculateSavings()

    // Save to CRM
    try {
      await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          property_type: formData.propertyType,
          property_cost: parseFloat(formData.propertyCost),
          lead_source: 'calculator',
          status: 'warm',
          pipeline_stage: 'qualified',
          tags: ['calculator-lead', 'high-intent'],
          notes: `Calculator results: Estimated savings $${results?.estimatedTaxSavings.toLocaleString()}`,
        },
      ])
      setSubmitted(true)
    } catch (error) {
      console.error('Error saving lead:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <MainLayout title="Cost Segregation Calculator - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="mb-6">Cost Segregation Calculator</h1>
            <p className="text-xl text-slate-600">
              Estimate your potential tax savings in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="commercial">Commercial</option>
                  <option value="residential-rental">Residential Rental</option>
                  <option value="industrial">Industrial</option>
                  <option value="retail">Retail</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="mixed-use">Mixed Use</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Property Cost ($)
                </label>
                <input
                  type="number"
                  name="propertyCost"
                  value={formData.propertyCost}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="1000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Date Placed in Service
                </label>
                <input
                  type="date"
                  name="dateInService"
                  value={formData.dateInService}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Tax Filing Year
                </label>
                <input
                  type="number"
                  name="taxFilingYear"
                  value={formData.taxFilingYear}
                  onChange={handleChange}
                  className="input-field"
                  min="2020"
                  max="2030"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Bonus Depreciation Percentage: {formData.bonusDepreciationPercent}%
                </label>
                <input
                  type="range"
                  name="bonusDepreciationPercent"
                  value={formData.bonusDepreciationPercent}
                  onChange={handleChange}
                  className="w-full"
                  min="0"
                  max="100"
                  step="10"
                />
                <p className="text-sm text-slate-600 mt-2">
                  100% bonus depreciation is back for 2025!
                </p>
              </div>
            </div>

            {!results && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4 text-navy-700">
                  Get Your Results
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your Name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Email"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Phone"
                    required
                  />
                </div>
              </div>
            )}

            {!results && (
              <button type="submit" className="btn-primary w-full text-lg">
                Calculate My Savings
              </button>
            )}
          </form>

          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 space-y-6"
            >
              <div className="card bg-gradient-to-br from-navy-700 to-navy-900 text-white text-center p-12">
                <h2 className="text-white mb-4">Your Estimated Tax Savings</h2>
                <div className="text-6xl font-bold text-gold-400 mb-2">
                  ${results.estimatedTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xl text-slate-300">in first-year tax savings</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">Property Cost</h4>
                  <p className="text-2xl font-bold text-navy-700">
                    ${results.propertyCost.toLocaleString()}
                  </p>
                </div>
                <div className="card text-center">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">Accelerated Depreciation</h4>
                  <p className="text-2xl font-bold text-navy-700">
                    ${results.acceleratedDepreciation.toLocaleString()}
                  </p>
                </div>
                <div className="card text-center">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">5-Year Savings Potential</h4>
                  <p className="text-2xl font-bold text-navy-700">
                    ${results.fiveYearSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              <div className="card bg-gold-50 text-center p-8">
                <h3 className="text-2xl font-bold text-navy-700 mb-4">
                  {submitted ? 'Thank You!' : 'Want a Detailed Analysis?'}
                </h3>
                <p className="text-slate-700 mb-6">
                  {submitted
                    ? "I'll be in touch shortly to discuss your personalized cost segregation strategy."
                    : 'Get a comprehensive study tailored to your specific property.'}
                </p>
                {!submitted && (
                  <button onClick={() => setSubmitted(true)} className="btn-primary">
                    Request Full Analysis
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <div className="mt-12 card bg-slate-50">
            <h3 className="text-xl font-bold mb-4 text-navy-700">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">1️⃣</div>
                <h4 className="font-semibold mb-2">Property Analysis</h4>
                <p className="text-sm text-slate-600">We analyze your property components</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">2️⃣</div>
                <h4 className="font-semibold mb-2">Asset Reclassification</h4>
                <p className="text-sm text-slate-600">Identify accelerated depreciation assets</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">3️⃣</div>
                <h4 className="font-semibold mb-2">Tax Savings</h4>
                <p className="text-sm text-slate-600">Maximize deductions and reduce taxes</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">4️⃣</div>
                <h4 className="font-semibold mb-2">Cash Flow Boost</h4>
                <p className="text-sm text-slate-600">Reinvest savings into your business</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  )
}
