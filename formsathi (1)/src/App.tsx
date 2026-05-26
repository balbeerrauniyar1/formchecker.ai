import React, { useState, useEffect } from "react";
import { User, UploadedDocument, VerifiedProfile } from "./types";
import {
  getCurrentUser,
  getDocumentsForUser,
  getVerifiedProfile,
} from "./utils/storage";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import DocumentWallet from "./components/DocumentWallet";
import MyProfile from "./components/MyProfile";
import FormChecker from "./components/FormChecker";
import SizerSathi from "./components/SizerSathi";
import PrivacyPolicy from "./components/PrivacyPolicy";
import JobHub from "./components/JobHub";
import ArchitectureDocs from "./components/ArchitectureDocs";
import DashboardHome from "./components/DashboardHome";
import PasswordVault from "./components/PasswordVault";
import AIChatBox from "./components/AIChatBox";
import ChromeExtensionHub from "./components/ChromeExtensionHub";
import { ShieldCheck, Search, Command } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentUser, setSessionUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [profile, setProfile] = useState<VerifiedProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const u: User = {
          id: user.uid,
          email: user.email || "",
          fullName: user.displayName || user.email?.split("@")[0] || "User",
          isVerified: user.emailVerified,
        };
        setSessionUser(u);
        await syncUserData(u.id);
      } else {
        setSessionUser(null);
        setDocuments([]);
        setProfile(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const syncUserData = async (userId: string) => {
    try {
      const docs = await getDocumentsForUser(userId);
      const prof = await getVerifiedProfile(userId);
      setDocuments(docs);
      setProfile(prof);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    await syncUserData(user.id);
    setActiveTab("home");
  };

  const handleLogout = async () => {
    if (
      confirm(
        "For absolute privacy, do you wish to log out and secure your FormSathi locker?",
      )
    ) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDocumentsUpdated = async () => {
    if (currentUser) {
      await syncUserData(currentUser.id);
    }
  };

  const handleProfileUpdated = async () => {
    if (currentUser) {
      await syncUserData(currentUser.id);
    }
  };

  const renderActiveTabContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case "wallet":
        return (
          <DocumentWallet
            currentUser={currentUser}
            documents={documents}
            onDocumentsUpdated={handleDocumentsUpdated}
            profileData={profile}
          />
        );
      case "profile":
        return (
          <MyProfile
            currentUser={currentUser}
            documents={documents}
            onProfileUpdated={handleProfileUpdated}
          />
        );
      case "checker":
        return <FormChecker currentUser={currentUser} documents={documents} />;
      case "sizer":
        return (
          <SizerSathi
            currentUser={currentUser}
            onDocumentsUpdated={handleDocumentsUpdated}
            documents={documents}
          />
        );
      case "vault":
        return <PasswordVault currentUser={currentUser} />;
      case "devdocs":
        return <ArchitectureDocs onBack={() => setActiveTab("wallet")} />;
      case "uploader":
        return (
          <DocumentWallet
            currentUser={currentUser}
            documents={documents}
            onDocumentsUpdated={handleDocumentsUpdated}
            profileData={profile}
          />
        );
      case "hub":
        return <JobHub currentUser={currentUser} />;
      case "extension":
        return <ChromeExtensionHub />;
      default:
        return (
          <DocumentWallet
            currentUser={currentUser}
            documents={documents}
            onDocumentsUpdated={handleDocumentsUpdated}
            profileData={profile}
          />
        );
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FA] text-[#1A1D24]">
        <div className="text-center">
          <ShieldCheck className="h-10 w-10 text-[#3B66F5] mx-auto animate-pulse" />
          <p className="mt-4 text-xs font-bold tracking-wider text-[#8C95A6] uppercase">
            Securing Workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F6FA] text-[#1A1D24] overflow-hidden font-sans">
      {!currentUser ? (
        <div className="w-full h-full overflow-y-auto bg-[#F4F6FA]">
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <>
          <Sidebar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            profileIsVerified={!!profile}
          />

          <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#F4F6FA]">
            {activeTab === "home" ? (
              <DashboardHome
                currentUser={currentUser}
                documents={documents}
                setActiveTab={setActiveTab}
              />
            ) : (
              <>
                {/* Top Toolbar */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-[#EBEFF8] bg-white z-10 shadow-sm shadow-[#3B66F5]/1">
                  <div className="flex-1 max-w-xl">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3.5 h-4 w-4 text-[#8C95A6]" />
                      <input
                        type="text"
                        placeholder="Search documents, passwords, or insights..."
                        className="w-full bg-[#F4F6FA] border border-[#EBEFF8] rounded-xl pl-10 pr-12 py-2.5 text-xs font-semibold text-[#1A1D24] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/50 transition-all placeholder:text-[#8C95A6]"
                      />
                      <div className="absolute right-3 flex items-center gap-1">
                        <kbd className="bg-white border border-[#EBEFF8] text-[#8C95A6] text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm">
                          <Command className="h-3 w-3 inline" /> K
                        </kbd>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="bg-[#3B66F5] hover:bg-[#2F52C7] text-white text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all shadow-md shadow-[#3B66F5]/10 cursor-pointer">
                      Invite Team
                    </button>
                  </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F4F6FA]">
                  <div className="max-w-6xl mx-auto space-y-8 pb-32">
                    {/* Greeting Header */}
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black text-[#8C95A6] tracking-tight">
                        Hello, {currentUser.fullName.split(" ")[0]}
                      </h2>
                      <h1 className="text-3xl font-black text-[#1A1D24] tracking-tight">
                        How can I help you today?
                      </h1>
                    </div>

                    {/* Workspace Navigation Pills */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide border-b border-[#EBEFF8] mb-6">
                      {[
                        { label: "Document Vault", id: "wallet" },
                        { label: "AI Form Checker", id: "checker" },
                        { label: "Job & Scholarship Hub", id: "hub" },
                        { label: "Extension", id: "extension" },
                        { label: "Setup Guide", id: "devdocs" },
                        { label: "My Profile", id: "profile" },
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => setActiveTab(pill.id)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                            activeTab === pill.id
                              ? "bg-[#F3F6FD] text-[#3B66F5] border-[#3B66F5]/10 shadow-sm"
                              : "bg-white text-[#8C95A6] hover:bg-[#FAFBFD] hover:text-[#1A1D24] border-[#EBEFF8]"
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Component Outlet with unique animated border frame */}
                    <div className="relative rounded-3xl bg-white border border-[#EBEFF8] overflow-hidden min-h-[500px] shadow-[0_12px_40px_rgba(59,102,245,0.015)]">
                      {/* Decorative top brand line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B66F5] via-indigo-400 to-[#F5A623]"></div>

                      <div className="p-6 h-full">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                          >
                            {renderActiveTabContent()}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </main>
              </>
            )}
          </div>

          <div className="fixed bottom-6 right-8 w-80 z-50">
            <AIChatBox
              currentUser={currentUser}
              profileData={profile}
              documents={documents}
            />
          </div>
        </>
      )}
    </div>
  );
}
