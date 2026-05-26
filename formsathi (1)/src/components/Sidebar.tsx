import React from "react";
import { User } from "../types";
import {
  FileText,
  User as UserIcon,
  CheckSquare,
  Crop,
  ShieldCheck,
  LogOut,
  Code,
  CircleUser,
  Bot,
  HelpCircle,
  Settings as SettingsIcon,
  LayoutGrid,
  Chrome,
} from "lucide-react";

interface SidebarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  profileIsVerified: boolean;
}

export default function Sidebar({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  profileIsVerified,
}: SidebarProps) {
  if (!currentUser) return null;

  const menuItems = [
    { id: "home", label: "Dashboard", icon: LayoutGrid },
    { id: "wallet", label: "Vault", icon: FileText },
    { id: "hub", label: "Jobs & Scholarship", icon: ShieldCheck },
    { id: "checker", label: "AI Form Checker", icon: Bot },
    { id: "extension", label: "Extension", icon: Chrome },
    { id: "sizer", label: "Image Sizer", icon: Crop },
    { id: "profile", label: "My Profile", icon: UserIcon },
    { id: "devdocs", label: "Guide", icon: Code },
  ];

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-[#EBEFF8] h-full flex flex-col transition-all duration-300">
      {/* Dynamic Aesthetic Logo Area */}
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveTab("home")}>
          <div className="relative h-9 w-9 flex items-center justify-center">
            {/* Elegant overlapping arcs representing the logo from screenshot */}
            <svg viewBox="0 0 100 100" className="h-full w-full transform group-hover:rotate-12 transition-transform duration-300">
              <path d="M50 15 A35 35 0 0 1 85 50" fill="none" stroke="#3B66F5" strokeWidth="12" strokeLinecap="round" />
              <path d="M85 50 A35 35 0 0 1 50 85" fill="none" stroke="#F5A623" strokeWidth="12" strokeLinecap="round" />
              <path d="M50 85 A35 35 0 0 1 15 50" fill="none" stroke="#E02020" strokeWidth="12" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-[#3B66F5]" />
            </div>
          </div>
          <div>
            <h1 className="text-[#1A1D24] text-sm font-bold tracking-tight">FormSathi AI</h1>
            <p className="text-[10px] text-[#8C95A6] font-medium tracking-wide">Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 px-4 py-4 space-y-7 overflow-y-auto custom-scrollbar">
        <div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#F3F6FD] text-[#3B66F5] shadow-sm shadow-[#3B66F5]/5"
                      : "text-[#8C95A6] hover:text-[#1A1D24] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 stroke-[2.2] transition-colors ${
                      isActive ? "text-[#3B66F5]" : "text-[#A2ABB8]"
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B66F5]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Extra Profile and Settings at Bottom */}
      <div className="p-4 border-t border-[#EBEFF8] bg-[#FAFBFD] space-y-2.5">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all ${
            activeTab === "profile" 
              ? "bg-[#F3F6FD] text-[#3B66F5]" 
              : "hover:bg-[#F1F3F9]"
          }`}
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#3B66F5] to-indigo-400 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <CircleUser className="h-4.5 w-4.5" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#1A1D24] truncate">
              {currentUser.fullName}
            </h4>
            <p className="text-[10px] text-[#8C95A6] truncate font-medium">
              {currentUser.email}
            </p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#8C95A6] hover:text-[#E02020] p-2.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Vault</span>
        </button>
      </div>
    </aside>
  );
}
