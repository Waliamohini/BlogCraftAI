"use client";
import React from 'react'

const SubsTableItem = ({ email, mongoId, deleteEmail, date, company }) => {
  const emailDate = date ? new Date(date) : null

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm text-gray-800 font-medium">{email || '—'}</span>
        </div>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell">
        <span className="text-xs text-gray-400">
          {emailDate && !isNaN(emailDate)
            ? emailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '—'}
        </span>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell">
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          {company || '—'}
        </span>
      </td>
      <td className="px-5 py-4">
        <button
          onClick={() => deleteEmail(mongoId)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </td>
    </tr>
  )
}

export default SubsTableItem
