import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function Header() {
  const router = useRouter()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Calculator', href: '/calculator' },
    { name: 'R&D Credit', href: '/rd-credit' },
    { name: 'Partnerships', href: '/partnerships' },
    { name: 'Referrals', href: '/referrals' },
    { name: 'Content', href: '/content' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-serif font-bold text-navy-700"
            >
              Kashflow <span className="text-gold-500">Kathy</span>
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  router.pathname === item.href
                    ? 'text-navy-700'
                    : 'text-slate-600 hover:text-navy-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/schedule" className="btn-primary text-sm">
              Book a Call
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
