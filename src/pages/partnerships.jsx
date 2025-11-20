import React from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import ContactForm from '@/components/ContactForm'

export default function Partnerships() {
  const partnerBenefits = [
    {
      title: 'CPAs & Accounting Firms',
      icon: '🧮',
      benefits: [
        'Expand service offerings to clients',
        'Generate additional revenue streams',
        'Strengthen client relationships',
        'White-label options available',
        'Referral commissions',
      ],
    },
    {
      title: 'Real Estate Professionals',
      icon: '🏠',
      benefits: [
        'Add value to property transactions',
        'Help clients maximize ROI',
        'Strengthen your market position',
        'Co-marketing opportunities',
        'Generous referral fees',
      ],
    },
    {
      title: 'Financial Advisors',
      icon: '💼',
      benefits: [
        'Comprehensive tax planning for clients',
        'Increase assets under management',
        'Differentiate your practice',
        'Collaborative client service',
        'Revenue sharing options',
      ],
    },
    {
      title: 'Business Consultants',
      icon: '📊',
      benefits: [
        'Add tax strategy to your toolkit',
        'Help clients improve cash flow',
        'Expand your service portfolio',
        'Joint venture opportunities',
        'Partnership agreements',
      ],
    },
  ]

  return (
    <MainLayout title="Partnerships - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6">Strategic Partnerships</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join forces to deliver exceptional value to your clients while growing your business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {partnerBenefits.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="text-6xl mb-4">{partner.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-navy-700">{partner.title}</h3>
              <ul className="space-y-3">
                {partner.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-gold-500 mr-2 mt-1">✓</span>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-gradient-to-br from-navy-700 to-navy-900 text-white mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gold-400 mb-2">10%</div>
              <p className="text-slate-300">Referral Commission</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gold-400 mb-2">100%</div>
              <p className="text-slate-300">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gold-400 mb-2">∞</div>
              <p className="text-slate-300">Growth Potential</p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="mb-4">Become a Partner</h2>
            <p className="text-lg text-slate-600">
              Let's discuss how we can work together to serve your clients better
            </p>
          </div>
          <ContactForm source="partnerships" />
        </div>
      </section>
    </MainLayout>
  )
}
