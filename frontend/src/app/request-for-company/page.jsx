'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { baseURL } from '@/config/api'

const businessTypes = [
  'Technology', 'Healthcare', 'Finance', 'Education',
  'Retail', 'Manufacturing', 'Consulting', 'Real Estate', 'Other',
]

export default function RequestAccess() {
  const router = useRouter()

  const [formData, setFormData] = useState({ fullname: '', company: '', email: '', businessType: '' })
  const [errors, setErrors]     = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.fullname.trim())    e.fullname     = 'Full name is required'
    if (!formData.company.trim())     e.company      = 'Company name is required'
    if (!formData.businessType)       e.businessType = 'Business type is required'
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim())       e.email = 'Email is required'
    else if (!emailRe.test(formData.email)) e.email = 'Enter a valid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const res = await axios.post(
        `${baseURL}/api/blog/request`,
        formData,
        { headers: { 'Content-Type': 'application/json' } },
      )
      if (res.data.success) {
        setSubmitted(true)
        setFormData({ fullname: '', company: '', email: '', businessType: '' })
      } else {
        setErrors({ api: res.data.message || 'Registration failed' })
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.'
      setErrors({ api: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0f1117]">
      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">BlogCraft.ai</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start publishing<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              with AI today.
            </span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-10">
            Submit your company details for super admin review. Once approved, you can create your account and start publishing AI-assisted blog content instantly.
          </p>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Request access', desc: 'Fill in your company details below.' },
              { step: '02', title: 'Get approved',   desc: 'Super admin reviews and approves your request.' },
              { step: '03', title: 'Create account', desc: 'Sign up and start publishing immediately.' },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2 py-1 flex-shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <p className="text-white/80 text-sm font-semibold">{item.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Sign in</Link></p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-sm">BlogCraft.ai</span>
          </div>

          {submitted ? (
            /* Success state */
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Request Submitted</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Your company registration has been submitted. You'll be notified once a super admin reviews your request.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">Pending Approval</span>
              </div>
              <button
                onClick={() => router.push('/signup')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Go to Sign Up
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Request Company Access</h1>
                <p className="text-sm text-white/40 mt-1">Your request will be reviewed by a super admin</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text" name="fullname" value={formData.fullname} onChange={handleChange} required
                      placeholder="John Doe"
                      className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.fullname ? 'border-red-500/50' : 'border-white/10'}`}
                    />
                    {errors.fullname && <p className="mt-1 text-xs text-red-400">{errors.fullname}</p>}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Company Name</label>
                    <input
                      type="text" name="company" value={formData.company} onChange={handleChange} required
                      placeholder="Acme Corporation"
                      className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.company ? 'border-red-500/50' : 'border-white/10'}`}
                    />
                    {errors.company && <p className="mt-1 text-xs text-red-400">{errors.company}</p>}
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Business Type</label>
                    <select
                      name="businessType" value={formData.businessType} onChange={handleChange} required
                      className={`w-full px-4 py-2.5 bg-[#1a1f2e] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.businessType ? 'border-red-500/50 text-white/50' : 'border-white/10 text-white'} ${!formData.businessType ? 'text-white/30' : ''}`}
                    >
                      <option value="" disabled className="text-white/30 bg-[#1a1f2e]">Select business type</option>
                      {businessTypes.map(t => (
                        <option key={t} value={t} className="text-white bg-[#1a1f2e]">{t}</option>
                      ))}
                    </select>
                    {errors.businessType && <p className="mt-1 text-xs text-red-400">{errors.businessType}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="john@company.com"
                      className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  {errors.api && (
                    <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                      {errors.api}
                    </div>
                  )}

                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
                        </svg>
                        Submitting...
                      </>
                    ) : 'Submit Request'}
                  </button>
                </form>
              </div>

              <p className="text-center text-xs text-white/30 mt-6">
                Already approved?{' '}
                <Link href="/signup" className="text-indigo-400 hover:underline font-medium">Create your account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
