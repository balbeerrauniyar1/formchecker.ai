import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Calendar,
  Plus,
  MoreVertical,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CheckSquare,
  Crop,
  Code,
  User as UserIcon,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";
import { User, UploadedDocument } from "../types";

// Import local generated mascot asset
const meditatingBearImg = "/src/assets/images/meditating_bear_1779741175309.png";

interface DashboardHomeProps {
  currentUser: User;
  documents: UploadedDocument[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardHome({
  currentUser,
  documents,
  setActiveTab,
}: DashboardHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState(new Date());
  
  // Format current date beautifully
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Recent files
  const recentDocs = documents.slice(0, 3);

  // Simple Notification dismissal state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "welcome",
      color: "bg-[#3B66F5] text-white",
      icon: "V",
      title: "Welcome to FormSathi. Your documents are secured with local AES encryption.",
      dismissible: false,
    },
    {
      id: 2,
      type: "extension",
      color: "bg-[#F5A623] text-white",
      icon: "E",
      title: "New Companion: Download our Chrome autofill extension to fill any Indian portal.",
      dismissible: true,
    },
    {
      id: 3,
      type: "secure",
      color: "bg-[#47C965] text-white",
      icon: "S",
      title: "100% Secure & Client-Side Photo Resizing active on Sizer tab.",
      subtitle: "No server transfers!",
      dismissible: false,
    },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Pre-configured list of shortcuts matching user's other workspace tabs
  const appShortcuts = [
    { id: "wallet", label: "Vault", icon: FileText, color: "bg-[#E02020]/10 text-[#E02020]" },
    { id: "checker", label: "Form Checker", icon: CheckSquare, color: "bg-[#3B66F5]/10 text-[#3B66F5]" },
    { id: "sizer", label: "Photo Sizer", icon: Crop, color: "bg-[#47C965]/10 text-[#47C965]" },
    { id: "vault", label: "Passwords", icon: ShieldCheck, color: "bg-[#794DF5]/10 text-[#794DF5]" },
  ];

  return (
    <div className="relative w-full h-full min-h-screen bg-[#F4F6FA] text-[#1A1D24] overflow-y-auto px-8 pb-16 font-sans">
      
      {/* 1. TOP HEADER TOOLBAR BAR (Matching screenshot exactly) */}
      <header className="h-20 flex items-center justify-between z-20 relative">
        
        {/* Left Side: Magnificent subtle Search Bar */}
        <div className="relative flex items-center w-64">
          <Search className="absolute left-3.5 h-4 w-4 text-[#8C95A6]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#EBEFF8] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]/20 focus:border-[#3B66F5] transition-all placeholder:text-[#8C95A6] shadow-sm font-medium"
          />
        </div>

        {/* Center: Dynamic Date Selector */}
        <div className="flex items-center gap-2 bg-white/80 border border-[#EBEFF8] px-4 py-2 rounded-2xl shadow-sm text-xs text-[#555E6E] font-semibold cursor-pointer hover:bg-white transition-colors">
          <Calendar className="h-3.5 w-3.5 text-[#3B66F5]" />
          <span>{formattedDate}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#A2ABB8]" />
        </div>

        {/* Right Side: Profile area & notification icon shortcuts */}
        <div className="flex items-center gap-4.5">
          {/* Notifications Bubbles matching icons in screenshot */}
          <button className="relative p-2.5 hover:bg-white rounded-full bg-white/70 border border-[#EBEFF8] transition-colors cursor-pointer text-[#555E6E] shadow-sm">
            <MessageSquare className="h-4 w-4" />
          </button>
          
          <button className="relative p-2.5 hover:bg-white rounded-full bg-white/70 border border-[#EBEFF8] transition-colors cursor-pointer text-[#555E6E] shadow-sm">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#F5A623] ring-2 ring-white" />
          </button>

          {/* User profile capsule */}
          <div className="flex items-center gap-3 bg-white/80 border border-[#EBEFF8] p-1.5 pr-3 rounded-2xl shadow-sm hover:bg-white transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#3B66F5] to-indigo-400 text-white flex items-center justify-center font-bold shadow-sm overflow-hidden">
              <span className="text-xs">{currentUser.fullName.charAt(0)}</span>
            </div>
            <div className="text-left leading-none">
              <h4 className="text-xs font-bold text-[#1A1D24]">{currentUser.fullName.split(' ')[0]}</h4>
              <p className="text-[9px] text-[#8C95A6] font-medium mt-0.5">Premium Member</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#A2ABB8] ml-1" />
          </div>

          {/* Indigo "Create new" Call-To-Action of screenshot */}
          <button
            onClick={() => setActiveTab("wallet")}
            className="px-4 py-2.5 rounded-2xl bg-[#3B66F5] hover:bg-[#2F52C7] text-white text-xs font-bold tracking-wide transition-all shadow-[0_8px_20px_rgba(59,102,245,0.25)] hover:shadow-[0_12px_24px_rgba(59,102,245,0.35)] cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Create new</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD TITLE */}
      <div className="mt-6 mb-6">
        <h2 className="text-2xl font-extrabold text-[#1A1D24] tracking-tight">Dashboard</h2>
      </div>

      {/* 2. DUAL MAIN PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left/Middle Column (Aesthetic Greeting and Meditating Bear) */}
        <div className="lg:col-span-2 relative bg-white border border-[#EBEFF8] rounded-[2rem] p-10 shadow-[0_10px_35px_rgba(59,102,245,0.02)] overflow-hidden flex flex-col justify-between min-h-[320px]">
          {/* Subtle background abstract shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#3B66F5]/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10 max-w-md">
            {/* Title Greeting */}
            <h1 className="text-4.5xl font-extrabold text-[#1A1D24] tracking-tight mb-2">
              Hi, {currentUser.fullName.split(" ")[0]}!
            </h1>
            <p className="text-sm font-medium text-[#8C95A6] mb-8">
              What are we doing today?
            </p>

            {/* Checklist elements of the dashboard matching actual tools */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4">
              <button
                onClick={() => setActiveTab("checker")}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full border-2 border-[#3B66F5]/20 flex items-center justify-center text-[#3B66F5] bg-[#3B66F5]/5 group-hover:scale-105 transition-all">
                  <CheckCircle2 className="h-4 w-4 text-[#3B66F5]" />
                </div>
                <span className="text-xs font-bold text-[#555E6E] group-hover:text-[#1A1D24] transition-colors">
                  Verify Form Fields
                </span>
              </button>

              <button
                onClick={() => setActiveTab("wallet")}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full border-2 border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] bg-[#F5A623]/5 group-hover:scale-105 transition-all">
                  <CheckCircle2 className="h-4 w-4 text-[#F5A623]" />
                </div>
                <span className="text-xs font-bold text-[#555E6E] group-hover:text-[#1A1D24] transition-colors">
                  Manage Digital Vault
                </span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full border-2 border-[#E02020]/20 flex items-center justify-center text-[#E02020] bg-[#E02020]/5 group-hover:scale-105 transition-all">
                  <CheckCircle2 className="h-4 w-4 text-[#E02020]" />
                </div>
                <span className="text-xs font-bold text-[#555E6E] group-hover:text-[#1A1D24] transition-colors">
                  Complete candidate profile
                </span>
              </button>

              <button
                onClick={() => setActiveTab("devdocs")}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full border-2 border-[#3B66F5]/20 flex items-center justify-center text-[#3B66F5] bg-[#3B66F5]/5 group-hover:scale-105 transition-all">
                  <CheckCircle2 className="h-4 w-4 text-[#3B66F5]" />
                </div>
                <span className="text-xs font-bold text-[#555E6E] group-hover:text-[#1A1D24] transition-colors">
                  Consult Setup Guide
                </span>
              </button>
            </div>
          </div>

          {/* Right Side: Cute Overlapping Meditating Bear Mascot */}
          <div className="absolute bottom-4 right-8 lg:right-16 w-48 h-48 md:w-56 md:h-56 z-10 flex items-end justify-center">
            <motion.img
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -6, 0], opacity: 1 }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              src={meditatingBearImg}
              alt="Meditating Bear Mascot"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Column: Beautiful Notifications Widget */}
        <div className="relative bg-white border border-[#EBEFF8] rounded-[2rem] p-6 shadow-[0_10px_35px_rgba(59,102,245,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5.5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#1A1D24]" />
                <h3 className="text-sm font-extrabold text-[#1A1D24] uppercase tracking-wider">
                  Notifications
                </h3>
              </div>
              <button
                className="text-xs font-extrabold text-[#3B66F5] hover:text-[#2F52C7] transition-colors"
                onClick={() => setActiveTab("checker")}
              >
                See all
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {notifications.map((notif) => (
                  <motion.div
                    layout
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group relative flex items-center gap-3 p-3 bg-[#FAFBFD] border border-[#EBEFF8] rounded-2.5xl hover:bg-white hover:shadow-sm transition-all"
                  >
                    {/* Circle badge of screenshot notifications */}
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${notif.color}`}>
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-xs font-bold text-[#1A1D24] leading-snug">
                        {notif.title}
                      </p>
                      {notif.subtitle && (
                        <p className="text-[10px] text-[#8C95A6] font-medium mt-0.5">
                          {notif.subtitle}
                        </p>
                      )}
                    </div>

                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#C4CDDB] hover:text-[#555E6E] opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-neutral-50 border border-neutral-100 rounded-lg shadow-sm">
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    {notif.dismissible && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="absolute top-2 right-2 text-[#C4CDDB] hover:text-[#E02020] transition-colors rounded-full"
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Shortcuts for FormSathi apps */}
          <div className="pt-4 mt-4 border-t border-[#FAFBFD]">
            <h4 className="text-[9px] font-extrabold uppercase text-[#8C95A6] tracking-wider mb-2 px-1">
              Quick Shortcuts
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {appShortcuts.map((sc) => {
                const Icon = sc.icon;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setActiveTab(sc.id)}
                    className="flex flex-col items-center gap-1.5 p-2 bg-[#FAFBFD] hover:bg-white border border-[#EBEFF8] rounded-2xl hover:shadow-sm transition-all text-center cursor-pointer group"
                  >
                    <div className={`p-2 rounded-xl scale-95 group-hover:scale-100 transition-transform ${sc.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-bold text-[#555E6E] group-hover:text-[#1A1D24]">
                      {sc.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 3. FOUR METRICS CARDS ROW (FormSathi Actual Live Key Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5.5 mt-8">
        
        {/* Card 1: Total Vault Documents */}
        <div 
          onClick={() => setActiveTab("wallet")}
          className="bg-white border border-[#EBEFF8] rounded-3xl p-6.5 shadow-[0_8px_25px_rgba(59,102,245,0.015)] flex flex-col justify-between relative group hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2.5xl bg-[#FFF2F2] border border-[#FFE4E4] flex items-center justify-center text-[#E02020] shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-6.5">
            <h4 className="text-[11px] font-extrabold text-[#8C95A6] uppercase tracking-widest leading-none mb-2">
              Vault Documents
            </h4>
            <h3 className="text-xl.5 font-black text-[#1A1D24] tracking-tight">
              {documents.length} Saved {documents.length === 1 ? 'Doc' : 'Docs'}
            </h3>
          </div>
        </div>

        {/* Card 2: Companion Status */}
        <div 
          onClick={() => setActiveTab("extension")}
          className="bg-white border border-[#EBEFF8] rounded-3xl p-6.5 shadow-[0_8px_25px_rgba(59,102,245,0.015)] flex flex-col justify-between relative group hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2.5xl bg-[#F0F4FF] border border-[#E1E8FF] flex items-center justify-center text-[#3B66F5] shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-6.5">
            <h4 className="text-[11px] font-extrabold text-[#8C95A6] uppercase tracking-widest leading-none mb-2">
              Autofill Companion
            </h4>
            <h3 className="text-xl.5 font-black text-[#1A1D24] tracking-tight">
              ZIP Ready
            </h3>
          </div>
        </div>

        {/* Card 3: Compression Standard */}
        <div 
          onClick={() => setActiveTab("sizer")}
          className="bg-white border border-[#EBEFF8] rounded-3xl p-6.5 shadow-[0_8px_25px_rgba(59,102,245,0.015)] flex flex-col justify-between relative group hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2.5xl bg-[#FFF9E9] border border-[#FFEFC2] flex items-center justify-center text-[#F5A623] shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-6.5">
            <h4 className="text-[11px] font-extrabold text-[#8C95A6] uppercase tracking-widest leading-none mb-2">
              Local Image Sizer
            </h4>
            <h3 className="text-xl.5 font-black text-[#1A1D24] tracking-tight">
              0 KB Upload Standard
            </h3>
          </div>
        </div>

        {/* Card 4: Credential Protection */}
        <div 
          onClick={() => setActiveTab("profile")}
          className="bg-white border border-[#EBEFF8] rounded-3xl p-6.5 shadow-[0_8px_25px_rgba(59,102,245,0.015)] flex flex-col justify-between relative group hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2.5xl bg-[#EDFAF0] border border-[#DEF7E5] flex items-center justify-center text-[#47C965] shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-6.5">
            <h4 className="text-[11px] font-extrabold text-[#8C95A6] uppercase tracking-widest leading-none mb-2">
              Key Security Index
            </h4>
            <h3 className="text-xl.5 font-black text-[#1A1D24] tracking-tight">
              100% AES Locker
            </h3>
          </div>
        </div>

      </div>

    </div>
  );
}
