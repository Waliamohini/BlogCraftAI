'use client'
import React from 'react'
import NavbarNew from '@/Components/NavbarNew'
import Footer from '@/Components/Footer'
import { useRouter } from 'next/navigation'

const values = [
  {
    title: 'AI-Powered',
    description: 'Generate high-quality blog content in seconds using state-of-the-art AI — no writer\'s block, no delays.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Multi-Company',
    description: 'Built for agencies and enterprises — manage multiple brands and publishing workflows from one platform.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Analytics-First',
    description: 'Track views, subscriber engagement, and content performance with built-in analytics and AI insights.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Scalable',
    description: 'From a single blog to hundreds of posts — BlogCraft AI scales with your content ambitions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'SEO-Ready',
    description: 'Every post is structured for search engines — schema markup, meta tags, and slug generation built in.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Secure',
    description: 'Role-based access control, company-scoped data isolation, and JWT authentication keep your content safe.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

export default function AboutUs() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <NavbarNew />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-br from-[#0f1117] via-[#1a1f2e] to-[#0f1117]">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            About BlogCraft AI
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            AI-powered blogging,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              built for teams.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            BlogCraft AI is a multi-company blog publishing platform that combines AI content generation, analytics, and subscriber management — so your team can focus on strategy, not production.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push('/request-for-company')}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
            >
              Request Access
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-7 py-3 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-semibold rounded-xl border border-white/10 transition-all"
            >
              Read Our Blog
            </button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
                Make great content creation effortless.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Most companies know content marketing works — but producing consistent, high-quality blog posts is slow, expensive, and hard to scale. Writers get blocked, deadlines slip, and SEO suffers.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                BlogCraft AI changes that. Our platform lets companies generate, edit, and publish AI-assisted blog content in minutes — with built-in analytics to understand what's working and AI recommendations to keep improving.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're a single company or an agency managing dozens of brands, BlogCraft AI gives every team the tools to publish smarter and grow faster.
              </p>
            </div>

            {/* Feature card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0f1117] to-[#1a1f2e] rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">BlogCraft AI</p>
                    <p className="text-white/40 text-xs">AI-Powered Blog Publishing</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'AI Content Generation', pct: 98 },
                    { label: 'SEO Optimisation',      pct: 92 },
                    { label: 'Analytics Coverage',    pct: 95 },
                    { label: 'Multi-Company Support', pct: 100 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/70">{item.label}</span>
                        <span className="text-indigo-400 font-semibold">{item.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-indigo-100 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">What We Built</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Everything your content team needs.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 flex items-center justify-center text-indigo-600 group-hover:text-white transition-colors mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0f1117] via-[#1a1f2e] to-[#0f1117] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to publish smarter?
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Request access for your company and start publishing AI-assisted blog content in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push('/request-for-company')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
            >
              Request Platform Access
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-semibold rounded-xl border border-white/10 transition-all"
            >
              Already approved? Sign up
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
