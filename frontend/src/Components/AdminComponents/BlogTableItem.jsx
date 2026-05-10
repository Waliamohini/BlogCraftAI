import React from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { baseURL } from '@/config/api'

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const router = useRouter()
  const isPublished = blog.isPublished
  const BlogDate = blog.createdAt ? new Date(blog.createdAt) : blog.date ? new Date(blog.date) : null
  const { axios } = useAppContext()

  const handleToggle = async () => {
    try {
      const { data } = await axios.post(`${baseURL}/api/blog/toggle-publish`, { id: blog._id })
      if (data.success) {
        toast.success(isPublished ? 'Post unpublished' : 'Post published')
        fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post? This action cannot be undone.')) return
    try {
      const { data } = await axios.post(`${baseURL}/api/blog/delete`, { id: blog._id })
      if (data.success) {
        toast.success('Post deleted')
        fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 max-sm:hidden">
        <span className="text-sm text-gray-700 font-medium">{blog.author || '—'}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-800 font-medium line-clamp-1">{blog.title || 'Untitled'}</span>
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        <span className="text-xs text-gray-400">
          {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {isPublished ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Draft
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isPublished
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-100'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100'
            }`}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem
