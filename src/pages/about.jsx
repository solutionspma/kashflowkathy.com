import React from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import kathyData from '@/../../data/kathy.json'

export default function About() {
  return (
    <MainLayout title="About Kathy Ferguson - Kashflow Kathy">
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="mb-6">About Kathy Ferguson</h1>
            <p className="text-xl text-slate-600">
              Your trusted partner in tax savings and business growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="aspect-square bg-gradient-to-br from-navy-600 to-navy-800 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-8xl mb-4">👩‍💼</div>
                  <h3 className="text-3xl font-bold mb-2">{kathyData.profile.name}</h3>
                  <p className="text-gold-400 text-lg">{kathyData.profile.title}</p>
                  <div className="mt-6 space-y-2 text-sm">
                    <p>📧 {kathyData.profile.email}</p>
                    <p>📞 {kathyData.profile.phone}</p>
                    <p>📍 {kathyData.profile.region}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl mb-4">My Mission</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {kathyData.profile.description}
                </p>
              </div>

              <div>
                <h3 className="text-2xl mb-3">What I Do</h3>
                <p className="text-slate-700">
                  I partner with property owners, real estate investors, and business leaders across the Louisiana and Gulf Coast region to uncover tax savings they didn't know existed. Through strategic cost segregation studies and R&D tax credit consulting, I help my clients dramatically improve their cash flow and reinvest in what matters most—their business.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Specialties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl mb-8 text-center">Areas of Expertise</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {kathyData.profile.specialties.map((specialty, index) => (
                <div key={index} className="card text-center">
                  <div className="text-4xl mb-3">⭐</div>
                  <h4 className="font-semibold text-navy-700">{specialty}</h4>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why Work With Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-br from-navy-50 to-gold-50"
          >
            <h2 className="text-3xl mb-6 text-center">Why Work With Me?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-navy-700 mb-2">✓ Personalized Service</h4>
                <p className="text-slate-700">
                  You're not just a number. I take the time to understand your unique situation and craft customized solutions.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-navy-700 mb-2">✓ Proven Results</h4>
                <p className="text-slate-700">
                  My clients have saved millions in taxes through strategic cost segregation and R&D credits.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-navy-700 mb-2">✓ Local Expertise</h4>
                <p className="text-slate-700">
                  Deep understanding of Louisiana tax landscape and regional property markets.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-navy-700 mb-2">✓ No-Risk Analysis</h4>
                <p className="text-slate-700">
                  Start with a completely free cost segregation analysis—no strings attached.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  )
}
