import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Paintbrush, Layers, Code, TestTube, Rocket, Activity, RefreshCcw, ArrowLeft, CheckCircle2, Layout, Database, Server, Smartphone, MonitorSmartphone, Shield, SearchCode, ChevronDown } from 'lucide-react';


interface ArchitectureDocsProps {
  onBack: () => void;
}

const accordionData = [
  {
    id: 1,
    title: '🎯 Planning: Humne kya kiya?',
    points: [
      'Website ka goal: Ek Hindi educational guide banana jo production website banane ka complete process explain kare',
      'Target audience: Hindi-speaking developers jo beginners/intermediate hain',
      'Features list: 8 phases, flow diagrams, step cards, tech stack diagram, testing pyramid, CI/CD pipeline, monitoring dashboard',
      'Timeline: Single page, one-time delivery',
      'Success metric: User ko planning se maintenance tak sab kuch ek jagah mile',
    ]
  },
  {
    id: 2,
    title: '🎨 Design: Kaise design kiya?',
    points: [
      'Dark theme: #0a0e1a background — aankhon pe kam strain',
      'Color system: 5 accent colors (blue, pink, teal, yellow, purple) — har phase ka alag color',
      'Fonts: Baloo 2 (headings) + Noto Sans Devanagari (Hindi body text)',
      'Mobile responsive: 640px breakpoint pe single column',
      'No images used: Emojis as icons, CSS se saare diagrams bane',
      'Hover effects: translateY(-4px) on cards, border color change',
    ]
  },
  {
    id: 3,
    title: '🏗️ Architecture: Kya use hua?',
    points: [
      'Pure HTML5 + CSS3 — koi JavaScript nahi, koi framework nahi (React/Vite setup with Tailwind CSS used here)',
      'CSS Variables: :root mein 10 variables — ek jagah change karo, poori site update',
      'Layout: CSS Flexbox (phase overview, flow rows) + CSS Grid (step cards, monitor grid, deploy diagram)',
      'Animations: @keyframes fadeUp with staggered animation-delay',
      'Pseudo-elements: body::before se animated gradient background',
      'Google Fonts CDN se load hote hain',
    ]
  },
  {
    id: 4,
    title: '💻 Development: Code kaise likha?',
    points: [
      'Component approach: Reusable CSS classes — .step-card, .flow-box, .phase-badge — ek baar define, baar baar use',
      'CSS Custom Properties: --stripe variable se har card ka top border color alag',
      'Semantic HTML: div-soup avoid kiya, meaningful class names',
      'clamp() function: Font size automatically scale hoti hai 32px se 58px tak screen size ke hisaab se',
      'No build tools: Seedha browser mein chalti hai — Node, Webpack, kuch install nahi (Vite environment adapted)',
    ]
  },
  {
    id: 5,
    title: '🧪 Testing: Kaise test kiya?',
    points: [
      'Browser testing: Chrome, Firefox, Safari mein manually check kiya',
      'Mobile testing: DevTools responsive mode — 320px, 375px, 768px, 1440px',
      'Font loading: Google Fonts fallback test kiya',
      'Color contrast: Accessibility ke liye dark bg pe light text verify kiya',
      'No automated tests: Static HTML page ke liye JS testing framework ki zaroorat nahi',
    ]
  },
  {
    id: 6,
    title: '🚀 Deployment: Kaise deploy karein?',
    points: [
      'Option 1: GitHub Pages — free, sirf HTML file upload karo',
      'Option 2: Netlify — drag & drop se deploy, automatic HTTPS',
      'Option 3: Vercel — same as Netlify, CDN globally',
      'Option 4: Any web server — Apache/Nginx pe sirf file rakhdo',
      'No server needed: Static file hai, backend ki zaroorat nahi',
      'SSL: Cloudflare ya hosting provider se free SSL milta hai',
    ]
  },
  {
    id: 7,
    title: '📊 Monitoring: Kya track karein?',
    points: [
      'Google Analytics 4: Page views, bounce rate, time on page',
      'Google Search Console: SEO performance, keyword rankings',
      'Uptime monitoring: UptimeRobot (free) se 5 min interval check',
      'Performance: Google PageSpeed Insights — Lighthouse score',
      'Heatmaps: Hotjar se dekho users kahan click karte hain',
    ]
  },
  {
    id: 8,
    title: '🔄 Maintenance: Kya update karna hoga?',
    points: [
      'Content updates: Naye tools aane pe (e.g., Bun replace Node.js) chips update karo',
      'Font updates: Google Fonts URL current rakho',
      'Browser compatibility: Naye CSS features use karne se pehle caniuse.com check karo',
      'Accessibility audit: Annually WAVE tool se check karo',
      'Link check: Koi external links hain toh broken link checker chalao',
    ]
  }
];

export default function ArchitectureDocs({ onBack }: ArchitectureDocsProps) {
  const [activeHash, setActiveHash] = useState('planning');
  const [openAccordion, setOpenAccordion] = useState<number | null>(1);
  const [selectedDiagram, setSelectedDiagram] = useState<'er' | 'dfd' | 'arch'>('er');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleDownloadProject = async () => {
    setDownloadStatus('loading');
    try {
      const response = await fetch("/api/download-all");
      if (!response.ok) throw new Error("Build ZIP failed on server");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "FormSathi_Complete_Project.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 5000);
    }
  };

  const tabs = [
    { id: 'planning', icon: Target, label: '1. Planning' },
    { id: 'design', icon: Paintbrush, label: '2. UI/UX Design' },
    { id: 'arch', icon: Layers, label: '3. Architecture' },
    { id: 'dev', icon: Code, label: '4. Development' },
    { id: 'testing', icon: TestTube, label: '5. Testing' },
    { id: 'deploy', icon: Rocket, label: '6. Deployment' },
    { id: 'monitor', icon: Activity, label: '7. Monitoring' },
    { id: 'maintain', icon: RefreshCcw, label: '8. Maintenance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1A1D24] tracking-tight">Production Website Complete Guide</h1>
          <p className="text-sm font-semibold text-[#8C95A6] mt-2">Shuru se deployment tak — har ek step, simple diagrams ke saath detail mein.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#EBEFF8] overflow-hidden flex flex-col md:flex-row text-[#1A1D24] min-h-[75vh]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 bg-[#FAFBFD] border-r border-[#EBEFF8] flex-shrink-0 flex flex-col">
          <div className="p-4 flex flex-row overflow-x-auto md:flex-col gap-2 flex-grow scrollbar-hide py-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveHash(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm whitespace-nowrap min-w-max md:min-w-0 cursor-pointer ${
                  activeHash === tab.id 
                    ? 'bg-white text-[#3B66F5] shadow-xs border border-[#EBEFF8]' 
                    : 'text-[#555E6E] hover:bg-white hover:text-[#1A1D24] border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${activeHash === tab.id ? 'bg-[#F3F6FD]' : 'bg-transparent'}`}>
                  <tab.icon className={`h-4.5 w-4.5 ${activeHash === tab.id ? 'stroke-[2.2]' : ''}`} />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white custom-scrollbar relative">
          <AnimatePresence mode="wait">
            
            {/* Phase 1 */}
            {activeHash === 'planning' && (
              <motion.div key="planning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><Target className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 1: Planning & Requirements</h2>
                </div>

                <p className="text-sm text-[#555E6E] font-medium leading-relaxed">
                  Pehle samjho — kya banana hai, kiske liye, kyun banana hai. Bina clear goal ke project fail hota hai.
                </p>

                {/* Flow Diagram */}
                <div className="bg-[#FAFBFD] border border-[#EBEFF8] rounded-3xl p-6 overflow-hidden">
                  <h3 className="text-xs font-black uppercase text-[#8C95A6] mb-6 tracking-widest text-center">Requirement Gathering Flow</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#EBEFF8] -translate-y-1/2 z-0"></div>
                    {['Client Meeting', 'BRD Document', 'User Stories', 'Sign-Off'].map((step, idx) => (
                      <div key={idx} className="relative z-10 bg-white border border-[#EBEFF8] shadow-sm rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[140px]">
                        <span className="text-[#3B66F5] font-black font-mono text-sm mb-2 opacity-50">0{idx + 1}</span>
                        <span className="text-xs font-bold text-[#1A1D24] text-center">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-3"><Layout className="h-4 w-4 text-[#3B66F5]" /> Goal & Audience</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Website ka main purpose kya hai? User persona banao (age, tech savviness, goals). Isse design decisions clear hote hain.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-3"><Layout className="h-4 w-4 text-[#3B66F5]" /> MoSCoW Methodology</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Features list karo aur priority do: Must Have, Should Have, Could Have, Won't Have. Scope creep se bachne ke liye zaroori hai.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow md:col-span-2">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-3"><Layout className="h-4 w-4 text-[#3B66F5]" /> Timeline & Estimates (Agile)</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Discovery, Design, Development, Testing aur Buffer – realistic timeline banao. Sprints effectively plan karo jisse iteration ka scope rahe.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 2 */}
            {activeHash === 'design' && (
              <motion.div key="design" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><Paintbrush className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 2: UI/UX Design</h2>
                </div>

                <p className="text-sm text-[#555E6E] font-medium leading-relaxed">
                  Wireframes se lekar production-ready Figma mockups tak. Design sirf sundar nahi, usable hona chahiye.
                </p>

                {/* Flow Diagram */}
                <div className="bg-[#FAFBFD] border border-[#EBEFF8] rounded-3xl p-6 overflow-hidden">
                  <h3 className="text-xs font-black uppercase text-[#8C95A6] mb-6 tracking-widest text-center">Design Lifecycle</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-[#EBEFF8] -translate-y-1/2 z-0"></div>
                    {['Research & Flow', 'Lo-Fi Wireframe', 'Design System', 'Hi-Fi Prototyping'].map((step, idx) => (
                      <div key={idx} className="relative z-10 bg-[#3B66F5] rounded-full px-5 py-3 shadow-md shadow-[#3B66F5]/20">
                         <span className="text-xs font-bold text-white text-center">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-3"><MonitorSmartphone className="h-4 w-4 text-[#3B66F5]" /> Mobile-First Approach</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">India and global majority ab mobile-first hai (70%+ traffic). Starts with 320px width screens, then scale up to 1440px+.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-3"><MonitorSmartphone className="h-4 w-4 text-[#3B66F5]" /> Accessibility (a11y)</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Contrast ratios check karo, Voice-Over aur keyboard navigation ensure karo. Make sure colors are not the only indicator of success/error.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 3 */}
            {activeHash === 'arch' && (
              <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><Layers className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 3: Tech Architecture</h2>
                </div>

                {/* Architecture Diagram */}
                <div className="bg-[#FAFBFD] border border-[#EBEFF8] rounded-3xl p-8 relative">
                   <h3 className="text-xs font-black uppercase text-[#8C95A6] mb-8 tracking-widest text-center">Modern Cloud Architecture</h3>
                   
                   <div className="flex flex-col gap-6">
                     {/* Client Layer */}
                     <div className="border-2 border-dashed border-[#A2ABB8] rounded-2xl p-4 flex justify-center bg-white relative">
                       <span className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black text-[#8C95A6]">CLIENT TIER</span>
                       <div className="flex gap-4">
                         <div className="bg-[#F3F6FD] border border-[#3B66F5]/20 px-6 py-2 rounded-xl text-xs font-bold text-[#3B66F5]">Browser / Mobile App (React, Next.js)</div>
                       </div>
                     </div>

                     <div className="flex justify-center"><ArrowLeft className="h-4 w-4 text-[#A2ABB8] -rotate-90" /></div>

                     {/* Network Layer */}
                     <div className="border-2 border-dashed border-[#A2ABB8] rounded-2xl p-4 flex justify-center bg-white relative">
                       <span className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black text-[#8C95A6]">NETWORK TIER</span>
                       <div className="flex gap-4">
                         <div className="bg-[#EDFAF0] border border-[#47C965]/20 px-6 py-2 rounded-xl text-xs font-bold text-[#47C965]">Cloudflare CDN / DNS</div>
                         <div className="bg-[#EDFAF0] border border-[#47C965]/20 px-6 py-2 rounded-xl text-xs font-bold text-[#47C965]">Nginx Load Balancer</div>
                       </div>
                     </div>

                     <div className="flex justify-center"><ArrowLeft className="h-4 w-4 text-[#A2ABB8] -rotate-90" /></div>

                     {/* Application Layer */}
                     <div className="border-2 border-dashed border-[#A2ABB8] rounded-2xl p-4 flex justify-between bg-white relative">
                       <span className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black text-[#8C95A6]">APPLICATION & DATA TIER</span>
                       <div className="flex gap-4 w-full justify-center">
                         <div className="bg-[#FFF2F2] border border-[#E02020]/20 px-6 py-4 rounded-xl text-xs font-bold text-[#E02020] text-center">
                           <Server className="h-5 w-5 mx-auto mb-1" />
                           Backend API<br/><span className="font-medium text-[10px]">(Node/Express/Django)</span>
                         </div>
                         <div className="bg-[#FFF2FC] border border-[#E020B2]/20 px-6 py-4 rounded-xl text-xs font-bold text-[#E020B2] text-center">
                           <Database className="h-5 w-5 mx-auto mb-1" />
                           Database<br/><span className="font-medium text-[10px]">(Postgres/Mongo)</span>
                         </div>
                         <div className="bg-[#FFF8F2] border border-[#E07A20]/20 px-6 py-4 rounded-xl text-xs font-bold text-[#CE6C18] text-center">
                           <Layout className="h-5 w-5 mx-auto mb-1" />
                           Cache<br/><span className="font-medium text-[10px]">(Redis)</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] mb-2">ER Diagrams & DB Design</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Tables, relationships, indexes define karo. NoSQL structure depends on access patterns, SQL depends on relational normalized rules.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] mb-2">API Specifications</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">REST boundaries aur GraphQL spec advance mein likho so Frontend and Backend teams can develop in parallel seamlessly.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 4 */}
            {activeHash === 'dev' && (
              <motion.div key="dev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><Code className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 4: Development & Coding</h2>
                </div>

                <div className="bg-[#1A1D24] text-white p-6 rounded-2.5xl font-mono text-sm shadow-lg overflow-x-auto">
                   <div className="flex items-center gap-2 mb-4">
                     <div className="h-3 w-3 rounded-full bg-[#E02020]"></div>
                     <div className="h-3 w-3 rounded-full bg-[#F5A623]"></div>
                     <div className="h-3 w-3 rounded-full bg-[#47C965]"></div>
                   </div>
                   <p className="text-emerald-400"># Git Branching Strategy (GitFlow)</p>
                   <p className="mt-2 text-slate-300">
                     main <span className="text-emerald-400">(production stable)</span><br/>
                     &nbsp;└── develop <span className="text-blue-400">(integration)</span><br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;├── feature/auth-flow<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;├── feature/payment-gateway<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;└── hotfix/critical-bug
                   </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#EBEFF8]">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-2"><CheckCircle2 className="h-4 w-4 text-[#3B66F5]" /> DRY & Components</h4>
                    <p className="text-xs text-[#555E6E]">Don't Repeat Yourself (DRY). Building isolated, robust components (atoms, molecules) via Storybook ensures reusability.</p>
                  </div>
                  <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#EBEFF8]">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-2"><CheckCircle2 className="h-4 w-4 text-[#3B66F5]" /> Code Quality Tooling</h4>
                    <p className="text-xs text-[#555E6E]">ESLint, Prettier, aur Husky githooks lagao jisse bad code push hi na ho. Code review (Pull Request) culture establish karo.</p>
                  </div>
                  <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#EBEFF8]">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-2"><CheckCircle2 className="h-4 w-4 text-[#3B66F5]" /> Security Implementations</h4>
                    <p className="text-xs text-[#555E6E]">OWASP top 10 follow karo. Secrets ko <code>.env</code> file mein rakho. Input sanitization front-end aur backend donon mein karo.</p>
                  </div>
                  <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#EBEFF8]">
                    <h4 className="font-bold text-[#1A1D24] flex items-center gap-2 mb-2"><CheckCircle2 className="h-4 w-4 text-[#3B66F5]" /> Performance Optimization</h4>
                    <p className="text-xs text-[#555E6E]">Lazy loading, modern image formats (WebP), Tree shaking, and bundle analyzing ensure lightning fast load times.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 5 */}
            {activeHash === 'testing' && (
              <motion.div key="testing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><TestTube className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 5: Testing & QA</h2>
                </div>
                
                <p className="text-sm text-[#555E6E] font-medium">Bugs production mein nahi milne chahiye, code integration ke dauran pakdo.</p>

                {/* Testing Pyramid */}
                <div className="bg-[#FAFBFD] border border-[#EBEFF8] rounded-3xl p-8 flex flex-col items-center">
                  <h3 className="text-xs font-black uppercase text-[#8C95A6] mb-8 tracking-widest">The Testing Pyramid</h3>
                  
                  <div className="w-full max-w-sm relative">
                    <div className="flex justify-center mb-2">
                       <div className="w-1/3 bg-[#FFE4E4] text-[#E02020] border-2 border-[#E02020]/20 py-3 rounded-t-xl text-center text-[10px] font-black uppercase shadow-xs">E2E Tests<br/><span className="text-[9px] lowercase font-semibold text-[#E02020]">(Expensive, Slow)</span></div>
                    </div>
                    <div className="flex justify-center mb-2">
                       <div className="w-2/3 bg-[#FFF2CD] text-[#CE6C18] border-2 border-[#E07A20]/20 py-3 text-center text-[11px] font-black uppercase shadow-xs rounded-lg">Integration Tests<br/><span className="text-[9px] lowercase font-semibold text-[#CE6C18]">(Test Apis & DB)</span></div>
                    </div>
                    <div className="flex justify-center">
                       <div className="w-full bg-[#EDFAF0] text-[#47C965] border-2 border-[#47C965]/20 py-4 rounded-b-xl text-center text-xs font-black uppercase shadow-xs">Unit Tests<br/><span className="text-[10px] lowercase font-semibold text-[#47C965]">(Fast, Cheap, Bulk - Jest/Vitest)</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] mb-2 text-sm flex items-center gap-2"><SearchCode className="h-4 w-4 text-[#3B66F5]"/> E2E & Load Testing</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Cypress or Playwright for full user journey. Use k6 or JMeter to simulate 10,000 users concurrently to find bottlenecks.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] mb-2 text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-[#3B66F5]"/> Security Scans</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Penetration tests, dependency vulnerability scans (npm audit/Snyk), and HTTPS/SSL proper configurations.</p>
                  </div>
                </div>
              </motion.div>
            )}

             {/* Phase 6 */}
            {activeHash === 'deploy' && (
              <motion.div key="deploy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><Rocket className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 6: CI/CD & Deployment</h2>
                </div>

                {/* Pipeline Diagram */}
                <div className="bg-[#FAFBFD] border border-[#EBEFF8] rounded-3xl p-6 overflow-hidden">
                  <h3 className="text-xs font-black uppercase text-[#8C95A6] mb-6 tracking-widest text-center">Automated CI/CD Pipeline</h3>
                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 no-scrollbar">
                    
                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="bg-white border border-[#EBEFF8] shadow-xs p-3 rounded-full"><Code className="h-5 w-5 text-[#3B66F5]" /></div>
                      <span className="text-[10px] font-bold text-[#1A1D24]">git push</span>
                    </div>
                    <div className="h-px bg-[#A2ABB8] w-8"></div>
                    
                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="bg-white border border-[#EBEFF8] shadow-xs p-3 rounded-full"><Layers className="h-5 w-5 text-[#CE6C18]" /></div>
                      <span className="text-[10px] font-bold text-[#1A1D24]">Build</span>
                    </div>
                    <div className="h-px bg-[#A2ABB8] w-8"></div>

                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="bg-white border border-[#EBEFF8] shadow-xs p-3 rounded-full"><TestTube className="h-5 w-5 text-[#E02020]" /></div>
                      <span className="text-[10px] font-bold text-[#1A1D24]">Test</span>
                    </div>
                    <div className="h-px bg-[#A2ABB8] w-8"></div>

                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="bg-white border border-[#EBEFF8] shadow-xs p-3 rounded-full"><Database className="h-5 w-5 text-[#47C965]" /></div>
                      <span className="text-[10px] font-bold text-[#1A1D24]">Docker</span>
                    </div>
                    <div className="h-px bg-[#A2ABB8] w-8"></div>

                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="bg-[#3B66F5] shadow-xs p-3 rounded-full"><Rocket className="h-5 w-5 text-white" /></div>
                      <span className="text-[10px] font-bold text-[#1A1D24]">Deploy Prod</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-[#EBEFF8] p-5 rounded-2xl">
                    <h4 className="font-bold text-[#1A1D24] text-sm">Dockerization & Infra</h4>
                    <p className="text-[#555E6E] text-xs mt-1 leading-relaxed">App ko Docker container mein pack karo so environment consistency maintain ho (dev to prod). Use Terraform for Infrastrucure as Code (IaC).</p>
                  </div>
                  <div className="bg-[#F3F6FD] border border-[#3B66F5]/20 p-5 rounded-2xl">
                    <h4 className="font-bold text-[#3B66F5] text-sm flex items-center justify-between">
                      Blue-Green Deployment <span className="text-[9px] bg-white px-2 py-1 rounded shadow-xs uppercase tracking-widest">Zero Downtime</span>
                    </h4>
                    <p className="text-[#1A1D24]/80 text-xs mt-2 leading-relaxed">Production pe 2 identical environments rakho. New version 'Green' pe release karo background mein. Jab sab test ho jaaye, router level traffic ko 'Blue' se 'Green' pe switch kardo instantly.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 7 */}
            {activeHash === 'monitor' && (
              <motion.div key="monitor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><Activity className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 7: Monitoring & Observability</h2>
                </div>

                <p className="text-sm text-[#555E6E] font-medium leading-relaxed">Live environment metrics bina blind flight udane jaisa hai. You need logs, metrics, and alerts real-time.</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#FAFBFD] border border-[#EBEFF8] p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-[#47C965] mb-1">99.99%</div>
                    <span className="text-[10px] font-bold text-[#8C95A6] uppercase tracking-wider">Uptime SLA</span>
                  </div>
                  <div className="bg-[#FAFBFD] border border-[#EBEFF8] p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-[#E02020] mb-1">&lt;0.1%</div>
                    <span className="text-[10px] font-bold text-[#8C95A6] uppercase tracking-wider">Error Rate</span>
                  </div>
                  <div className="bg-[#FAFBFD] border border-[#EBEFF8] p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-[#3B66F5] mb-1">&lt;200ms</div>
                    <span className="text-[10px] font-bold text-[#8C95A6] uppercase tracking-wider">TTFB (Speed)</span>
                  </div>
                  <div className="bg-[#FAFBFD] border border-[#EBEFF8] p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-[#CE6C18] mb-1">+40%</div>
                    <span className="text-[10px] font-bold text-[#8C95A6] uppercase tracking-wider">Conversion</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] mb-3 text-sm">Application Monitoring (APM)</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Setup Datadog or Grafana + Prometheus to monitor response times, bottlenecks, database loads automatically.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-[#1A1D24] mb-3 text-sm">Centralized Logging (ELK)</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">ELK Stack (Elasticsearch, Logstash, Kibana). Print structured JSON logs to enable easy query debugging at scale.</p>
                  </div>
                  <div className="border border-[#EBEFF8] rounded-2.5xl p-6 hover:shadow-md transition-shadow md:col-span-2">
                    <h4 className="font-bold text-[#1A1D24] mb-3 text-sm">Real User & Alerts Setup</h4>
                    <p className="text-[#555E6E] text-xs leading-relaxed">Sentry for catching Javascript crashes in real-time. Setup PagerDuty / Slack notifications if error rate spikes over a specified threshold (e.g. &gt;1%).</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 8 */}
            {activeHash === 'maintain' && (
              <motion.div key="maintain" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-[#EBEFF8]">
                  <div className="bg-[#F3F6FD] text-[#3B66F5] p-3 rounded-2xl"><RefreshCcw className="h-6 w-6 stroke-[2.2]" /></div>
                  <h2 className="text-2xl font-black text-[#1A1D24]">Phase 8: Maintenance & Growth</h2>
                </div>
                
                <p className="text-sm text-[#555E6E] font-medium leading-relaxed">Launch karne ke baad loop close nahi hota. System maintenance is crucial for longevity.</p>

                <ul className="space-y-4">
                  <li className="bg-white border border-[#EBEFF8] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="bg-[#EDFAF0] p-1.5 rounded-lg shrink-0 mt-0.5"><CheckCircle2 className="h-4 w-4 text-[#47C965]" /></div>
                    <div>
                      <h4 className="font-bold text-[#1A1D24] text-sm">Dependency & Security Patching</h4>
                      <p className="text-xs text-[#555E6E] mt-1">Run <code>npm audit</code>, setup GitHub Dependabot or Snyk. Keep upgrading frameworks smoothly not to fall into technical debt.</p>
                    </div>
                  </li>
                  <li className="bg-white border border-[#EBEFF8] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="bg-[#EDFAF0] p-1.5 rounded-lg shrink-0 mt-0.5"><CheckCircle2 className="h-4 w-4 text-[#47C965]" /></div>
                    <div>
                      <h4 className="font-bold text-[#1A1D24] text-sm">Automated Backups & Drills</h4>
                      <p className="text-xs text-[#555E6E] mt-1">Daily DB backups are essential, but also test restore processes during a scheduled sandbox scenario (Disaster Recovery Drill).</p>
                    </div>
                  </li>
                  <li className="bg-white border border-[#EBEFF8] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="bg-[#EDFAF0] p-1.5 rounded-lg shrink-0 mt-0.5"><CheckCircle2 className="h-4 w-4 text-[#47C965]" /></div>
                    <div>
                      <h4 className="font-bold text-[#1A1D24] text-sm">Incident Post-mortems (RCA)</h4>
                      <p className="text-xs text-[#555E6E] mt-1">Jab bhi server down ho ya critical bug aaye, Root Cause Analysis documentation karo to ensure the same issue never happens twice.</p>
                    </div>
                  </li>
                  <li className="bg-white border border-[#EBEFF8] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="bg-[#EDFAF0] p-1.5 rounded-lg shrink-0 mt-0.5"><CheckCircle2 className="h-4 w-4 text-[#47C965]" /></div>
                    <div>
                      <h4 className="font-bold text-[#1A1D24] text-sm">User Feedback Loop (Iterative Value)</h4>
                      <p className="text-xs text-[#555E6E] mt-1">Utilize tools like Hotjar to measure user interactions, process feature requests, A/B test variations to ensure continuous improvement.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 pt-6 border-t border-[#EBEFF8] text-center">
                   <p className="text-[11px] font-black tracking-widest uppercase text-[#8C95A6]">Made with ❤️ — Production Website Guide • FormSathi Hub</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Accordion Section - Detailed Answers */}
      <div className="mt-8 bg-[#0a0e1a] rounded-3xl shadow-lg border border-[#1f2940] overflow-hidden p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">📖 Har Phase Ka Detailed Answer</h2>
        </div>
        
        <div className="space-y-3">
          {accordionData.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#131b2f] border border-[#1f2940] rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:bg-[#1a233a] transition-colors"
               >
                <span className="font-bold text-slate-100 text-[15px]">{item.title}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                    openAccordion === item.id ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openAccordion === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5">
                      <div className="h-px w-full bg-[#1f2940] mb-4"></div>
                      <ul className="space-y-3">
                        {item.points.map((point, idx) => {
                          const [boldPart, rest] = point.includes(':') 
                            ? [point.split(':')[0] + ':', point.split(':').slice(1).join(':')] 
                            : ['', point];
                          
                          return (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-indigo-400 mt-1 shrink-0 font-bold">•</span>
                              <span className="text-slate-300 text-[13px] leading-relaxed">
                                {boldPart && <span className="font-bold text-slate-100">{boldPart}</span>}
                                {rest}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Walkthrough and Deep Explanation Build Section */}
      <div className="mt-8 bg-[#090D1A] rounded-3xl p-6 md:p-8 border border-[#1F2940] text-slate-200 space-y-8">
        <div className="border-b border-[#1F2940] pb-5">
          <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">Production Blueprint Walkthrough</span>
          <h2 className="text-2xl font-black text-white mt-1">🛠️ FormSathi Complete Production Walkthrough & Specs</h2>
          <p className="text-[#8C95A6] text-xs mt-2 leading-relaxed">
            FormSathi ko production grade website banane mein lagaye gaye exact design, code aur implementation concepts ki complete details nikal gayi hain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Planning Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-indigo-400 font-mono block mb-2">01. PLANNING & TARGET GOAL</span>
            <h4 className="text-sm font-bold text-white mb-2">इस Website (FormSathi) की Planning कैसे हुई?</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Hamara Target Goal:</strong> Ek offline-first aur fast Indian documents companion banana, joki Aadhaar, PAN details, bank details aur job application metrics ko secure local flow me organize rakhe.
              </p>
              <p>
                <strong>Aap Kaise Karein:</strong> Sabse pahle client se requirement meeting kijiye, scope creep se bachne ke liye standard <strong>MoSCoW (Must, Should, Could, Won't have)</strong> document ready karein aur user persona coordinate banayein.
              </p>
            </div>
          </div>

          {/* Design Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-pink-400 font-mono block mb-2">02. PREMIUM UI/UX DESIGN SYSTEM</span>
            <h4 className="text-sm font-bold text-white mb-2">इस Website का Design कैसे हुआ? (How to Reproduce)</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Design Elements:</strong> Poori site space strain-free <strong>Cosmic Slate Dark Theme (#0a0e1a / #131b2f)</strong> base color palette pe work karti hai. Humne typography me <strong>Baloo 2</strong> paired with <strong>Noto Sans Devanagari</strong> select kiya jisse pure Hindi and Devanagari text elegant lagta hai.
              </p>
              <p>
                <strong>Aap Kaise Karein:</strong> Figma me 320px screen resolution se startup mobile wires ready karein. Icons and illustration ke liye static images ke jagah pure <strong>Lucide React vectors</strong> include karein jo fast loading are support karein.
              </p>
            </div>
          </div>

          {/* Architecture Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-teal-400 font-mono block mb-2">03. ARCHITECTURE DECISIONS</span>
            <h4 className="text-sm font-bold text-white mb-2">इस Website का Tech Architecture क्या है?</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>High Performance Stack:</strong> FormSathi <strong>React 18+ paired with Vite</strong> speed compilation architecture design follow karti hai. Front-end completely modular components me split hai taaki low resource and fast cold start execution achieve ho.
              </p>
              <p>
                <strong>Database Syncing:</strong> Dynamic credential updates storage, persistent profile settings and security rules <strong>Google Firebase Auth / Firestore database</strong> integration par structured rehte hain.
              </p>
            </div>
          </div>

          {/* Development Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-yellow-400 font-mono block mb-2">04. CODING & METHODOLOGIES</span>
            <h4 className="text-sm font-bold text-white mb-2">Development कहाँ करें? (Hamara Recommendation)</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Hamara Recommendation:</strong> Aap coding ke liye <strong>VS Code</strong> with Tailwind CSS Intellisense configuration and ESLint environment choose karein. DRY rules follow karte hue helper logic ko <code>/src/utils/storage.ts</code> ke standalone file me handle karein.
              </p>
              <p>
                <strong>Build tools:</strong> Static resources parsing smoothly handle karne ke liye Vite assets config optimize karein jo compilation speed output badhaye.
              </p>
            </div>
          </div>

          {/* Testing Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-purple-400 font-mono block mb-2">05. SYSTEM TESTING METHODS</span>
            <h4 className="text-sm font-bold text-white mb-2">FormSathi को कैसे Test किया गया?</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Testing Strategies:</strong> Hamari image resizing ratios limit checkout, profile lock functions check karne ke liye humne manual browser visual metrics testing ki (including Safari/Chrome/Firefox layouts test grids).
              </p>
              <p>
                <strong>a11y Verification:</strong> Humne visual accessibility check kiya high-contrast text ratios verify karke taaki weak-eyesight support are fully compliance.
              </p>
            </div>
          </div>

          {/* Deployment Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-red-400 font-mono block mb-2">06. PRODUCTION DEPLOYMENT</span>
            <h4 className="text-sm font-bold text-white mb-2">Production Pe Deploy Kaise Karein? (Detailed Steps)</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Best Platform:</strong> Static and Jamstack client builds ke liye **Vercel** or **Netlify** sabse fast option hain.
              </p>
              <p>
                <strong>How to:</strong> Github integration connect karke continuous auto-deployment trigger set karein jisse green-blue transitions seamless execute hone lagein with zero downtime global assets routing.
              </p>
            </div>
          </div>

          {/* Monitoring Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-emerald-400 font-mono block mb-2">07. MONITORING & ALERTS SETTINGS</span>
            <h4 className="text-sm font-bold text-white mb-2">Live Application Track Kaise Karen?</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Monitoring Tools:</strong> App views or user bounce rates clear visual data maps dekhne ke liye **Google Analytics (GA4)** aur error validation errors catch karne ke liye live code listener **Sentry SDK** handle karein.
              </p>
              <p>
                <strong>Auto alert systems:</strong> UptimeRobot or BetterStack API use karein jo automatic downtime response track karke immediate Telegram/Slack or push message notification supply karein.
              </p>
            </div>
          </div>

          {/* Maintenance Walkthrough */}
          <div className="bg-[#121A2F] border border-[#1F2940] rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
            <span className="text-xs font-black text-sky-400 font-mono block mb-2">08. SECURITY MAINTENANCE CYCLE</span>
            <h4 className="text-sm font-bold text-white mb-2">App Maintenance Long Term Kaise Karein?</h4>
            <div className="space-y-3 text-[12px] text-slate-300 leading-relaxed">
              <p>
                <strong>Security Auditing:</strong> Dynamic package updates control karne ke liye regular period pe <code>npm audit</code> commands run karein aur security vulnerabilities check patches verify apply karein.
              </p>
              <p>
                <strong>Compatibility check:</strong> CSS functions execution trends trace karne ke liye **caniuse.com** checkout karein jisse latest device frames and multi-device platforms seamless support consistent rahe.
              </p>
            </div>
          </div>

        </div>

        {/* Complete Source Code Codebase ZIP Download Panel */}
        <div className="mt-10 bg-gradient-to-tr from-[#1B223C] to-[#12182F] rounded-3xl p-6 md:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <span>Github Ready</span>•<span>A to Z Complete Archive</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                📦 Complete Project Codebase Direct Export (Hindi Setup)
              </h3>
              <p className="text-[#8C95A6] text-xs leading-relaxed">
                App FormSathi ke complete frontend React 18+ (Vite setup) aur backend Node/Express codebase ko ek click me generate karke safely download kar sakte hain. Is zip package me aapke target setup commands standard configured default settings, structure aur complete modular files included hain:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="text-indigo-400 text-sm">✓</span>
                  <span>Pure Source: All <code>/src</code> files and components</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-indigo-400 text-sm">✓</span>
                  <span>Custom Node <code>server.ts</code> production backend</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-indigo-400 text-sm">✓</span>
                  <span>Tailwind v4 CSS & static icons parameters</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-indigo-400 text-sm">✓</span>
                  <span>Config files (package.json, tsconfig, Rules etc.)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 min-w-[200px]">
              <button
                type="button"
                onClick={handleDownloadProject}
                disabled={downloadStatus === 'loading'}
                className={`w-full py-4 px-6 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none active:scale-95 duration-150 ${
                  downloadStatus === 'loading'
                    ? "bg-[#1E293B] text-slate-400 border border-slate-700 cursor-not-allowed"
                    : downloadStatus === 'success'
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10"
                    : downloadStatus === 'error'
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-[#3B66F5] hover:bg-[#2552E3] text-white shadow-lg shadow-[#3B66F5]/15"
                }`}
              >
                {downloadStatus === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating ZIP...</span>
                  </>
                ) : downloadStatus === 'success' ? (
                  <>
                    <span className="text-sm">✓</span>
                    <span>Download Started!</span>
                  </>
                ) : downloadStatus === 'error' ? (
                  <>
                    <span>⚠</span>
                    <span>Generation Failed</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Project ZIP</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-slate-400 font-semibold text-center mt-1 leading-normal">
                {downloadStatus === 'loading' 
                  ? "Packaging project files..." 
                  : downloadStatus === 'success'
                  ? "Check download progress in browser!"
                  : "Github standard ready structure"}
              </p>
            </div>
          </div>
        </div>

        {/* Visual System Diagrams Section */}
        <div className="mt-8 border-t border-[#1F2940] pt-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase text-teal-400 tracking-wider">Interactive System Diagrams</span>
            <h3 className="text-xl font-bold text-white mt-1">📊 System Architecture, ER, and DFD Blueprints (Hindi Explanation)</h3>
            <p className="text-[#8C95A6] text-xs mt-2 leading-relaxed">
              FormSathi app ko aur acche se samajhne ke liye humne interactive blueprint visualizers ready kiye hain. Niche tab select karke diagrams aur unki direct implementation details padhein:
            </p>
          </div>

          <div className="bg-[#0D1222] border border-[#1F2940] rounded-3xl overflow-hidden p-6 space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-[#1F2940] pb-4">
              <button
                onClick={() => setSelectedDiagram('er')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedDiagram === 'er'
                    ? "bg-[#3B66F5] text-white shadow-lg shadow-[#3B66F5]/10"
                    : "bg-[#121A2F] text-slate-400 hover:text-white"
                }`}
              >
                💾 Database ER Diagram
              </button>
              <button
                onClick={() => setSelectedDiagram('dfd')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedDiagram === 'dfd'
                    ? "bg-[#3B66F5] text-white shadow-lg shadow-[#3B66F5]/10"
                    : "bg-[#121A2F] text-slate-400 hover:text-white"
                }`}
              >
                🔄 Data Flow Diagram (DFD)
              </button>
              <button
                onClick={() => setSelectedDiagram('arch')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedDiagram === 'arch'
                    ? "bg-[#3B66F5] text-white shadow-lg shadow-[#3B66F5]/10"
                    : "bg-[#121A2F] text-slate-400 hover:text-white"
                }`}
              >
                🌐 System Architecture
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-[#05070B] border border-[#1F2940] rounded-2xl overflow-hidden p-2 group relative">
                <div className="absolute top-4 right-4 bg-black/80 text-[10px] font-mono text-slate-400 px-2.5 py-1 rounded-md z-10 border border-slate-800">
                  Interactive View
                </div>
                <img
                  src={
                    selectedDiagram === 'er'
                      ? '/src/assets/images/er_diagram_1779748358613.png'
                      : selectedDiagram === 'dfd'
                      ? '/src/assets/images/dfd_diagram_1779748376428.png'
                      : '/src/assets/images/system_architecture_1779748392602.png'
                  }
                  alt={`${selectedDiagram} blueprint diagram`}
                  className="w-full object-contain rounded-xl max-h-[400px] hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                {selectedDiagram === 'er' && (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono">
                      <span>DATABASES</span>•<span>FIRESTORE</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white">Entity-Relationship Diagram Explanation</h4>
                    <ul className="space-y-3 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                      <li><strong>Users Collection:</strong> Isme user profile properties store hoti hain jaise `email`, `id`, local layout details etc.</li>
                      <li><strong>Documents Array:</strong> Har document me direct secure encrypted storage schemas nested standard format data field rehta hai.</li>
                      <li><strong>Local Sync:</strong> Dynamic keys matching users details verify index settings ko seamlessly query optimize kiya jata hai.</li>
                    </ul>
                  </div>
                )}

                {selectedDiagram === 'dfd' && (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-mono">
                      <span>PIPELINES</span>•<span>LOCAL FIRST</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white">Data Flow Diagram (DFD) Explanation</h4>
                    <ul className="space-y-3 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                      <li><strong>Level 0:</strong> Client device me visual interface par form data feed input save kiya jata hai.</li>
                      <li><strong>Level 1 (Encryption):</strong> Standard browser window memory directly <strong>AES Encryption</strong> logic trigger karti hai local level par.</li>
                      <li><strong>Extension Sink:</strong> Google chrome custom payload parameters storage container update hotey hi form inputs autofill execute ho jatey hain.</li>
                    </ul>
                  </div>
                )}

                {selectedDiagram === 'arch' && (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-mono">
                      <span>NETWORK</span>•<span>CLOUD RUN</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white">System Architecture Map</h4>
                    <ul className="space-y-3 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                      <li><strong>Vite Static Server:</strong> High speed assets distribution routing layers seamlessly manage karti hain.</li>
                      <li><strong>Firebase SDK Modules:</strong> Browser side user secure login and dynamic documents database status listener register karta hai.</li>
                      <li><strong>Chrome Sandbox isolation:</strong> Security constraints complete lock control secure local extension access guidelines ke parameters align rakhti hai.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Configuration Guide */}
        <div className="mt-8 border-t border-[#1F2940] pt-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Credentials & API Keys Setup</span>
            <h3 className="text-xl font-bold text-white mt-1">🔑 Required API Keys & Integration Guide (Hinglish Guide)</h3>
            <p className="text-[#8C95A6] text-xs mt-2 leading-relaxed">
              FormSathi ko production me active karne ke liye aapko primarily <strong>2 main API Keys/Configs</strong> ki zaroorat padegi. Niche iski detailed description, official websites aur copy-paste commands diye gaye hain:
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* API Key 1: Firebase */}
            <div className="bg-[#0D1222] border border-[#2D385E] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-xl"></div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl font-black text-xs">F</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">1. Firebase Database Config</h4>
                  <p className="text-[10px] text-amber-400/80">Required for User Accounts & Data Sync</p>
                </div>
              </div>
              <div className="space-y-3 text-[11.5px] text-slate-300 leading-relaxed">
                <p>
                  <strong>Official Website:</strong> <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300">Firebase Console</a>
                </p>
                <p>
                  <strong>Kaise lein:</strong> Sign-in karke naya project creative dashboard banayein. Add Web App option setup karke, standard configuration lines copy karein.
                </p>
                <p>
                  <strong>Kahan Paste Karein:</strong> Project root par files folder me <code>firebase-applet-config.json</code> naam ki file banayein, aur usme ye content copy-paste karein:
                </p>
                <pre className="bg-[#131B35] p-2.5 rounded-lg text-[10px] font-mono text-amber-300 border border-[#2D385E] overflow-x-auto">
{`{
  "apiKey": "AIzaSyA...",
  "authDomain": "formsathi.firebaseapp.com",
  "projectId": "formsathi-project",
  "storageBucket": "formsathi.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:1234:web:abcd",
  "firestoreDatabaseId": "(default)"
}`}
                </pre>
              </div>
            </div>

            {/* API Key 2: Gemini */}
            <div className="bg-[#0D1222] border border-[#2D385E] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#3B66F5]/5 rounded-full blur-xl"></div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-[#3B66F5]/10 text-indigo-400 rounded-xl font-black text-xs">AI</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">2. Google Gemini API Key</h4>
                  <p className="text-[10px] text-indigo-400">Powers AI ChatBox & Form Mismatch Checker</p>
                </div>
              </div>
              <div className="space-y-3 text-[11.5px] text-slate-300 leading-relaxed">
                <p>
                  <strong>Official Website:</strong> <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300">Google AI Studio</a>
                </p>
                <p>
                  <strong>Kaise lein:</strong> Chrome me login karein, aur left sidebar option par <strong>"Get API Key"</strong> blue status indicator par click karein. Ye completely <i>FREE</i> test credits provide karta hai.
                </p>
                <p>
                  <strong>Kahan paste karein:</strong> Project root directory ke system variables configuration file yani <code>.env</code> file (or <code>.env.example</code>) par ye variable define karein:
                </p>
                <pre className="bg-[#131B35] p-2.5 rounded-lg text-[10px] font-mono text-indigo-300 border border-[#2D385E] overflow-x-auto">
{`GEMINI_API_KEY=AIzaSyB-YourRealGeminiKeyHere`}
                </pre>
              </div>
            </div>

            {/* Third-party Resizer Info */}
            <div className="bg-[#0D1222] border border-[#2D385E] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl"></div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-black text-xs">RS</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">3. Doc Resizer Configuration</h4>
                  <p className="text-[10px] text-emerald-400">Zero Cost Client-Side Compression</p>
                </div>
              </div>
              <div className="space-y-3 text-[11.5px] text-slate-300 leading-relaxed">
                <p>
                  <strong>Official Website:</strong> <span className="text-emerald-400 font-bold">No External Key Needed!</span>
                </p>
                <p>
                  <strong>Koshish ki Technique:</strong> Image standard cropping/matching aur resizing details dynamic compression ratios ke liye external servers call karne ke bajay <strong>HTML5 Canvas API</strong> features configure kiye gaye hain.
                </p>
                <p>
                  <strong>Fayda:</strong> Is modern client-side tech architecture se user ke Aadhaar/PAN details upload server memory and bandwidth consumption <strong>0 KB</strong> rehti hain aur image bilkul fast render safety filters use karti hai.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

