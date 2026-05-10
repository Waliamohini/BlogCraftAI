'use client'

import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'

const Page = () => {
  const [emails, setEmails] = useState([])
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedCompany = localStorage.getItem('company')
    if (storedCompany) setCompany(storedCompany)
  }, [])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${baseURL}/api/admin/emails`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { company },
      })
      if (response.data.success) {
        setEmails(response.data.emails)
      } else {
        toast.error('Failed to load subscribers')
      }
    } catch (error) {
      toast.error('Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }

  const deleteEmail = async (mongoId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${baseURL}/api/admin/emails`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: mongoId },
      })
      if (response.data.success) {
        toast.success('Subscriber removed')
        fetchEmails()
      } else {
        toast.error('Error removing subscriber')
      }
    } catch (error) {
      toast.error('Server error')
    }
  }

  useEffect(() => {
    if (company) fetchEmails()
  }, [company])

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {emails.length} subscriber{emails.length !== 1 ? 's' : ''} for {company || 'your company'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">{emails.length} active</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium hidden sm:table-cell">Date Subscribed</th>
                <th className="px-6 py-3 text-left font-medium hidden sm:table-cell">Company</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm">Loading subscribers...</p>
                    </div>
                  </td>
                </tr>
              ) : emails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">No subscribers yet</p>
                      <p className="text-xs text-gray-400">Subscribers will appear here once people sign up</p>
                    </div>
                  </td>
                </tr>
              ) : (
                emails.map((item) => (
                  <SubsTableItem
                    key={item._id}
                    mongoId={item._id}
                    deleteEmail={deleteEmail}
                    email={item.email}
                    date={item.date}
                    company={item.company}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page
