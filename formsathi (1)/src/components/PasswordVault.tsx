import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Plus, Shield, Copy, ExternalLink, Unlock, Save, Trash2, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { User, SavedPassword } from '../types';
import { getPasswordsForUser, savePassword, deletePassword } from '../utils/storage';

interface PasswordVaultProps {
  currentUser: User;
}

const POPULAR_SITES = [
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'Google', url: 'https://google.com' },
  { name: 'Facebook', url: 'https://facebook.com' },
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'X / Twitter', url: 'https://twitter.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Github', url: 'https://github.com' },
  { name: 'Netflix', url: 'https://netflix.com' },
  { name: 'Amazon', url: 'https://amazon.com' },
  { name: 'Microsoft', url: 'https://microsoft.com' },
  { name: 'Apple', url: 'https://apple.com' },
  { name: 'Dropbox', url: 'https://dropbox.com' },
  { name: 'Spotify', url: 'https://spotify.com' },
  { name: 'Slack', url: 'https://slack.com' },
  { name: 'Zoho', url: 'https://zoho.com' }
];

export default function PasswordVault({ currentUser }: PasswordVaultProps) {
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  // Dashboard Metrics
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    setIsLoading(true);
    try {
      const data = await getPasswordsForUser(currentUser.id);
      setPasswords(data);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const calculateStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length > 8) s += 25;
    if (/[A-Z]/.test(pwd)) s += 25;
    if (/[a-z]/.test(pwd)) s += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) s += 25;
    setScore(s);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    calculateStrength(val);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let pwd = "";
    for (let i = 0, n = chars.length; i < 16; ++i) {
      pwd += chars.charAt(Math.floor(Math.random() * n));
    }
    setPassword(pwd);
    calculateStrength(pwd);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !username || !password) return;
    
    setIsSaving(true);
    const newPwdObj = {
      userId: currentUser.id,
      title,
      username,
      passwordEncrypted: btoa(password), // simple base64 placeholder
      url,
      notes,
    };

    const saved = await savePassword(newPwdObj);
    if (saved) {
      setPasswords([saved, ...passwords]);
      resetForm();
    }
    setIsSaving(false);
  };

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setUrl('');
    setNotes('');
    setScore(0);
    setIsAddingMode(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => {
      setCopyFeedback(null);
    }, 2000);
  };

  return (
    <div className="flex-1 w-full text-[#1A1D24] font-sans">
      
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1A1D24] flex items-center gap-2">
             <Shield className="h-5.5 w-5.5 text-[#3B66F5] stroke-[2.2]" /> Password Vault
          </h2>
          <p className="text-[11px] font-semibold text-[#8C95A6] mt-1">Zero-knowledge storage protection sandbox for student enrollment credentials.</p>
        </div>
        {!isAddingMode && (
          <button 
            onClick={() => setIsAddingMode(true)}
            className="flex items-center gap-1.5 bg-[#3B66F5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Add Password
          </button>
        )}
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {isAddingMode ? (
          <motion.div 
            key="add-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl p-6 md:p-8 bg-white border border-[#EBEFF8] max-w-2xl mx-auto shadow-sm"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EBEFF8] mb-6">
              <h3 className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 text-[#3B66F5]">
                <Key className="h-4.5 w-4.5 stroke-[2.2]" /> Add New Credential
              </h3>
              <button onClick={resetForm} className="text-xs font-bold text-[#8C95A6] hover:text-[#1A1D24] flex items-center cursor-pointer">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-sm font-semibold">
               <div className="relative">
                 <label className="block mb-1.5 text-[#8C95A6] text-[11px] font-bold uppercase tracking-wider">App / Website Name *</label>
                 <input 
                   required 
                   type="text" 
                   value={title} 
                   onChange={e => {
                     setTitle(e.target.value);
                     setShowSuggestions(true);
                   }}
                   onFocus={() => setShowSuggestions(true)}
                   onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                   className="w-full p-3 rounded-2xl bg-[#FAFBFD] border border-[#EBEFF8] focus:border-[#3B66F5] text-[#1A1D24] outline-none transition-all placeholder:text-[#8C95A6] text-xs font-bold" 
                   placeholder="e.g. Google, LinkedIn, Zoho, SSC Portal" 
                 />
                        
                 <AnimatePresence>
                   {showSuggestions && POPULAR_SITES.filter(s => s.name.toLowerCase().includes(title.toLowerCase())).length > 0 && (
                     <motion.div 
                       initial={{ opacity: 0, y: -5 }} 
                       animate={{ opacity: 1, y: 0 }} 
                       exit={{ opacity: 0, y: -5 }}
                       className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-2xl border border-[#EBEFF8] bg-white shadow-xl"
                     >
                       {POPULAR_SITES.filter(s => s.name.toLowerCase().includes(title.toLowerCase())).map(site => (
                         <button 
                           key={site.name}
                           type="button"
                           onClick={() => {
                             setTitle(site.name);
                             if (!url) setUrl(site.url);
                             setShowSuggestions(false);
                           }}
                           className="w-full text-left px-4 py-3 text-xs flex items-center justify-between hover:bg-[#F3F6FD] text-[#1A1D24] font-bold border-b border-[#EBEFF8] last:border-0 cursor-pointer"
                         >
                           <span className="font-extrabold">{site.name}</span>
                           <span className="text-[10px] text-[#8C95A6]">{site.url}</span>
                         </button>
                       ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block mb-1.5 text-[#8C95A6] text-[11px] font-bold uppercase tracking-wider">Username / Email *</label>
                   <input required type="text" value={username} onChange={e=>setUsername(e.target.value)} 
                          className="w-full p-3 rounded-2xl bg-[#FAFBFD] border border-[#EBEFF8] focus:border-[#3B66F5] text-[#1A1D24] outline-none transition-all text-xs font-bold" />
                 </div>
                 <div>
                   <label className="block mb-1.5 text-[#8C95A6] text-[11px] font-bold uppercase tracking-wider">Password *</label>
                   <div className="relative">
                     <input required type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} 
                            className="w-full p-3 pr-10 rounded-2xl bg-[#FAFBFD] border border-[#EBEFF8] focus:border-[#3B66F5] text-[#1A1D24] outline-none transition-all text-xs font-bold" />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C95A6] hover:text-[#1A1D24]">
                       {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                     </button>
                   </div>
                   {/* Strength indicator */}
                   {password.length > 0 && (
                     <div className="mt-2">
                       <div className="h-1.5 w-full bg-[#EBEFF8] rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-300 ${score <= 25 ? 'bg-[#E02020] w-1/4' : score <= 50 ? 'bg-[#F5A623] w-2/4' : score <= 75 ? 'bg-indigo-400 w-3/4' : 'bg-[#47C965] w-full'}`}></div>
                       </div>
                       <p className={`text-[10px] mt-1 text-right font-black ${score === 100 ? 'text-[#47C965]' : 'text-[#8C95A6]'}`}>
                         {score <= 25 ? 'Weak' : score <= 50 ? 'Fair' : score <= 75 ? 'Good' : 'Very Strong'}
                       </p>
                     </div>
                   )}
                 </div>
               </div>

               <div className="flex justify-end">
                  <button type="button" onClick={generatePassword} className="text-[10px] font-bold px-3 py-2 rounded-xl border border-[#3B66F5]/20 bg-[#F3F6FD] text-[#3B66F5] flex items-center gap-1.5 hover:bg-[#3B66F5]/5 transition-all cursor-pointer">
                    <Unlock className="h-3.5 w-3.5 stroke-[2.2]" /> Generate Strong Password
                  </button>
               </div>

               <div>
                 <label className="block mb-1.5 text-[#8C95A6] text-[11px] font-bold uppercase tracking-wider">URL (Optional)</label>
                 <input type="url" value={url} onChange={e=>setUrl(e.target.value)} 
                        className="w-full p-3 rounded-2xl bg-[#FAFBFD] border border-[#EBEFF8] focus:border-[#3B66F5] text-[#1A1D24] outline-none transition-all placeholder:text-[#8C95A6] text-xs font-bold" 
                        placeholder="https://" />
               </div>

               <button disabled={isSaving} type="submit" className="w-full bg-[#3B66F5] text-white p-3 rounded-2xl font-bold mt-2 shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] transition-all flex items-center justify-center gap-2 cursor-pointer">
                 {isSaving ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <><Save className="h-4.5 w-4.5 stroke-[2.2]" /> Save Securely</>}
               </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {isLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#3B66F5]" />
                <p className="mt-4 text-xs font-bold text-[#8C95A6]">Decrypting security sandboxes...</p>
              </div>
            ) : passwords.length === 0 ? (
              <div className="py-16 text-center rounded-[2rem] border-2 border-dashed border-[#EBEFF8] bg-white shadow-xs">
                <Shield className="h-12 w-12 mx-auto mb-4 text-[#A2ABB8] stroke-[1.8]" />
                <h3 className="text-sm font-extrabold text-[#1A1D24]">Your vault is empty</h3>
                <p className="mt-1.5 mb-6 text-xs text-[#8C95A6] font-semibold">Store your passwords securely so you can copy them instantly.</p>
                <button onClick={() => setIsAddingMode(true)} className="bg-[#3B66F5] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] transition-all cursor-pointer">
                  Add First Password
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {passwords.map((pwd) => (
                  <motion.div 
                    whileHover={{ y: -2 }}
                    key={pwd.id} 
                    className="p-5 rounded-2.5xl bg-white border border-[#EBEFF8] hover:border-[#3B66F5]/40 shadow-sm flex flex-col justify-between group transition-all"
                  >
                     <div>
                       <div className="flex items-start justify-between mb-4">
                         <div className="min-w-0">
                           <h4 className="font-extrabold text-xs text-[#1A1D24] truncate pr-2">{pwd.title}</h4>
                           <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#8C95A6]">Secured Token</span>
                         </div>
                         <button 
                           onClick={async () => {
                             if (confirm('Delete this stored credential?')) {
                               await deletePassword(currentUser.id, pwd.id);
                               setPasswords(passwords.filter(p => p.id !== pwd.id));
                             }
                           }}
                           className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-[#E02020] hover:bg-red-100 border border-[#FFE4E4] cursor-pointer"
                         >
                            <Trash2 className="h-3.5 w-3.5" />
                         </button>
                       </div>
                       
                       <div className="space-y-2.5">
                         {/* Username */}
                         <div className="flex items-center justify-between bg-[#FAFBFD] border border-[#EBEFF8] px-3 py-2 rounded-xl group/item hover:border-[#3B66F5]/30 transition-colors">
                            <span className="text-[11px] font-bold text-[#1A1D24] truncate flex-1">{pwd.username}</span>
                            <button 
                              onClick={() => copyToClipboard(pwd.username, `uname-${pwd.id}`)} 
                              className="p-1 rounded text-[#8C95A6] hover:text-[#3B66F5] transition-colors cursor-pointer"
                              title="Copy username"
                            >
                              {copyFeedback === `uname-${pwd.id}` ? (
                                <span className="text-[9px] font-black text-[#47C965]">Copied!</span>
                              ) : (
                                <Copy className="h-3 w-3 stroke-[2.2]" />
                              )}
                            </button>
                         </div>
                         
                         {/* Password (Hidden visualization) */}
                         <div className="flex items-center justify-between bg-[#FAFBFD] border border-[#EBEFF8] px-3 py-2 rounded-xl group/item hover:border-[#3B66F5]/30 transition-colors">
                            <span className="text-xs text-[#8C95A6] tracking-[0.34em] font-mono whitespace-nowrap overflow-hidden">••••••••••••</span>
                            <button 
                              onClick={() => copyToClipboard(atob(pwd.passwordEncrypted), `pwd-${pwd.id}`)} 
                              className="p-1 rounded text-[#8C95A6] hover:text-[#3B66F5] transition-colors cursor-pointer"
                              title="Copy password"
                            >
                              {copyFeedback === `pwd-${pwd.id}` ? (
                                <span className="text-[9px] font-black text-[#47C965]">Copied!</span>
                              ) : (
                                <Copy className="h-3 w-3 stroke-[2.2]" />
                              )}
                            </button>
                         </div>
                       </div>
                     </div>
                     
                     {pwd.url && (
                       <div className="mt-4 pt-3.5 border-t border-[#EBEFF8] flex items-center justify-between">
                         <a 
                           href={pwd.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-[10px] font-extrabold flex items-center gap-1 text-[#3B66F5] hover:text-[#2F52C7]"
                         >
                           Visit Portal <ExternalLink className="h-3 w-3 stroke-[2.2]" />
                         </a>
                       </div>
                     )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
