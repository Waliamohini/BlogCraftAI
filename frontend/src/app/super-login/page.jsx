"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { baseURL } from "@/config/api";
import Link from "next/link";

const SuperLogin = () => {
  const { axios, setToken } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${baseURL}/api/super-admin/login`, { email, password });
      console.log("Login response:", data);
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", "super-admin");
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        router.push("/super-admin/dashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || error.message || "Network error — is the backend running?");
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
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">BlogCraft.ai</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mb-6">
            <svg className="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-rose-400 text-xs font-semibold tracking-wide">Super Admin Access</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Platform control.<br />
            <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
              Full visibility.
            </span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Manage company onboarding, review incoming requests, and monitor platform-wide content performance from one place.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { label: 'Company Requests', desc: 'Approve or reject' },
              { label: 'Platform Analytics', desc: 'Cross-company stats' },
              { label: 'Admin Management', desc: 'Oversee all admins' },
              { label: 'Content Oversight', desc: 'All published blogs' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs font-semibold">{item.label}</p>
                <p className="text-white/30 text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/30 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Restricted access — authorised personnel only
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-100 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span className="text-rose-600 text-xs font-semibold">Super Admin</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Login</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in with your super admin credentials</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  required
                  placeholder="admin@blogcraft.ai"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder-gray-400 transition bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder-gray-400 transition bg-gray-50/50"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 shadow-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In as Super Admin'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Admin login?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">Go here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperLogin;
