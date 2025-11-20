import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'

export default function Schedule() {
  const [selectedTime, setSelectedTime] = useState(null)

  const openZoomLink = () => {
    // Zoom deep link - would be configured with actual Zoom meeting details
    const zoomLink = `zoommtg://zoom.us/join?confno=YOUR_MEETING_ID&pwd=YOUR_PASSWORD`
    window.location.href = zoomLink
  }

  return (
    <MainLayout title="Schedule a Call - Kashflow Kathy">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="mb-6">Schedule Your Free Consultation</h1>
            <p className="text-xl text-slate-600">
              Let's discuss how cost segregation can benefit your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-navy-700">
                What to Expect
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">1</span>
                  <div>
                    <h4 className="font-semibold mb-1">Property Discussion</h4>
                    <p className="text-sm text-slate-600">
                      We'll review your property details and tax situation
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">2</span>
                  <div>
                    <h4 className="font-semibold mb-1">Savings Analysis</h4>
                    <p className="text-sm text-slate-600">
                      I'll provide a preliminary estimate of your potential savings
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-500 text-2xl mr-3">3</span>
                  <div>
                    <h4 className="font-semibold mb-1">Next Steps</h4>
                    <p className="text-sm text-slate-600">
                      We'll outline the process and timeline if you'd like to proceed
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 p-4 bg-gold-50 rounded-lg">
                <p className="text-sm text-center text-slate-700">
                  <strong>Duration:</strong> 30 minutes<br />
                  <strong>Cost:</strong> Completely free, no obligation
                </p>
              </div>
            </div>

            <div className="card bg-slate-50">
              <h3 className="text-2xl font-bold mb-6 text-navy-700">
                Book Your Call
              </h3>
              
              {/* In production, this would integrate with Calendly or similar */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Your Name
                  </label>
                  <input type="text" className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Email
                  </label>
                  <input type="email" className="input-field" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Phone
                  </label>
                  <input type="tel" className="input-field" placeholder="(225) 247-2890" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Preferred Date
                  </label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Preferred Time
                  </label>
                  <select className="input-field">
                    <option>9:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>1:00 PM - 2:00 PM</option>
                    <option>2:00 PM - 3:00 PM</option>
                    <option>3:00 PM - 4:00 PM</option>
                    <option>4:00 PM - 5:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Brief Description of Your Property
                  </label>
                  <textarea className="input-field resize-none" rows={3} />
                </div>

                <button className="btn-primary w-full text-lg">
                  Schedule Call
                </button>

                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-3">Or join immediately via Zoom:</p>
                  <button
                    onClick={openZoomLink}
                    className="btn-outline w-full"
                  >
                    🎥 Launch Zoom Call
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 card bg-navy-700 text-white text-center p-8">
            <h3 className="text-white text-2xl mb-4">
              Prefer to Call or Email?
            </h3>
            <div className="flex flex-col md:flex-row justify-center gap-6 text-lg">
              <a href="tel:225-247-2890" className="text-gold-400 hover:text-gold-500">
                📞 (225) 247-2890
              </a>
              <a href="mailto:kathy@costseg.tax" className="text-gold-400 hover:text-gold-500">
                📧 kathy@costseg.tax
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  )
}
