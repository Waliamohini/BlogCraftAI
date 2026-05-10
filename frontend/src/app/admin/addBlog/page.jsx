'use client'

import { useAppContext } from '@/context/AppContext'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useRouter } from 'next/navigation'
import { baseURL } from '@/config/api'
import AiContextPanel from '@/Components/AdminComponents/AiContextPanel'
import AiChatPanel from '@/Components/AdminComponents/AiChatPanel'

const DEFAULT_CTX = {
  tone: 'professional',
  length: 'medium',
  audience: 'B2B marketing professionals',
  style: '',
  keywords: '',
  extraContext: '',
}

export default function AddBlogPage() {
  const router = useRouter()
  const { axios } = useAppContext()
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [isPublished, setIsPublished] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [refining, setRefining] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [contentGenerated, setContentGenerated] = useState(false)

  const [aiCtx, setAiCtx] = useState(DEFAULT_CTX)
  const [data, setData] = useState({
    title: '',
    category: 'ABM',
    author: 'Alex Bennett',
  })

  // Init Quill
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog content here, or use AI to generate it...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      })
    }
  }, [])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // ── Generate ──────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!data.title.trim()) {
      toast.error('Enter a post title first')
      return
    }
    try {
      setGenerating(true)
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${baseURL}/api/blog/generate`,
        { prompt: data.title, ...aiCtx },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        quillRef.current.root.innerHTML = response.data.content
        setContentGenerated(true)
        setChatOpen(true)
        toast.success('Content generated — review it below')
      } else {
        toast.error(response.data.message || 'Generation failed')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  // ── Refine ────────────────────────────────────────────────
  const handleRefine = async (instruction) => {
    const currentContent = quillRef.current?.root?.innerHTML ?? ''
    setRefining(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${baseURL}/api/blog/refine`,
        { currentContent, instruction },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        quillRef.current.root.innerHTML = response.data.content
      } else {
        throw new Error(response.data.message || 'Refinement failed')
      }
    } finally {
      setRefining(false)
    }
  }

  // ── Submit ────────────────────────────────────────────────
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const company = localStorage.getItem('company') || ''
    const description = quillRef.current?.root?.innerHTML?.trim() ?? ''

    if (!data.title.trim()) { toast.error('Post title is required'); return }
    if (!data.author.trim()) { toast.error('Author name is required'); return }
    if (!image) { toast.error('Please upload a cover image'); return }
    if (image.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    if (!company) { toast.error('No company found — please log in again'); return }
    if (!description || description === '<p><br></p>') {
      toast.error('Please add some content before publishing'); return
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', description)
    formData.append('category', data.category)
    formData.append('author', data.author)
    formData.append('authorImg', '/author_img.png')
    formData.append('image', image)
    formData.append('isPublished', String(isPublished))
    formData.append('company', company)

    try {
      setSubmitting(true)
      const response = await axios.post(`${baseURL}/api/blog/add`, formData)
      if (response.data.success) {
        toast.success('Post saved successfully')
        setTimeout(() => router.push('/admin/blogList'), 1200)
      } else {
        toast.error(response.data.message || 'Something went wrong')
        console.error('Add blog failed:', response.data)
      }
    } catch (error) {
      console.error('Submit error:', error?.response?.data || error.message)
      toast.error(error?.response?.data?.message || error.message || 'Failed to save post')
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = generating || submitting

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details, configure AI settings, then generate or write your content.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">

          {/* ── Cover Image ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Cover Image <span className="text-red-400">*</span>
            </label>
            <label htmlFor="image" className="cursor-pointer block">
              <div className={`relative w-full h-48 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                image ? 'border-indigo-300' : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/20'
              }`}>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Click to upload cover image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 5MB</p>
                  </div>
                )}
              </div>
            </label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden accept="image/*" />
            {image && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">{image.name} — {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button" onClick={() => setImage(null)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            )}
          </div>

          {/* ── Post Details ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Post Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                onChange={onChangeHandler}
                value={data.title}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition"
                type="text"
                placeholder="Enter a compelling title..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Author <span className="text-red-400">*</span>
                </label>
                <input
                  name="author"
                  onChange={onChangeHandler}
                  value={data.author}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition"
                  type="text"
                  placeholder="Author name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  name="category"
                  onChange={onChangeHandler}
                  value={data.category}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="ABM">ABM</option>
                  <option value="Advertising">Advertising</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Demand Generation">Demand Generation</option>
                  <option value="Intent Data">Intent Data</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── AI Context Panel ── */}
          <AiContextPanel
            ctx={aiCtx}
            setCtx={setAiCtx}
            onGenerate={handleGenerate}
            loading={generating}
            disabled={!data.title.trim()}
          />

          {/* ── Content Editor ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Content <span className="text-red-400">*</span>
              </label>
              {contentGenerated && (
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition border border-indigo-100"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Refine with AI
                </button>
              )}
            </div>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden min-h-[320px]">
              <div ref={editorRef} className="min-h-[280px]" />
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-xs text-gray-500 font-medium">Generating your blog...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Publish Settings ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Publish Settings</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors ${isPublished ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Publish immediately</p>
                <p className="text-xs text-gray-400">Post will be visible to readers right away</p>
              </div>
            </label>
          </div>

          {/* ── Submit ── */}
          <div className="flex items-center gap-3 pb-8">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 shadow-sm"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isPublished ? 'Publish Post' : 'Save as Draft'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/blogList')}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ── AI Chat Panel ── */}
      <AiChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onAccept={() => setChatOpen(false)}
        onRefine={handleRefine}
        refining={refining}
      />
    </div>
  )
}
