"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
  {
    href: "/super-admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0h-6a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/super-admin/incomingRequest",
    label: "Incoming request",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  }
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-[#0f1117] border-r border-white/5 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">BlogCraft AI</span>
        </div>
        <p className="text-white/30 text-[10px] mt-1 ml-9">Super Admin</p>
      </div>

      <div className="flex-1 pt-4">
        <nav className="space-y-0.5 px-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-3">Menu</p>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="flex items-center">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;