import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 font-sans">

        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-tight">BlogCraft AI</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            AI-powered blog publishing for companies that want to produce great content at scale.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Platform</h3>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li><a href="/" className="hover:text-indigo-600 transition-colors">Home</a></li>
            <li><a href="/About-us" className="hover:text-indigo-600 transition-colors">About</a></li>
            <li><a href="/request-for-company" className="hover:text-indigo-600 transition-colors">Request Access</a></li>
            <li><a href="/signup" className="hover:text-indigo-600 transition-colors">Sign Up</a></li>
            <li><a href="/login" className="hover:text-indigo-600 transition-colors">Admin Login</a></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact</h3>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li>
              <a href="mailto:contact@blogcraft.ai" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@blogcraft.ai
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/blogcraftai" target="_blank" rel="noopener noreferrer"
                className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 max-w-6xl mx-auto">
        <span>© 2025 BlogCraft AI. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-600 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
