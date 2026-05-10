"use client";
import React, { useEffect, useState } from 'react';
import CommentTableItem from '@/Components/AdminComponents/CommentTableItem';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { baseURL } from '@/config/api';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('Not Approved');
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseURL}/api/admin/comments`);
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const filtered = comments.filter((c) =>
    filter === 'Approved' ? c.isApproved === true : c.isApproved === false
  );

  const approvedCount = comments.filter(c => c.isApproved).length;
  const pendingCount = comments.filter(c => !c.isApproved).length;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Comments</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {approvedCount} approved &mdash; {pendingCount} pending review
          </p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('Not Approved')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === 'Not Approved'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending
            {pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] bg-amber-100 text-amber-700 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('Approved')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === 'Approved'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left font-medium">Post &amp; Comment</th>
                <th className="px-6 py-3 text-left font-medium max-sm:hidden">Date</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm">Loading comments...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((comment, index) => (
                  <CommentTableItem key={comment._id} comment={comment} index={index + 1} fetchComments={fetchComments} />
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">
                        No {filter === 'Approved' ? 'approved' : 'pending'} comments
                      </p>
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

export default Comments;
