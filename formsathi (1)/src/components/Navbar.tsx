import { User } from '../types';
import { ShieldCheck, LogOut, User as UserIcon, FileText, CheckSquare, ShieldAlert, Crop } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  profileIsVerified: boolean;
}

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout, profileIsVerified }: NavbarProps) {
  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6" id="brand-logo-icon" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Form<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sathi</span>
            </span>
            <span className="ml-1.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-600/10">
              DESKTOP SECURE
            </span>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            id="nav-tab-wallet"
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'wallet'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            Document Wallet
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="h-4 w-4" />
            Verified Profile
            {profileIsVerified ? (
              <span className="block h-2 w-2 rounded-full bg-emerald-500" />
            ) : (
              <span className="block h-2 w-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            id="nav-tab-checker"
            onClick={() => setActiveTab('checker')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'checker'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            Form Checker
          </button>

          <button
            id="nav-tab-sizer"
            onClick={() => setActiveTab('sizer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'sizer'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Crop className="h-4 w-4" />
            Photo & Sign Sizer
          </button>
          <button
            id="nav-tab-vault"
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'vault'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Password Vault
          </button>
        </nav>

        {/* Right Session info */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-slate-700 max-w-[150px] truncate">
              {currentUser.fullName}
            </span>
            <div className="flex items-center gap-1">
              {currentUser.isVerified ? (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                  <ShieldCheck className="h-3 w-3" /> Email Verified
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600">
                  <ShieldAlert className="h-3 w-3" /> Unverified Email
                </span>
              )}
            </div>
          </div>

          <button
            id="nav-logout-btn"
            onClick={onLogout}
            title="Secure Sign Out"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-all border border-slate-200 font-bold text-xs shadow-sm bg-white"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation banner */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-150 py-2 bg-slate-50">
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded text-xs font-medium ${
            activeTab === 'wallet' ? 'text-blue-700 font-bold' : 'text-slate-600'
          }`}
        >
          <FileText className="h-4 w-4" />
          Wallet
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded text-xs font-medium ${
            activeTab === 'profile' ? 'text-blue-700 font-bold' : 'text-slate-600'
          }`}
        >
          <UserIcon className="h-4 w-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('checker')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded text-xs font-medium ${
            activeTab === 'checker' ? 'text-blue-700 font-bold' : 'text-slate-600'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Checker
        </button>
        <button
          onClick={() => setActiveTab('sizer')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded text-xs font-medium ${
            activeTab === 'sizer' ? 'text-blue-700 font-bold' : 'text-slate-600'
          }`}
        >
          <Crop className="h-4 w-4" />
          Sizer
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded text-xs font-medium ${
            activeTab === 'vault' ? 'text-blue-700 font-bold' : 'text-slate-600'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Vault
        </button>
      </div>

      {/* Global verification status badge message for secure simulation */}
      {!currentUser.isVerified && (
        <div className="bg-amber-500 text-white text-xs py-1.5 px-4 text-center font-medium animate-pulse flex items-center justify-center gap-1">
          <ShieldAlert className="h-3.5 w-3.5 inline" />
          Please verify your email address. Registered code can be typed inside your Auth profile.
        </div>
      )}
    </header>
  );
}
