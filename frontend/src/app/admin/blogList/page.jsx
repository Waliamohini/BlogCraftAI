"use client";
import React, { useEffect, useState } from 'react';
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { baseURL } from '@/config/api';
import Link from 'next/link';

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const company = localStorage.getItem('company');
      const { data } = await axios.get(`${baseURL}/api/admin/blogs?company=${company}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const sorted = [...data.blogs].sort((a, b) => {
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        });
        setBlogs(sorted);
      } else {
        toast.error(data.message || 'Failed to fetch posts');
        setBlogs([]);
      }
    } catch (error) {
      toast.error(error.message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const published = blogs.filter(b => b.isPublished).length;
  const drafts = blogs.filter(b => !b.isPublished).length;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {blogs.length} total &mdash; {published} published, {drafts} drafts
          </p>
        </div>
        <Link
          href="/admin/addBlog"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left font-medium">Author</th>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium max-sm:hidden">Date</th>
                <th className="px-6 py-3 text-left font-medium max-sm:hidden">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm">Loading posts...</p>
                    </div>
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">No posts found</p>
                      <Link href="/admin/addBlog" className="text-xs text-indigo-600 hover:underline">
                        Create your first post
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListBlog;
