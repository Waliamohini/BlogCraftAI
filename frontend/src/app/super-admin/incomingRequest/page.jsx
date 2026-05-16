'use client'

import React, { useEffect, useState } from 'react'
import { baseURL } from '@/config/api'

const statusConfig = {
  pending:  { label: 'Pending',  dot: 'bg-amber-400',  badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  approved: { label: 'Approved', dot: 'bg-emerald-400', badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  rejected: { label: 'Rejected', dot: 'bg-red-400',     badge: 'bg-red-400/10 text-red-400 border-red-400/20' },
}

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

export default function SuperAdminPanel() {
  const [registrations, setRegistrations] = useState([])
  const [selected, setSelected]           = useState(null)
  const [filterStatus, setFilterStatus]   = useState('all')
  const [isProcessing, setIsProcessing]   = useState(false)
  const [showModal, setShowModal]         = useState(false)
  const [loading, setLoading]             = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch(`${baseURL}/api/super-admin/getRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setRegistrations(Array.isArray(data) ? data : data.data || [])
    } catch {
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRegistrations() }, [])

  const filtered = registrations.filter(r => filterStatus === 'all' || r.status === filterStatus)

  const formatDate = (d) => d ? new Date(d).toLocaleString() : '—'

  const handleDelete = async (id) => {
    if (!confirm('Delete this request?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseURL}/api/super-admin/deleteRequest/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.message === 'request deleted successfully') {
      setRegistrations(prev => prev.filter(r => (r._id || r.id) !== id))
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === 'rejected' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${baseURL}/api/super-admin/approveRequest/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus, rejectionReason }),
      })
      const data = await res.json()
      if (data.success) {
        await fetchRegistrations()
        setShowModal(false)
        setSelected(null)
        setRejectionReason('')
      } else {
        alert(data.message || 'Failed to update status')
      }
    } catch {
      alert('Error updating status. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const openModal = (reg) => {
    setSelected(reg)
    setRejectionReason('')
    setShowModal(true)
  }

  const counts = {
    total:    registrations.length,
    pending:  registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Super Admin</p>
          <h1 className="text-3xl font-bold text-white">Incoming Requests</h1>
          <p className="text-white/40 text-sm mt-1">Review and manage company registration requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',    value: counts.total,    color: 'text-white',        border: 'border-white/10' },
            { label: 'Pending',  value: counts.pending,  color: 'text-amber-400',    border: 'border-amber-400/20' },
            { label: 'Approved', value: counts.approved, color: 'text-emerald-400',  border: 'border-emerald-400/20' },
            { label: 'Rejected', value: counts.rejected, color: 'text-red-400',      border: 'border-red-400/20' },
          ].map(s => (
            <div key={s.label} className={`bg-white/5 border ${s.border} rounded-xl p-5`}>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-white/40 text-sm">Loading requests...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm">No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Company', 'Contact', 'Business Type', 'Status', 'Submitted', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(reg => (
                    <tr key={reg._id || reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{reg.company}</p>
                        <p className="text-xs text-white/40 mt-0.5">{reg.fullname}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{reg.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold">
                          {reg.businessType || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={reg.status} /></td>
                      <td className="px-6 py-4 text-xs text-white/40">{formatDate(reg.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openModal(reg)}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            Review
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            onClick={() => handleDelete(reg._id || reg.id)}
                            className="text-xs font-semibold text-red-400/70 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Registration Review</h2>
                <p className="text-xs text-white/40 mt-0.5">{selected.company}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Status row */}
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Current Status</span>
                <StatusBadge status={selected.status} />
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Personal</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/40">Name</span>
                      <span className="text-white font-medium">{selected.fullname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Email</span>
                      <span className="text-white font-medium text-xs">{selected.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Company</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/40">Name</span>
                      <span className="text-white font-medium">{selected.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Type</span>
                      <span className="text-white font-medium">{selected.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Submitted</span>
                      <span className="text-white/60 text-xs">{formatDate(selected.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action section — pending only */}
              {selected.status === 'pending' && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Take Action</p>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-2">
                      Rejection reason <span className="text-white/30">(required if rejecting)</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      rows={3}
                      placeholder="Provide a reason for rejection..."
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusChange(selected._id || selected.id, 'approved')}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(selected._id || selected.id, 'rejected')}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Review info — approved/rejected */}
              {selected.status !== 'pending' && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Review Details</p>
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviewed at</span>
                    <span className="text-white/70">{formatDate(selected.reviewedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviewed by</span>
                    <span className="text-white/70">{selected.reviewedBy}</span>
                  </div>
                  {selected.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs font-semibold text-red-400 mb-1">Rejection Reason</p>
                      <p className="text-red-300/80 text-sm">{selected.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
