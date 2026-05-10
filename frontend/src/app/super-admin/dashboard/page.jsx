"use client";
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0, comments: 0, drafts: 0, recentBlogs: [], companyBlogCounts: {}
  })
  const [approvedCompanies, setApprovedCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const { axios } = useAppContext()

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get(`${baseURL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) setDashboardData(data.dashboardData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchApprovedCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${baseURL}/api/super-admin/getRequests`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = res.data
      const list = Array.isArray(data) ? data : (data.data || [])
      setApprovedCompanies(list.filter(c => c.status === 'approved'))
    } catch {
      setApprovedCompanies([])
    }
  }

  useEffect(() => {
    fetchDashboard()
    fetchApprovedCompanies()
  }, [])

  const selectedBlogCount = selectedCompany
    ? (dashboardData.companyBlogCounts?.[selectedCompany] || 0)
    : dashboardData.blogs

  const totalBlogs = Object.values(dashboardData.companyBlogCounts || {}).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Super Admin</p>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Platform-wide overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Approved Companies</p>
            <p className="text-4xl font-bold text-white">{approvedCompanies.length}</p>
            <p className="text-white/30 text-xs mt-2">Active publishers on the platform</p>
          </div>
          <div className="bg-white/5 border border-indigo-500/20 rounded-xl p-6">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Total Blogs</p>
            <p className="text-4xl font-bold text-indigo-400">{totalBlogs}</p>
            <p className="text-white/30 text-xs mt-2">Across all companies</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Comments</p>
            <p className="text-4xl font-bold text-white">{dashboardData.comments}</p>
            <p className="text-white/30 text-xs mt-2">Total reader comments</p>
          </div>
        </div>

        {/* Company breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Company selector */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Blog Count by Company</h2>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Select Company
              </label>
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="" className="bg-[#1a1f2e]">All companies</option>
                {approvedCompanies.map(c => (
                  <option key={c._id} value={c.company} className="bg-[#1a1f2e]">{c.company}</option>
                ))}
              </select>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-white/60">{selectedCompany || 'All companies'}</span>
              <span className="text-2xl font-bold text-indigo-400">{selectedBlogCount}</span>
            </div>
          </div>

          {/* Approved companies list */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">
              Approved Companies
              <span className="ml-2 text-xs font-normal text-white/30">({approvedCompanies.length})</span>
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {approvedCompanies.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-6">No approved companies yet</p>
              ) : approvedCompanies.map(c => (
                <div key={c._id} className="flex items-center justify-between px-3 py-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{c.company}</p>
                    <p className="text-xs text-white/30">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">
                      {dashboardData.companyBlogCounts?.[c.company] || 0} posts
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-[10px] font-semibold text-emerald-400">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
