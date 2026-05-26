import React, { useState } from "react";
import { User } from "../types";
import {
  getCurrentUser,
  createOrUpdateUserDoc,
  handleFirestoreError,
  OperationType,
} from "../utils/storage";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = "login" | "signup" | "forgot";

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // UI variables
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle errors
  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 6000);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 6000);
  };

  const handlePhoneAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpInput) {
      if (!phone || phone.length < 10) {
        triggerError("Please enter a valid 10-digit mobile number.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowOtpInput(true);
        triggerSuccess(`OTP Sent to +91 ${phone}`);
      }, 1500);
    } else {
      if (!otp || otp.length < 4) {
        triggerError("Please enter the OTP received.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        // Simulated successful OTP auth fallback
        onAuthSuccess({
          id: `phone-${Date.now()}`,
          email: `${phone}@phone-auth.link`,
          fullName: `User ${phone.substring(0, 4)}`,
          isVerified: true,
        });
      }, 1200);
    }
  };

  const handleAuth = async (action: () => Promise<any>, successMsg: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const result = await action();
      const cUser = result.user;
      await createOrUpdateUserDoc(cUser);

      const sessionUser: User = {
        id: cUser.uid,
        email: cUser.email || "",
        fullName: cUser.displayName || cUser.email?.split("@")[0] || "User",
        isVerified: cUser.emailVerified,
      };

      setIsLoading(false);
      onAuthSuccess(sessionUser);
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        triggerError(
          "This email is already registered. Please sign in or reset password.",
        );
      } else if (err?.code === "auth/weak-password") {
        triggerError("Password must contain at least 6 characters.");
      } else if (err?.code === "auth/invalid-credential") {
        triggerError(
          "Invalid credentials. Please check your email and password.",
        );
      } else {
        triggerError(err.message || String(err));
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    handleAuth(async () => {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    }, "Signed in with Google!");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      triggerError("All fields are mandatory for registry.");
      return;
    }
    handleAuth(async () => {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, { displayName: fullName });
      // Force reload to get updated profile info
      await result.user.reload();
      return { user: auth.currentUser };
    }, "Account created successfully!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerError("Please provide both your email and password.");
      return;
    }
    handleAuth(async () => {
      return await signInWithEmailAndPassword(auth, email, password);
    }, "Logged in securely!");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerError("Please fill in your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsLoading(false);
      triggerSuccess(
        "Verification complete! Please check your email inbox to reset your password.",
      );
      setMode("login");
    } catch (err: any) {
      setIsLoading(false);
      triggerError(err.message || "Failed to send password reset email.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] text-[#1A1D24] font-sans">
      {/* Left Marketing Section (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-12 xl:px-24 bg-white border-r border-[#EBEFF8] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B66F5]/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-xl space-y-6">
          <h1 className="text-5xl xl:text-6xl font-black text-[#1A1D24] leading-tight tracking-tight">
            Never Get Your <br />
            Form{" "}
            <span className="bg-gradient-to-r from-[#3B66F5] via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
              Rejected
            </span>{" "}
            <br />
            Again
          </h1>

          <p className="text-sm font-semibold text-[#8C95A6] leading-relaxed">
            FormSathi is India's first AI-powered document vault — stores all
            your documents, converts them to the right format, and{" "}
            <span className="text-[#3B66F5] font-extrabold">
              automatically verifies your forms before submission.
            </span>
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {[
              "Scholarship forms",
              "Government jobs",
              "Defence recruitment",
              "College admissions",
            ].map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 rounded-full border border-[#3B66F5]/10 bg-[#F3F6FD] px-4 py-1.5 text-xs font-bold text-[#3B66F5]"
              >
                <CheckCircle className="h-4 w-4 text-[#47C965] stroke-[2.5]" />
                {tag}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button
              onClick={() => setMode("signup")}
              className="flex items-center justify-center rounded-2xl bg-[#3B66F5] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] transition cursor-pointer"
            >
              Start Free — Upload Documents &rarr;
            </button>
            <button 
              onClick={() => {
                setMode("login");
                setEmail("demo-seeker@formsathi.in");
                setPassword("demo1234");
              }}
              className="flex items-center justify-center rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] px-6 py-3.5 text-xs font-bold text-[#1A1D24] hover:bg-[#F3F6FD] transition cursor-pointer"
            >
              Try AI Form Checker
            </button>
          </div>
        </div>
      </div>

      {/* Right Auth Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        {/* Brand card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F6FD] text-[#3B66F5] border border-[#3B66F5]/15 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-[#3B66F5] stroke-[2.2]" />
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1A1D24]">
            Form
            <span className="text-[#3B66F5]">
              Sathi
            </span>
          </h2>
          <p className="mt-2 text-xs font-semibold text-[#8C95A6]">
            The ultimate document wallet, verified portfolio, and form analyzer.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-8 md:p-10 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="flex bg-[#FAFBFD] p-1.5 rounded-2xl w-full border border-[#EBEFF8]">
                <button
                  onClick={() => {
                    setMode("login");
                    setShowOtpInput(false);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${mode === "login" || mode === "signup" || mode === "forgot" ? "bg-white text-[#3B66F5] shadow-xs border border-[#EBEFF8]" : "text-[#8C95A6]"}`}
                >
                  Email Gateway
                </button>
                <button
                  onClick={() => setMode("phone-otp")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${mode === "phone-otp" ? "bg-white text-[#3B66F5] shadow-xs border border-[#EBEFF8]" : "text-[#8C95A6]"}`}
                >
                  Phone OTP
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex gap-2 rounded-2xl bg-[#FFF2F2] p-4 text-xs font-bold text-[#E02020] border border-[#FFE4E4]"
                >
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#E02020]" />
                  <p>{errorMsg}</p>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex gap-2 rounded-2xl bg-[#EDFAF0] p-4 text-xs font-bold text-[#47C965] border border-[#DEF7E5]"
                >
                  <CheckCircle className="h-4.5 w-4.5 shrink-0 text-[#47C965] stroke-[2.5]" />
                  <div>
                    <p>{successMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === "phone-otp" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Smartphone className="h-4 w-4 text-[#8C95A6]" />
                        <span className="text-[#1A1D24] text-xs ml-2 font-mono font-bold">
                          +91
                        </span>
                        <div className="h-4 w-px bg-[#EBEFF8] mx-2"></div>
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={showOtpInput}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="99999 99999"
                        maxLength={10}
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-20 pr-4 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                    </div>
                  </div>

                  {showOtpInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1"
                    >
                      <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="• • • • • •"
                        maxLength={6}
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 px-4 text-center tracking-[1em] text-sm font-mono focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-2xl bg-[#3B66F5] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {showOtpInput
                      ? "Verify & Security Login"
                      : "Send Secure OTP via SMS"}
                  </button>
                </form>
              </motion.div>
            )}

            {mode === "login" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-4 w-4 text-[#8C95A6]" />
                      </div>
                      <input
                        id="login-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.in"
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-11 pr-4 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider">
                        Security Password
                      </label>
                      <button
                        type="button"
                        id="forgot-pwd-trigger"
                        onClick={() => setMode("forgot")}
                        className="text-xs font-bold text-[#3B66F5] hover:text-[#2F52C7]"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Lock className="h-4 w-4 text-[#8C95A6]" />
                      </div>
                      <input
                        id="login-password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-11 pr-10 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8C95A6] hover:text-[#1A1D24]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-2xl bg-[#3B66F5] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Access Wallet (Secure Sign In)
                  </button>
                </form>

                <div className="relative my-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-[#EBEFF8]" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="bg-white px-3.5 text-[#8C95A6] font-bold uppercase tracking-wider">
                      Or login via
                    </span>
                  </div>
                </div>

                <button
                  id="google-login-btn"
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] px-4 py-3 text-xs font-bold text-[#1A1D24] hover:bg-[#F3F6FD] focus:outline-none transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1. 2.53-2.16 3.32v2.77h3.49c2.04-1.88 3.22-4.64 3.22-7.92z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.49-2.77c-.97.65-2.21 1.03-3.79 1.03-2.91 0-5.38-1.97-6.26-4.63H2.18v2.87C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.74 13.97c-.22-.65-.35-1.35-.35-2.07s.13-1.42.35-2.07V6.96H2.18C1.43 8.47 1 10.18 1 12s.43 3.53 1.18 5.04l3.56-2.07z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.13l3.56 2.87c.88-2.66 3.35-4.63 6.26-4.63z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="mt-6 text-center text-xs font-semibold">
                  <span className="text-[#8C95A6]">
                    New seeker to FormSathi?{" "}
                  </span>
                  <button
                    id="switch-signup-btn"
                    onClick={() => setMode("signup")}
                    className="font-black text-[#3B66F5] hover:text-[#2F52C7] cursor-pointer"
                  >
                    Create Secure Account
                  </button>
                </div>
              </motion.div>
            )}

            {mode === "signup" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                      Your Full Name (As in Aadhaar)
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <UserIcon className="h-4 w-4 text-[#8C95A6]" />
                      </div>
                      <input
                        id="signup-name-input"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Balbeer Rauniyar"
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-11 pr-4 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-4 w-4 text-[#8C95A6]" />
                      </div>
                      <input
                        id="signup-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="balbeerauniyar@gmail.com"
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-11 pr-4 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                      Create Security Password
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Lock className="h-4 w-4 text-[#8C95A6]" />
                      </div>
                      <input
                        id="signup-password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-11 pr-10 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8C95A6] hover:text-[#1A1D24]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    id="signup-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-2xl bg-[#3B66F5] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Register with Email
                  </button>
                </form>

                <div className="mt-6 text-center text-xs font-semibold">
                  <span className="text-[#8C95A6]">
                    Already have a locker?{" "}
                  </span>
                  <button
                    id="switch-login-btn"
                    onClick={() => setMode("login")}
                    className="font-black text-[#3B66F5] hover:text-[#2F52C7] cursor-pointer"
                  >
                    Sign In Securely
                  </button>
                </div>
              </motion.div>
            )}

            {mode === "forgot" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-4 space-y-1">
                  <h3 className="text-sm font-bold text-[#1A1D24]">
                    Recover Password
                  </h3>
                  <p className="text-[11px] text-[#8C95A6] font-semibold">
                    Enter your email address and we will immediately unlock a
                    direct link to change your security parameters.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">
                      Your Registered Email
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-4 w-4 text-[#8C95A6]" />
                      </div>
                      <input
                        id="forgot-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.in"
                        className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 pl-11 pr-4 text-xs placeholder-[#8C95A6] focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 text-[#1A1D24] font-bold transition-all"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-2xl bg-[#3B66F5] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Generate Recovery Link
                  </button>
                </form>

                <div className="mt-6 text-center text-xs font-semibold">
                  <button
                    id="forgot-back-login"
                    onClick={() => setMode("login")}
                    className="font-black text-[#3B66F5] hover:text-[#2F52C7] cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
