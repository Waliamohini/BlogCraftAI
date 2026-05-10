"use client";
import React, { useEffect, useState } from "react";
import BlogTableItem from "@/Components/AdminComponents/BlogTableItem";
import AnalyticsSection from "@/Components/AdminComponents/analytics/AnalyticsSection";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { baseURL } from "@/config/api";

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();
  const company = typeof window !== "undefined" ? localStorage.getItem("company") : "";

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/api/admin/dashboard?company=${company}`);
      if (data.success) {
        const dd = data.dashboardData;

        // Case-insensitive lookup for company blog count
        const companyKey = Object.keys(dd.companyBlogCounts || {}).find(
          (k) => k.toLowerCase() === company.toLowerCase()
        );
        const blogCount = companyKey ? dd.companyBlogCounts[companyKey] : 0;

        // Filter recent blogs to this company only
        const companyBlogs = (dd.recentBlogs || []).filter(
          (b) => b.company?.toLowerCase() === company.toLowerCase()
        );

        setDashboardData({
          blogs: blogCount,
          comments: dd.comments || 0,
          drafts: dd.drafts || 0,
          recentBlogs: companyBlogs,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (company) fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back{company ? `, ${company}` : ""}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your content today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Total Posts"
          value={dashboardData.blogs}
          color="bg-indigo-50"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Total Comments"
          value={dashboardData.comments}
          color="bg-emerald-50"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <StatCard
          label="Drafts"
          value={dashboardData.drafts ?? 0}
          color="bg-amber-50"
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Recent Posts</h2>
          <a href="/admin/blogList" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium">Author</th>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium max-sm:hidden">Date</th>
                <th className="px-6 py-3 text-left font-medium max-sm:hidden">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dashboardData.recentBlogs.length > 0 ? (
                dashboardData.recentBlogs.map((blog, index) => (
                  <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchDashboard} index={index + 1} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    No posts yet. <a href="/admin/addBlog" className="text-indigo-600 hover:underline">Create your first post</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsSection />
    </div>
  );
};

export default Dashboard;
