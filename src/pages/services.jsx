import React from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'

const services = [
  {
    title: 'Cost Segregation Studies',
    icon: '🏢',
    description: 'Accelerate depreciation and reduce current-year tax liability through detailed property analysis.',
    benefits: [
      'Immediate cash flow improvement',
      'Increased depreciation deductions',
      'Reduced tax burden',
      'IRS-compliant engineering analysis',
      'Retroactive studies available',
    ],
    idealFor: ['Commercial property owners', 'Real estate investors', 'Property developers', 'Business owners with facilities'],
  },
  {
    title: 'R&D Tax Credits',
    icon: '🔬',
    description: 'Identify and claim valuable research and development tax credits for qualifying business activities.',
    benefits: [
      'Dollar-for-dollar tax reduction',
      'Payroll tax offset available',
      'Retroactive claims (3 years)',
      'No repayment required',
      'Available for many industries',
    ],
    idealFor: ['Manufacturing companies', 'Software developers', 'Engineering firms', 'Product innovators'],
  },
  {
    title: 'Bonus Depreciation Strategy',
    icon: '📈',
    description: 'Maximize 100% bonus depreciation opportunities returning in 2025 for massive tax savings.',
    benefits: [
      '100% first-year deduction',
      'Applies to new and used property',
      'Significant cash flow boost',
      'Strategic tax planning',
      'Immediate write-offs',
    ],
    idealFor: ['Recent property buyers', 'Equipment purchasers', 'Business expansions', '2025 investors'],
  },
  {
    title: 'Tax Compliance Consulting',
    icon: '✅',
    description: 'Stay compliant with changing tax laws while optimizing your tax position.',
    benefits: [
      'Expert guidance on tax changes',
      'Audit support',
      'Documentation assistance',
      'Strategic tax planning',
      'Peace of mind',
    ],
    idealFor: ['All business owners', 'Property investors', 'Growing companies', 'High-net-worth individuals'],
  },
]

export default function Services() {
  return (
    <MainLayout title="Services - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6">Tax-Saving Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive solutions designed to keep more money in your business
          </p>
        </motion.div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-6xl mb-4">{service.icon}</div>
                  <h2 className="text-3xl mb-4">{service.title}</h2>
                  <p className="text-lg text-slate-700 mb-6">{service.description}</p>
                  
                  <h3 className="font-bold text-navy-700 mb-3">Key Benefits:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gold-500 mr-2">✓</span>
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-bold text-navy-700 mb-4">Ideal For:</h3>
                  <ul className="space-y-3 mb-8">
                    {service.idealFor.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-navy-600 rounded-full mr-3"></span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <Link href="/calculator" className="btn-primary w-full block text-center">
                      Calculate Savings
                    </Link>
                    <Link href="/schedule" className="btn-outline w-full block text-center">
                      Schedule Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 card bg-gradient-to-br from-navy-700 to-navy-900 text-white text-center p-12"
        >
          <h2 className="text-white mb-4">Ready to Unlock Your Tax Savings?</h2>
          <p className="text-xl text-gold-400 mb-8">
            Get a free analysis and discover how much you could be saving
          </p>
          <Link href="/calculator" className="btn-secondary inline-block">
            Start Free Analysis
          </Link>
        </motion.div>
      </section>
    </MainLayout>
  )
}
