import React, { useState, useEffect } from 'react';
import { User, VerifiedProfile, UploadedDocument } from '../types';
import { getVerifiedProfile, saveVerifiedProfile } from '../utils/storage';
import { ShieldCheck, User as UserIcon, AlertCircle, Save, Loader, Check, Fingerprint, RefreshCw, Sparkles } from 'lucide-react';

interface MyProfileProps {
  currentUser: User;
  onProfileUpdated: () => void;
  documents: UploadedDocument[];
}

export default function MyProfile({ currentUser, onProfileUpdated, documents }: MyProfileProps) {
  // Local state
  const [profile, setProfile] = useState<VerifiedProfile | null>(null);
  
  // Form input states
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  const [, setIsLockerFilled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionLog, setExtractionLog] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initial load
  useEffect(() => {
    async function load() {
      const saved = await getVerifiedProfile(currentUser.id);
      if (saved) {
        setProfile(saved);
        // Populate inputs with current data
        setFullName(saved.fullName);
        setDateOfBirth(saved.dateOfBirth);
        setFatherName(saved.fatherName);
        setAadhaarNumber(saved.aadhaarNumber);
        setPanNumber(saved.panNumber);
      } else {
        // Default guess name
        setFullName(currentUser.fullName);
      }
    }
    load();
    
    setIsLockerFilled(documents.length > 0);
  }, [currentUser, documents]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Submit hand-entered / extracted form 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dateOfBirth || !fatherName || !aadhaarNumber || !panNumber) {
      setErrorMsg("All fields are mandatory to build your Indian Job Seeker Verified Profile.");
      return;
    }

    // Simple length validations to ensure they represent reasonable values
    if (aadhaarNumber.replace(/\s/g, '').length !== 12) {
      setErrorMsg("Aadhaar Card must correspond to a highly verified 12-digit Indian UIDAI string format.");
      return;
    }
    if (panNumber.length !== 10) {
      setErrorMsg("PAN Number must follow standard 10-character alphanumeric formats.");
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    setTimeout(async () => {
      const updated: VerifiedProfile = {
        userId: currentUser.id,
        fullName,
        dateOfBirth,
        fatherName,
        aadhaarNumber,
        panNumber,
        updatedAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      await saveVerifiedProfile(updated);
      setProfile(updated);
      setIsSaving(false);
      triggerSuccess("FormSathi Verified Profile synchronized successfully and written to secure database!");
      onProfileUpdated();
    }, 1200);
  };

  // Automated AI Data extraction helper for the MVP
  const runAiExtraction = () => {
    if (documents.length === 0) {
      setErrorMsg("No uploaded files detected in locker! Please upload a document to your Wallet tab first.");
      return;
    }

    setIsExtracting(true);
    setErrorMsg('');
    setExtractionLog("Analyzing secure wallet vaults...");
    
    setTimeout(() => {
      setExtractionLog("Vault analyzed. Starting Gemini computer-vision extraction scanner on active files...");
      
      setTimeout(() => {
        setExtractionLog("Evaluating document layout patterns... Reading key-value pairs...");
        
        setTimeout(() => {
          // Look for any Aadhaar or PAN mock variables
          const aadhaarDoc = documents.find(d => d.type === 'Aadhaar Card');
          const panDoc = documents.find(d => d.type === 'PAN Card');
          
          // Seed some simulated extracted data based on current user email or defaults
          setFullName(currentUser.fullName);
          setDateOfBirth("15/08/1998");
          setFatherName("Late Sh. Ramesh Rauniyar");
          
          if (aadhaarDoc) {
            setAadhaarNumber("5546 8892 1109");
          } else {
            setAadhaarNumber("1234 5678 9012");
          }
          
          if (panDoc) {
            setPanNumber("BPNPR4412K");
          } else {
            setPanNumber("ABCDE1234F");
          }

          setIsExtracting(false);
          setExtractionLog('');
          triggerSuccess("AI Successfully extracted metadata from your locker! Verify and press Save below.");
        }, 1200);

      }, 1000);

    }, 800);
  };

  return (
    <div className="space-y-6 text-[#1A1D24] font-sans">
      
      {/* Introduction banner */}
      <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-8 shadow-[0_10px_35px_rgba(59,102,245,0.015)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Fingerprint className="w-64 h-64 text-[#3B66F5]" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 text-[#3B66F5] font-extrabold text-[10px] uppercase tracking-wider bg-[#F3F6FD] px-3.5 py-1.5 rounded-full mb-1">
            <Fingerprint className="h-4 w-4 stroke-[2.2]" />
            <span>National locker sandbox protocol</span>
          </div>
          <h1 className="text-3xl font-black text-[#1A1D24] tracking-tight">Student Identity Repository</h1>
          <p className="text-[#8C95A6] text-xs font-semibold leading-relaxed max-w-2xl mt-1">
            FormSathi maps these secure variables against dynamic job application parameters. Lock your core identity details safely to facilitate lightning-speed cross-validation checks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6.5">
        
        {/* Profile Setup Form (Left 3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl border border-[#EBEFF8] bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBEFF8] pb-4 mb-5">
              <div>
                <h2 className="text-sm font-bold text-[#1A1D24] uppercase tracking-wider">
                  Verified Identity Profile
                </h2>
                <p className="text-[11px] text-[#8C95A6] font-semibold">Provide official details as stated in your matriculation certificates.</p>
              </div>

              {/* simulated AI extractor button trigger */}
              <button
                type="button"
                id="ai-autofill-btn"
                disabled={isExtracting}
                onClick={runAiExtraction}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B66F5] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#2F52C7] focus:outline-none disabled:opacity-50 transition-all shrink-0 cursor-pointer"
              >
                {isExtracting ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-white stroke-[2.2]" />
                )}
                AI Auto-Extract From Documents
              </button>
            </div>

            {/* AI Extraction logging layer overlay */}
            {isExtracting && (
              <div className="mb-4 rounded-xl bg-[#F3F6FD] p-4 text-xs font-semibold text-[#3B66F5] border border-[#EBEFF8] flex items-center gap-3">
                <Loader className="h-4.5 w-4.5 animate-spin text-[#3B66F5] shrink-0 stroke-[2.2]" />
                <div className="space-y-0.5">
                  <p className="font-extrabold uppercase tracking-widest text-[9px]">AI Vision Scanner Active</p>
                  <p className="text-[#8C95A6] font-semibold">{extractionLog}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 rounded-xl bg-[#EDFAF0] px-4 py-3 text-xs font-bold text-[#47C965] border border-[#DEF7E5]">
                <p>{successMsg}</p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 rounded-xl bg-[#FFF2F2] p-4 text-xs font-bold text-[#E02020] border border-[#FFE4E4] flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-[#E02020] shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                    Full Name (As in ID)
                  </label>
                  <input
                    id="profile-fullname-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-2.5 px-3.5 text-xs font-bold text-[#1A1D24] focus:border-[#3B66F5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                    Date of Birth (DD/MM/YYYY)
                  </label>
                  <input
                    id="profile-dob-input"
                    type="text"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="E.g., 20/05/1998"
                    className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-2.5 px-3.5 text-xs font-bold text-[#1A1D24] focus:border-[#3B66F5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                    Father's Name
                  </label>
                  <input
                    id="profile-fathername-input"
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Father's full name"
                    className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-2.5 px-3.5 text-xs font-bold text-[#1A1D24] focus:border-[#3B66F5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                    Aadhaar Number
                  </label>
                  <input
                    id="profile-aadhaar-input"
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="E.g., 1234 5678 9012"
                    className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-2.5 px-3.5 text-xs font-bold text-[#1A1D24] focus:border-[#3B66F5] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                    PAN Card Alphanumeric Identification
                  </label>
                  <input
                    id="profile-pan-input"
                    type="text"
                    required
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="E.g., ABCDE1234F"
                    className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-2.5 px-3.5 text-xs font-bold text-[#1A1D24] focus:border-[#3B66F5] focus:outline-none font-mono tracking-widest"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-[#EBEFF8] flex justify-end">
                <button
                  id="profile-save-btn"
                  type="submit"
                  disabled={isSaving || isExtracting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B66F5] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSaving ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Verify & Lock Identity Parameters
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Current Verified Profile Display Card (Right 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-[#EBEFF8] bg-white p-5 shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#EBEFF8] pb-3 mb-4">
                <h2 className="text-xs font-bold text-[#1A1D24] uppercase tracking-wider">
                  Secure Locker Registry
                </h2>
                {profile ? (
                  <span className="flex items-center gap-0.5 text-[9px] font-black text-[#47C965] bg-[#EDFAF0] px-2.5 py-1 rounded-full border border-[#DEF7E5] uppercase tracking-wider">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" /> SECURED ACTIVE
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-[#F5A623] bg-[#FFF9E9] px-2.5 py-1 rounded-full border border-[#FFEFC2] uppercase tracking-wider">
                    DRAFT
                  </span>
                )}
              </div>

              {profile ? (
                <div className="space-y-4">
                  <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#EBEFF8] relative overflow-hidden">
                    <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#EDFAF0] text-[#47C965] font-black text-xs border border-[#DEF7E5]">
                      ✓
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="block text-[9px] font-black text-[#8C95A6] uppercase tracking-wider">Verified Identity Name</span>
                        <span className="text-xs font-black text-[#1A1D24]">{profile.fullName}</span>
                      </div>
                      
                      <div>
                        <span className="block text-[9px] font-black text-[#8C95A6] uppercase tracking-wider">Official Birth Date</span>
                        <span className="text-xs font-black text-[#1A1D24]">{profile.dateOfBirth}</span>
                      </div>

                      <div>
                        <span className="block text-[9px] font-black text-[#8C95A6] uppercase tracking-wider">Filiation (Father Name)</span>
                        <span className="text-xs font-black text-[#1A1D24]">{profile.fatherName}</span>
                      </div>

                      <div>
                        <span className="block text-[9px] font-black text-[#8C95A6] uppercase tracking-wider">UIDAI Aadhaar Token</span>
                        <span className="text-xs font-bold text-[#3B66F5] font-mono">{profile.aadhaarNumber}</span>
                      </div>

                      <div>
                        <span className="block text-[9px] font-black text-[#8C95A6] uppercase tracking-wider">Tax PAN Registry Hash</span>
                        <span className="text-xs font-bold text-[#3B66F5] font-mono tracking-wider">{profile.panNumber}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#8C95A6] font-bold">
                    Profile synchronized on <span className="text-[#1A1D24]">{profile.updatedAt}</span>
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 my-auto text-[#8C95A6]">
                  <UserIcon className="h-10 w-10 text-[#C4CDDB] mx-auto mb-3 stroke-[1.8]" />
                  <p className="font-extrabold text-[#1A1D24] text-xs">No Verified Parameters Saved</p>
                  <p className="text-[10px] text-[#8C95A6] max-w-[200px] mx-auto mt-1 font-semibold leading-relaxed">
                    Fill the form or click auto-extract above to build identity cards.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl bg-[#F3F6FD] p-4.5 border border-[#EBEFF8] text-[10px] text-[#8C95A6] space-y-1.5 font-semibold leading-relaxed">
              <span className="font-bold text-[#3B66F5] block uppercase tracking-wider">Data Privacy policy sandbox</span>
              <p>
                Your locked student parameters are exclusively compiled inside this sandboxed layout. No external transmission ever occurs without active click authentication.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
