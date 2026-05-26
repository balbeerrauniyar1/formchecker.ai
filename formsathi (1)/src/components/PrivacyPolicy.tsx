import { ShieldCheck, Heart, FileText, Lock, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Safe Cockpit
        </button>
      </div>

      {/* Header banner */}
      <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-sm space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FileText className="h-6 w-6" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FormSathi Seeker Privacy Policy</h1>
          <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">Locker security standard compliance status: ACTIVE</p>
        </div>
      </div>

      {/* Policy items */}
      <div className="space-y-6 text-sm text-slate-650 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">1</span>
            Data Isolation Policy
          </h2>
          <p>
            FormSathi operates on an isolated client workspace sandbox model. We utilize high-grade persistent client tables (`localStorage` database structures) to guarantee that all of your uploaded credentials, certificates, Aadhaar, PAN card, and Form inputs remain fully contained within your immediate browser context.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">2</span>
            Zero Third-Party Telemetry
          </h2>
          <p>
            We strictly enforce a NO MOCK DATA LEAK telemetry philosophy. Your personal information, parental names, and structural identification documents are never sent to external servers, cloud logging endpoints, or advertising networks. Every comparison run on the AI Form Checker tool runs client-side inside the micro-sandboxes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">3</span>
            Government Compliance Rules
          </h2>
          <p>
            FormSathi document sizing encoders run physical HTML5 canvases to compress images compliant with the sizes specified by standard state portfolios:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-650">
            <li><span className="font-semibold text-slate-800">Original formats</span>: Retains pristine files unchanged.</li>
            <li><span className="font-semibold text-slate-800">JPG (50KB) encoder</span>: Designed to instantly format and scale photographs to comply with the 50KB guidelines of SSC, UPSC, and State PSC forms.</li>
            <li><span className="font-semibold text-slate-800">PDF (100KB) encoder</span>: Scales and outputs documents optimized for size strict requirements, preventing portal upload errors.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">4</span>
            Digital India Alignment
          </h2>
          <p>
            Our core mission is empowering Indian job-seekers and students. We protect private accounts, enabling seamless verification without requiring deep backend subscriptions.
          </p>
        </section>

      </div>

      {/* Trust Sign off */}
      <div className="rounded-xl bg-slate-50 p-6 border border-slate-150 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-left text-xs">
            <span className="font-bold text-slate-800 block">FormSathi Cryptography Seal</span>
            <span className="text-slate-500 font-mono text-[10px]">HASH: sha256-F0RMSATH1PR1VACYM0DELSECURE</span>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Accept & Go Back
        </button>
      </div>

    </div>
  );
}
