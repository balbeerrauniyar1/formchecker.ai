import { ShieldCheck, Lock, Heart, FileText } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenDevDocs: () => void;
}

export default function Footer({ onOpenPrivacy, onOpenDevDocs }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8 text-slate-500 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Isolation message */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10">
              <Lock className="h-4 w-4" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-slate-700 block text-[13px]">
                End-to-End Sandbox Secured
              </span>
              <span className="text-slate-400">
                Your uploaded document assets are stored in verified sandbox instances and only visible to you.
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenDevDocs}
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Dev Docs / PRD
            </button>
            <span className="text-slate-300">|</span>
            <button
              id="footer-privacy-link"
              onClick={onOpenPrivacy}
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Made with care for Indian Job Seekers</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

        </div>

        <div className="mt-6 border-t border-slate-200/60 pt-6 text-center text-[11px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} FormSathi Digital India Locker Initiative. All rights reserved.</span>
          <div className="flex items-center gap-3 font-mono">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="h-3 w-3" /> VERIFIED COMPLIANT
            </span>
            <span>v1.0.0-MVP</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
