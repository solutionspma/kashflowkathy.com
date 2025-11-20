import React from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import ParticleBackground from '@/components/ParticleBackground'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'
import kathyData from '@/../../data/kathy.json'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Kashflow Kathy - Cost Segregation Specialist</title>
        <meta name="description" content="Expert cost segregation and R&D tax credit services" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Hero Section - FULL SCREEN NO NAV */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        
        {/* Persistent Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-sm border-b border-gold-400/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <Link href="/" className="text-gold-400 font-bold text-lg hover:text-gold-300 logo-text">
              Kashflow Kathy
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/services" className="text-white hover:text-gold-400 transition-colors">
                Services
              </Link>
              <Link href="/calculator" className="text-white hover:text-gold-400 transition-colors">
                Calculator
              </Link>
              <Link href="/about" className="text-white hover:text-gold-400 transition-colors">
                About
              </Link>
              <Link href="/schedule" className="px-4 py-2 bg-gold-400 text-navy-900 rounded-lg hover:bg-gold-500 font-semibold transition-all">
                Get Started →
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white mb-6">
              Unlock Hidden Tax Savings for Your Business
            </h1>
            <p className="text-xl md:text-2xl text-gold-400 mb-8 max-w-3xl mx-auto">
              Expert cost segregation studies and R&D tax credits that put more cash back in your pocket
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="btn-secondary text-lg">
                Estimate Your Savings
              </Link>
              <Link href="/schedule" className="btn-outline text-white border-white hover:bg-white hover:text-navy-900 text-lg">
                Book a Free Call
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="text-center">
            <div className="text-gold-400 text-sm font-semibold mb-2 animate-pulse">
              Scroll to explore
            </div>
            <div className="text-4xl text-gold-400 animate-bounce">
              ⬇️
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Kathy Section */}
      <section className="section-container bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-gold-400">
              <img 
                src="/images/kathy-ferguson-circular.png" 
                alt="Kathy Ferguson - Cost Segregation Specialist"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6">Meet Your Tax Savings Partner</h2>
            <p className="mb-4">
              {kathyData.profile.description}
            </p>
            <p className="mb-6">
              Serving the Louisiana and Gulf Coast region, I specialize in helping property owners and business owners keep more of their hard-earned money through strategic tax planning.
            </p>
            <Link href="/about" className="btn-primary">
              Learn More About Me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section-container bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="mb-4">Why Choose Cost Segregation?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform your property into a powerful tax-saving asset
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {kathyData.profile.value_propositions.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <div className="text-5xl mb-4">
                {index === 0 && '💰'}
                {index === 1 && '📉'}
                {index === 2 && '✓'}
                {index === 3 && '📊'}
              </div>
              <h3 className="text-xl font-bold mb-2">{value}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Highlight */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="mb-4">Services That Deliver Results</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {kathyData.profile.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="text-xl font-bold mb-3 text-navy-700">{service.name}</h3>
              <p className="text-slate-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-container bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="mb-4">Get Your Free Tax Analysis</h2>
            <p className="text-lg text-slate-600">
              Discover how much you could be saving. No cost, no obligation.
            </p>
          </div>
          <ContactForm source="homepage" />
        </div>
      </section>
      
      <Footer />
    </>
  )
}
