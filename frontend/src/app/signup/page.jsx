"use client";
import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'warning'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus(null);
      const res = await axios.post(
        `${baseURL}/api/admin/signUp`,
        { company, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setStatus("success");
        setMessage(res.data.message || "Account created successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else if (res.data.warning) {
        setStatus("warning");
        setMessage(res.data.warning);
      } else {
        setStatus("error");
        setMessage(res.data.message || res.data.error || "Signup failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f1117] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">BlogCraft.ai</span>
        </div>

        {/* Steps */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-8">
            Get started in<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              three simple steps.
            </span>
          </h2>
          <div className="space-y-5">
            {[
              { step: '01', title: 'Request company access', desc: 'Submit your company details for super admin approval.' },
              { step: '02', title: 'Create your account', desc: 'Once approved, sign up with your company email.' },
              { step: '03', title: 'Start publishing', desc: 'Use AI to generate and publish blog content instantly.' },
            ].map((item) => (
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

        <div className="relative z-10 border-l-2 border-violet-500/40 pl-4">
          <p className="text-white/40 text-xs italic leading-relaxed">
            "Onboarding took less than 5 minutes. We were publishing AI-assisted blogs the same day."
          </p>
          <p className="text-white/30 text-xs mt-2">— Marketing Manager, B2B Tech firm</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800 text-sm">BlogCraft.ai</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Your company must be approved before signing up</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Company Name
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  type="text"
                  required
                  placeholder="Your approved company name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition bg-gray-50/50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {status && (
                <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm border ${
                  status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-red-50 text-red-700 border-red-100'
                }`}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {status === 'success'
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    }
                  </svg>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 shadow-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
          </div>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
            </p>
            <p className="text-xs text-gray-400">
              Company not approved yet?{" "}
              <Link href="/request-for-company" className="text-indigo-600 hover:underline font-medium">Request access</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
