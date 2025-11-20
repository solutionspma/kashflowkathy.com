import React from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MainLayout({ children, title = 'Kashflow Kathy - Cost Segregation Specialist' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Expert cost segregation and R&D tax credit services to maximize your business cash flow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
