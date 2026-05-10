import React from 'react'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { baseURL } from '@/config/api'

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment
  const BlogDate = new Date(createdAt)
  const { axios } = useAppContext()

  const approveComment = async () => {
    try {
      const { data } = await axios.post(`${baseURL}/api/admin/approve-comment`, { id: _id })
      if (data.success) {
        toast.success('Comment approved')
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteComment = async () => {
    if (!window.confirm('Delete this comment?')) return
    try {
      const { data } = await axios.post(`${baseURL}/api/admin/delete-comment`, { id: _id })
      if (data.success) {
        toast.success('Comment deleted')
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formattedDate = BlogDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {blog?.title || 'Unknown post'}
          </p>
          <p className="text-sm text-gray-800">
            <span className="font-medium">{comment.name}</span>
            <span className="text-gray-400 mx-1.5">&mdash;</span>
            <span className="text-gray-600">{comment.content}</span>
          </p>
        </div>
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {!comment.isApproved ? (
            <button
              onClick={approveComment}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Approved
            </span>
          )}
          <button
            onClick={deleteComment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem
