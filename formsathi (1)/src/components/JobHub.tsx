import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../firebase';
import { collection as firestoreCollection, query as firestoreQuery, where as firestoreWhere, getDocs as firestoreGetDocs, addDoc as firestoreAddDoc, deleteDoc as firestoreDeleteDoc, doc as firestoreDoc, orderBy } from 'firebase/firestore';
import { Calendar, ExternalLink, BellRing, Clock, Plus, Loader, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobHubProps {
  currentUser: User;
}

interface Reminder {
  id: string;
  userId: string;
  title: string;
  link: string;
  reminderDate: string; // ISO string
  lastDate: string; // ISO string
  notified: boolean;
}

const PORTALS = [
  { id: 'upsc', name: 'UPSC', desc: 'Union Public Service Commission - Official Portal', link: 'https://upsc.gov.in/' },
  { id: 'ssc', name: 'SSC', desc: 'Staff Selection Commission - Latest Updates & Forms', link: 'https://ssc.nic.in/' },
  { id: 'ibps', name: 'IBPS', desc: 'Institute of Banking Personnel Selection', link: 'https://www.ibps.in/' },
  { id: 'railway', name: 'RRB', desc: 'Railway Recruitment Boards - Official Jobs', link: 'https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,4,1244' },
  { id: 'ncs', name: 'NCS', desc: 'National Career Service - Ministry of Labour', link: 'https://www.ncs.gov.in/' },
  { id: 'nsp', name: 'National Scholarship Portal', desc: 'Centralized Portal for Government Scholarships', link: 'https://scholarships.gov.in/' },
  { id: 'neet', name: 'NEET', desc: 'National Eligibility cum Entrance Test', link: 'https://neet.nta.nic.in/' },
  { id: 'jee', name: 'JEE Main', desc: 'Joint Entrance Examination', link: 'https://jeemain.nta.nic.in/' },
  { id: 'ugc', name: 'UGC NET', desc: 'University Grants Commission National Eligibility Test', link: 'https://ugcnet.nta.nic.in/' },
];

export default function JobHub({ currentUser }: JobHubProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<typeof PORTALS[0] | null>(null);
  const [lastDate, setLastDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, [currentUser]);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const q = firestoreQuery(
        firestoreCollection(db, 'reminders'),
        firestoreWhere('userId', '==', currentUser.id),
      );
      const querySnapshot = await firestoreGetDocs(q);
      const fetched: Reminder[] = [];
      querySnapshot.forEach((d) => {
        fetched.push({ id: d.id, ...d.data() } as Reminder);
      });
      // Sort by last date locally
      fetched.sort((a, b) => new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime());
      setReminders(fetched);
    } catch (e) {
      console.error("Error fetching reminders", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastDate || !selectedPortal) return;

    setIsSaving(true);
    try {
      // Calculate reminderDate = lastDate - 3 days
      const d = new Date(lastDate);
      const remDate = new Date(d);
      remDate.setDate(d.getDate() - 3);

      const newRem = {
        userId: currentUser.id,
        title: selectedPortal.name + ' Application deadline',
        link: selectedPortal.link,
        reminderDate: remDate.toISOString(),
        lastDate: d.toISOString(),
        notified: false,
        created_by: 'formsathi_web'
      };

      const docRef = await firestoreAddDoc(firestoreCollection(db, 'reminders'), newRem);
      setReminders([...reminders, { id: docRef.id, ...newRem }].sort((a,b) => new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime()));
      setShowReminderModal(false);
      setLastDate('');
    } catch(e) {
      console.error("Error saving reminder", e);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await firestoreDeleteDoc(firestoreDoc(db, 'reminders', id));
      setReminders(reminders.filter(r => r.id !== id));
    } catch(e) {
      console.error("Error deleting", e);
    }
  };

  const getDaysLeft = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const diffTime = d.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-[#1A1D24]">Job & Scholarship Hub</h2>
        <p className="text-sm font-semibold text-[#8C95A6]">Official portals for exams and scholarships. Set automatic 3-day reminders.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader className="h-6 w-6 animate-spin text-[#3B66F5]" /></div>
      ) : reminders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#1A1D24] uppercase tracking-wide flex items-center gap-2">
            <BellRing className="h-4 w-4 text-[#F5A623]" /> 
            Upcoming Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {reminders.map((r) => {
                const daysLeft = getDaysLeft(r.lastDate);
                const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                
                return (
                  <motion.div 
                    key={r.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-[#EBEFF8] rounded-2xl p-5 shadow-sm relative group"
                  >
                    <button 
                      onClick={() => deleteReminder(r.id)}
                      className="absolute top-4 right-4 text-[#A2ABB8] hover:text-[#E02020] opacity-0 group-hover:opacity-100 transition-opacity bg-[#FAFBFD] p-1.5 rounded-lg border border-[#EBEFF8]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    
                    <h4 className="text-sm font-bold text-[#1A1D24] pr-8">{r.title}</h4>
                    
                    <div className="flex gap-2 items-center mt-3 mb-1 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-[#8C95A6]" />
                      <span className="text-[#555E6E] font-medium">Last Date: <span className="font-bold">{new Date(r.lastDate).toLocaleDateString()}</span></span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      {daysLeft < 0 ? (
                        <span className="px-2.5 py-1 rounded-lg bg-[#FAFBFD] text-[#8C95A6] text-[10px] font-bold border border-[#EBEFF8]">Expired</span>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${isUrgent ? 'bg-[#FFF2F2] text-[#E02020] border-[#FFE4E4]' : 'bg-[#EDFAF0] text-[#47C965] border-[#DEF7E5]'}`}>
                          {daysLeft === 0 ? 'Today is the last day!' : `${daysLeft} Days Left`}
                        </span>
                      )}
                      
                      <a href={r.link} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#3B66F5] hover:text-[#2F52C7]">Apply Now</a>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-[#1A1D24] uppercase tracking-wide mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#3B66F5]" /> 
          Official Portals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PORTALS.map((portal) => (
            <div key={portal.id} className="bg-white border border-[#EBEFF8] rounded-2.5xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-[#1A1D24] mb-1.5">{portal.name}</h4>
                <p className="text-[11px] text-[#8C95A6] font-semibold leading-relaxed mb-4">{portal.desc}</p>
              </div>
              
              <div className="flex flex-col gap-2 mt-auto">
                <a 
                  href={portal.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full bg-[#FAFBFD] hover:bg-[#F3F6FD] border border-[#EBEFF8] text-[#1A1D24] text-[11px] font-bold py-2.5 rounded-xl transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Visit Portal
                </a>
                <button
                  onClick={() => {
                    setSelectedPortal(portal);
                    setShowReminderModal(true);
                  }}
                  className="flex items-center justify-center gap-1.5 w-full bg-[#3B66F5] hover:bg-[#2F52C7] text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors shadow-xs shadow-[#3B66F5]/10"
                >
                  <BellRing className="h-3.5 w-3.5 text-white/90" /> Set Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal manually built instead of shadcn due to setup ease */}
      <AnimatePresence>
        {showReminderModal && selectedPortal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1D24]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-sm rounded-[2rem] border border-[#EBEFF8] p-6 shadow-xl relative"
            >
              <h3 className="text-lg font-black text-[#1A1D24] mb-2">Set Form Reminder</h3>
              <p className="text-xs font-semibold text-[#8C95A6] mb-6">
                Tell us the last date for <span className="font-bold text-[#1A1D24]">{selectedPortal.name}</span>, and FormSathi will alert you 3 days prior.
              </p>
              
              <form onSubmit={handleSetReminder} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider mb-1.5">Last Application Date</label>
                  <input 
                    type="date" 
                    required
                    value={lastDate}
                    onChange={(e) => setLastDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Can't set in past
                    className="w-full bg-[#FAFBFD] border border-[#EBEFF8] disabled:opacity-50 hover:border-[#3B66F5]/40 focus:border-[#3B66F5] rounded-2xl px-4 py-3 text-sm text-[#1A1D24] font-bold focus:outline-none focus:ring-1 focus:ring-[#3B66F5]/30 transition-all"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowReminderModal(false);
                      setLastDate('');
                    }}
                    className="flex-1 border border-[#EBEFF8] text-[#555E6E] font-bold text-xs py-3 rounded-2xl hover:bg-[#FAFBFD] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving || !lastDate}
                    className="flex-1 bg-[#3B66F5] text-white font-bold text-xs py-3 rounded-2xl shadow-sm hover:bg-[#2F52C7] transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? <Loader className="h-4 w-4 animate-spin text-white" /> : 'Save Reminder'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
