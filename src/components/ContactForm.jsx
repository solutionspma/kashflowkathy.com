import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function ContactForm({ source = 'website' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    propertyType: '',
    propertyCost: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Insert into contacts table
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            property_type: formData.propertyType,
            property_cost: formData.propertyCost ? parseFloat(formData.propertyCost) : null,
            notes: formData.message,
            lead_source: source,
            status: 'new',
            pipeline_stage: 'inquiry',
            tags: ['website-lead'],
          },
        ])

      if (error) throw error

      // Send BCC email to Pitch Market
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.KATHY_CONTACT_EMAIL,
          bcc: process.env.PITCHMARKET_BCC_EMAIL,
          subject: `New Lead: ${formData.name}`,
          contact: formData,
        }),
      })

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        propertyType: '',
        propertyCost: '',
        message: '',
      })
    } catch (error) {
      console.error('Form submission error:', error)
      alert('There was an error submitting your form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center p-8"
      >
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-navy-700 mb-2">Thank You!</h3>
        <p className="text-slate-600">
          We've received your information. Kathy will reach out to you shortly.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="john@company.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="(225) 247-2890"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input-field"
            placeholder="Your Company LLC"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select type...</option>
            <option value="commercial">Commercial</option>
            <option value="residential-rental">Residential Rental</option>
            <option value="industrial">Industrial</option>
            <option value="retail">Retail</option>
            <option value="hospitality">Hospitality</option>
            <option value="mixed-use">Mixed Use</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            Property Cost
          </label>
          <input
            type="number"
            name="propertyCost"
            value={formData.propertyCost}
            onChange={handleChange}
            className="input-field"
            placeholder="500000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="input-field resize-none"
          placeholder="Tell us about your property and tax situation..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Get Free Analysis'}
      </button>
    </motion.form>
  )
}
