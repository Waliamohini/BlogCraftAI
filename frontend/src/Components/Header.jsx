"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Header = () => {
  const [email, setEmail] = useState("");
  const inputRef = useRef();
  const company = typeof window !== 'undefined' ? localStorage.getItem("company") || "" : "";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("company", company);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      const response = await axios.post(`${baseURL}/api/email`, formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
        inputRef.current.value = '';
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (error) {
      toast.error("Error occurred while subscribing");
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0f1117]">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-32 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-400 text-xs font-semibold tracking-wide">AI-Powered Blog Publishing</span>
        </div>

        {/* Heading — solid white, no gradient clash */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          Publish smarter,
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            grow faster.
          </span>
        </h1>

        {/* Subheading */}
        <p className="max-w-xl mx-auto text-lg text-white/50 leading-relaxed mb-10">
          BlogCraft AI helps companies create, manage, and publish high-quality blog content at scale — powered by AI.
        </p>

        {/* Subscribe form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex items-center max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:bg-white/8 transition-all duration-300 shadow-lg"
        >
          <input
            ref={inputRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3.5 bg-transparent text-white placeholder-white/30 text-sm outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Subscribe
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </form>

        {email && (
          <button
            onClick={() => { setEmail(''); inputRef.current.value = ''; }}
            className="mt-3 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Clear
          </button>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-white/5">
          {[
            { value: '500+', label: 'Companies' },
            { value: '12M+', label: 'Readers' },
            { value: '98%', label: 'Satisfaction' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
