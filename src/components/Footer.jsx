import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              Kashflow <span className="text-gold-500">Kathy</span>
            </h3>
            <p className="text-slate-400 text-sm">
              Your trusted partner in cost segregation and R&D tax credits.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-gold-500">About</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-gold-500">Services</Link></li>
              <li><Link href="/calculator" className="text-slate-400 hover:text-gold-500">Calculator</Link></li>
              <li><Link href="/rd-credit" className="text-slate-400 hover:text-gold-500">R&D Credit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/content" className="text-slate-400 hover:text-gold-500">Content Hub</Link></li>
              <li><Link href="/partnerships" className="text-slate-400 hover:text-gold-500">Partnerships</Link></li>
              <li><Link href="/referrals" className="text-slate-400 hover:text-gold-500">Referrals</Link></li>
              <li><Link href="/app-download" className="text-slate-400 hover:text-gold-500">Mobile App</Link></li>
              <li><Link href="/login" className="text-gold-400 hover:text-gold-300 font-semibold">🔐 Client Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: kathy@costseg.tax</li>
              <li>Phone: (225) 247-2890</li>
              <li>Region: Louisiana & Gulf Coast</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p className="logo-text-light">&copy; 2025 Kashflow Kathy. All rights reserved.</p>
          <p className="mt-2">Powered by Pitch Market Strategies & Public Relations LLC</p>
        </div>
      </div>
    </footer>
  )
}
