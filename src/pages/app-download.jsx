import React from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'

export default function AppDownload() {
  return (
    <MainLayout title="Mobile App - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="mb-6">Kashflow Kathy Mobile App</h1>
            <p className="text-xl text-slate-600">
              Manage leads, schedule calls, and grow your business on the go
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h2 className="mb-6">Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">📱</span>
                  <div>
                    <h4 className="font-bold mb-1">Contact Management</h4>
                    <p className="text-slate-600">Sync and manage all your leads in one place</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">📞</span>
                  <div>
                    <h4 className="font-bold mb-1">Integrated Calling & SMS</h4>
                    <p className="text-slate-600">Make calls and send texts directly from the app</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">📊</span>
                  <div>
                    <h4 className="font-bold mb-1">Pipeline Tracking</h4>
                    <p className="text-slate-600">View and update deal stages on the go</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">🔔</span>
                  <div>
                    <h4 className="font-bold mb-1">Smart Notifications</h4>
                    <p className="text-slate-600">Never miss a follow-up or important lead</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">🤖</span>
                  <div>
                    <h4 className="font-bold mb-1">AI Recommendations</h4>
                    <p className="text-slate-600">Get suggested actions and follow-ups</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="order-1 md:order-2">
              <div className="aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-navy-700 to-navy-900 rounded-3xl shadow-2xl p-6 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl mb-6">📱</div>
                  <h3 className="text-2xl font-bold mb-4">Kashflow Kathy</h3>
                  <p className="text-gold-400">CRM on the Go</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-slate-50 text-center p-12">
            <h2 className="mb-6">Download the App</h2>
            <p className="text-lg text-slate-600 mb-8">
              Available for iOS and Android
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg flex items-center justify-center gap-2">
                <span className="text-2xl"></span>
                App Store
              </button>
              <button className="btn-primary text-lg flex items-center justify-center gap-2">
                <span className="text-2xl">📱</span>
                Google Play
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Coming Soon • Sign up to be notified at launch
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="card text-center">
              <div className="text-4xl mb-3">🔐</div>
              <h4 className="font-bold mb-2">Secure</h4>
              <p className="text-sm text-slate-600">
                Bank-level encryption protects your data
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h4 className="font-bold mb-2">Real-time Sync</h4>
              <p className="text-sm text-slate-600">
                All changes sync instantly across devices
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-3">📴</div>
              <h4 className="font-bold mb-2">Offline Mode</h4>
              <p className="text-sm text-slate-600">
                Access contacts even without internet
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  )
}
