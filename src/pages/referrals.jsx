import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import { supabase } from '@/lib/supabase'

export default function Referrals() {
  const [formData, setFormData] = useState({
    referrerName: '',
    referrerEmail: '',
    referrerPhone: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    leadCompany: '',
    relationshipNotes: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Insert referral into database
      await supabase.from('referrals').insert([
        {
          referrer_name: formData.referrerName,
          referrer_email: formData.referrerEmail,
          referrer_phone: formData.referrerPhone,
          status: 'pending',
          commission_rate: 0.10,
        },
      ])

      // Insert lead into contacts
      await supabase.from('contacts').insert([
        {
          name: formData.leadName,
          email: formData.leadEmail,
          phone: formData.leadPhone,
          company: formData.leadCompany,
          notes: `Referred by: ${formData.referrerName}. ${formData.relationshipNotes}`,
          lead_source: 'referral',
          status: 'new',
          pipeline_stage: 'referral',
          tags: ['referral'],
        },
      ])

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting referral:', error)
      alert('There was an error. Please try again.')
    }
  }

  if (submitted) {
    return (
      <MainLayout title="Referrals - Kashflow Kathy">
        <section className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto card text-center p-12"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="mb-4">Thank You for the Referral!</h2>
            <p className="text-lg text-slate-600 mb-6">
              I'll reach out to your referral shortly. You'll receive 10% commission on any completed engagement.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-secondary"
            >
              Submit Another Referral
            </button>
          </motion.div>
        </section>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Referral Program - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6">Referral Program</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Earn 10% commission on every successful referral. Help your network save on taxes while earning passive income.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card text-center"
          >
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="text-xl font-bold mb-3">Refer Someone</h3>
            <p className="text-slate-600">
              Know a property owner or business that could benefit? Submit their info below.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-5xl mb-4">2️⃣</div>
            <h3 className="text-xl font-bold mb-3">We Close the Deal</h3>
            <p className="text-slate-600">
              I'll provide exceptional service and deliver real value to your referral.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-5xl mb-4">3️⃣</div>
            <h3 className="text-xl font-bold mb-3">You Get Paid</h3>
            <p className="text-slate-600">
              Receive 10% commission on the 15th of the following month.
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="card space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-navy-700">Your Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.referrerName}
                  onChange={(e) => setFormData({ ...formData, referrerName: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.referrerEmail}
                  onChange={(e) => setFormData({ ...formData, referrerEmail: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={formData.referrerPhone}
                  onChange={(e) => setFormData({ ...formData, referrerPhone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-navy-700">Referral Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Referral Name"
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Referral Email"
                  value={formData.leadEmail}
                  onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="tel"
                  placeholder="Referral Phone"
                  value={formData.leadPhone}
                  onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Company (Optional)"
                  value={formData.leadCompany}
                  onChange={(e) => setFormData({ ...formData, leadCompany: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="mt-4">
                <textarea
                  placeholder="Tell me about your referral and your relationship with them..."
                  value={formData.relationshipNotes}
                  onChange={(e) => setFormData({ ...formData, relationshipNotes: e.target.value })}
                  className="input-field resize-none"
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full text-lg">
              Submit Referral
            </button>
          </form>

          <div className="mt-12 card bg-gold-50">
            <h3 className="text-xl font-bold mb-4 text-navy-700">Commission Structure</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-navy-600 mb-2">Referral Commission</h4>
                <p className="text-3xl font-bold text-navy-700 mb-2">10%</p>
                <p className="text-sm text-slate-600">Of total project value</p>
              </div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-2">Payment Schedule</h4>
                <p className="text-3xl font-bold text-navy-700 mb-2">15th</p>
                <p className="text-sm text-slate-600">Of the following month</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
