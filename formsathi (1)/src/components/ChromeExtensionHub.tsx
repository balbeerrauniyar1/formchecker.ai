import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Chrome, 
  FileCode, 
  Settings, 
  CheckCircle, 
  Copy, 
  HelpCircle, 
  Play, 
  Smartphone, 
  ShieldCheck, 
  Pocket,
  Zap,
  Info
} from 'lucide-react';
import JSZip from 'jszip';

export default function ChromeExtensionHub() {
  const [activeFile, setActiveFile] = useState<'manifest' | 'popupHtml' | 'popupJs' | 'contentJs' | 'readme'>('manifest');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedDemoDocument, setSelectedDemoDocument] = useState('Aadhaar Card');

  // Extension Source Code files
  const manifestCode = `{
  "manifest_version": 3,
  "name": "FormSathi AutoFill Companion",
  "version": "1.0",
  "description": "FormSathi Companion Extension. Fill profiles, passwords and docs on any Indian portal seamlessly.",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}`;

  const popupHtmlCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 320px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #0d1222;
      color: #fafafa;
    }
    .header {
      background: linear-gradient(135deg, #3b66f5, #1d4ed8);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
    }
    .container {
      padding: 16px;
    }
    .search-box {
      width: 100%;
      background: #1e2640;
      border: 1px solid #2d385e;
      border-radius: 8px;
      padding: 8px 12px;
      color: #fff;
      box-sizing: border-box;
      margin-bottom: 12px;
    }
    .doc-item {
      background: #131b35;
      border: 1px solid #2d385e;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 8px;
      display: flex;
      justify-between: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .doc-item:hover {
      background: #1e2640;
      border-color: #3b66f5;
    }
    .btn {
      background: #3b66f5;
      color: #white;
      border: none;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 11px;
      cursor: pointer;
    }
    .footer {
      text-align: center;
      padding: 12px;
      font-size: 10px;
      color: #64748b;
      border-top: 1px solid #1e2640;
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="width: 24px; height: 24px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #3b66f5;">F</div>
    <h2>FormSathi companion</h2>
  </div>
  <div class="container">
    <input type="text" placeholder="Search Vault Documents..." class="search-box">
    <div class="doc-item">
      <div>
        <div style="font-weight: bold; font-size: 13px;">Aadhaar Card</div>
        <div style="font-size: 10px; color: #64748b;">####-####-1234</div>
      </div>
      <button class="btn">Auto Fill</button>
    </div>
    <div class="doc-item">
      <div>
        <div style="font-weight: bold; font-size: 13px;">PAN Card</div>
        <div style="font-size: 10px; color: #64748b;">ABCDE1234F</div>
      </div>
      <button class="btn">Auto Fill</button>
    </div>
  </div>
  <div class="footer">
    FormSathi secure integration client
  </div>
</body>
</html>`;

  const popupJsCode = `document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { 
            action: "FILL_FORM", 
            type: e.target.parentElement.querySelector('div').innerText.trim().split('\\n')[0] 
          });
        }
      });
    });
  });
});`;

  const contentJsCode = `chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FILL_FORM") {
    // Select popular Indian form inputs (like name, aadhaar, pan, etc.)
    const nameInputs = document.querySelectorAll('input[name*="name"], input[id*="name"], input[placeholder*="Name"]');
    const aadhaarInputs = document.querySelectorAll('input[name*="aadhaar"], input[name*="adhar"], input[id*="adhar"], input[placeholder*="Aadhaar"]');
    const panInputs = document.querySelectorAll('input[name*="pan"], input[id*="pan"], input[placeholder*="PAN"]');

    if (request.type.toLowerCase().includes('aadhaar')) {
      aadhaarInputs.forEach(input => {
        input.value = "512345678901";
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      alert('FormSathi Companion: Filled Aadhaar Number (5123-4567-8901)');
    } else if (request.type.toLowerCase().includes('pan')) {
      panInputs.forEach(input => {
        input.value = "ABCDE1234F";
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      alert('FormSathi Companion: Filled PAN Details (ABCDE1234F)');
    }
  }
});`;

  const readmeCode = `FormSathi Auto-Fill Chrome Companion Extension
===============================================

HOW TO LOAD IN GOOGLE CHROME (HINDI GUIDE):
-------------------------------------------
1. Is screen pe diye gaye blue button "Download Chrome Extension ZIP" pe click karke folder download karein.
2. Downloaded zip file (formsathi-extension.zip) ko double click karke extract (unzip) karein.
3. Apna Google Chrome browser kholein aur address bar mein dial karein: chrome://extensions
4. Top right corner mein "Developer Mode" option ko ON (Enable) karein.
5. Top left corner mein "Load unpacked" button pe click karein.
6. Wo extracted folder select karein jisme ye saari files (manifest.json, content.js etc) save hain.
7. BADHAI HO! FormSathi companion icon chrome bar mein dikhne lagega. 

Ab kisi bhi sarkari ya general form filling website pe jaakar icon pe click karein aur Aadhaar/PAN seamlessly single-click pe fill karein.`;

  const backgroundJsCode = `chrome.runtime.onInstalled.addListener(() => {
  console.log('FormSathi AutoFill Companion background worker active');
});`;

  const currentCode = {
    manifest: manifestCode,
    popupHtml: popupHtmlCode,
    popupJs: popupJsCode,
    contentJs: contentJsCode,
    readme: readmeCode
  }[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      // Add individual extension files
      zip.file("manifest.json", manifestCode);
      zip.file("popup.html", popupHtmlCode);
      zip.file("popup.js", popupJsCode);
      zip.file("content.js", contentJsCode);
      zip.file("background.js", backgroundJsCode);
      zip.file("README.txt", readmeCode);

      // Create a virtual pixel fallback icon
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Aesthetic logo icon 128x128
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.arc(64, 64, 55, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(64, 64, 35, 0, Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('FS', 64, 64);

        const dataUrl = canvas.toDataURL('image/png');
        const iconBase64 = dataUrl.split(',')[1];
        zip.file("icon.png", iconBase64, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "formsathi-companion-extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert('Error files packing. Try manual copy.');
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  return (
    <div className="font-sans text-[#1A1D24] space-y-8">
      {/* Extension Header */}
      <div className="relative rounded-3xl bg-linear-to-br from-[#1E2640] via-[#0D1222] to-[#090C15] text-white p-6 md:p-8 border border-[#2D385E] overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-[#3B66F5]/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="h-3 w-3" /> Chromium Native
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <Chrome className="h-8 w-8 text-[#3B66F5] animate-spin-slow" /> FormSathi AutoFill Companion
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium max-w-xl">
              Ye chrome extension aapke FormSathi profile and safe credentials ko browser extension popup se connect karti hai, jisse aap kisi bhi Indian govt/job application form ko 1-Sec mein fill kar sakte hain.
            </p>
          </div>
          
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-4 bg-[#3B66F5] hover:bg-[#2F52C7] text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-[#3B66F5]/15 shrink-0 hover:translate-y-[-2px] disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-4.5 w-4.5" />
            {downloading ? 'Packing Zip File...' : 'Download Chrome Extension ZIP'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Step-by-Step Installation Instruction Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#EBEFF8] rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-black text-[#1A1D24] mb-5 flex items-center gap-3">
              <span className="p-1.5 bg-[#F3F6FD] text-[#3B66F5] rounded-lg"><Info className="h-4 w-4" /></span>
              Chrome Extension Kaise Use Karein? (Detailed Devanagari Guide)
            </h2>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Extension ZIP Download Karein', desc: 'Upar click karke "formsathi-companion-extension.zip" download karein or extracted unzip folder banaein.' },
                { step: '02', title: 'Chrome settings options kholein', desc: 'Google Chrome address bar pe "chrome://extensions" search karein, aur left menu se select karein.' },
                { step: '03', title: 'Developer Mode ON karein', desc: 'Top right corner me switch hoga usko enable karein jisse manual load function active hoga.' },
                { step: '04', title: 'Load Unpacked select karein', desc: 'Top left corner me is button pe click karein aur apna extracted folders select parameters load karein.' },
                { step: '05', title: 'Congratulations 🎉', desc: 'Ab extension ready hai. Kisi bhi Form page pe automatic fill karne ke liye popup use karein.' }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="text-sm font-black text-[#3B66F5] font-mono leading-none pt-1">{step.step}</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#1A1D24]">{step.title}</h4>
                    <p className="text-[11px] text-[#8C95A6] font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Simulator of the Extension Popup Interface */}
          <div className="bg-[#0D1222] border border-[#2D385E] rounded-3xl p-5 text-white relative shadow-inner overflow-hidden">
            <div className="absolute top-2 right-4 text-[9px] font-mono text-[#64748b] bg-[#1e2640] px-2 py-0.5 rounded">LIVE SIMULATOR</div>
            <div className="flex items-center gap-2 border-b border-[#1e2640] pb-3 mb-4">
              <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center font-black text-xs text-[#3B66F5]">F</div>
              <div>
                <h3 className="text-xs font-bold">FormSathi companion</h3>
                <p className="text-[9px] text-slate-400">Secure credentials injector</p>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-300 mb-3">Koshish kijiye dynamic auto-fill simulatior pane me action trigger karne ke liye:</p>
            
            <div className="bg-[#131b35] rounded-xl p-3 border border-[#2d385e] space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-100">Aadhaar Card Fill System</span>
                  <p className="text-[9px] text-[#8C95A6]">XXXX-XXXX-1234</p>
                </div>
                <button 
                  onClick={() => alert('Demo Companion: Fill action triggered for Aadhaar. This will auto-detect Aadhaar input field on active tab and fill ("512345678901")')}
                  className="px-2 py-1 bg-[#3b66f5] hover:bg-[#2563eb] text-[10px] font-bold rounded text-white"
                >
                  Auto Fill
                </button>
              </div>
            </div>

            <div className="bg-[#131b35] rounded-xl p-3 border border-[#2d385e] space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-100">PAN Card Secure ID</span>
                  <p className="text-[9px] text-[#8C95A6]">XXXXX1234X</p>
                </div>
                <button 
                  onClick={() => alert('Demo Companion: Fill action triggered for PAN Card. This will auto-detect PAN input fields and fill ("ABCDE1234F")')}
                  className="px-2 py-1 bg-[#3b66f5] hover:bg-[#2563eb] text-[10px] font-bold rounded text-white"
                >
                  Auto Fill
                </button>
              </div>
            </div>

            <div className="text-[9.5px] text-[#64748b] text-center">Chrome browser unpacked files mode provides identical native access.</div>
          </div>
        </div>

        {/* Source Code Walkthrough File Tabs */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-[#EBEFF8] rounded-3xl overflow-hidden shadow-sm">
          <div className="border-b border-[#EBEFF8] bg-[#FAFBFD] px-6 py-4 flex items-center justify-between">
            <h3 className="text-xs font-black text-[#8C95A6] uppercase tracking-wider">Extension Source Files</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-bold text-[#3B66F5] bg-white border border-[#EBEFF8] px-3 py-1.5 rounded-xl hover:bg-[#F3F6FD] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="flex overflow-x-auto border-b border-[#EBEFF8] px-4 py-2 bg-[#FAFBFD] no-scrollbar">
            {[
              { id: 'manifest', name: 'manifest.json' },
              { id: 'popupHtml', name: 'popup.html' },
              { id: 'popupJs', name: 'popup.js' },
              { id: 'contentJs', name: 'content.js' },
              { id: 'readme', name: 'README.txt' },
            ].map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id as any)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all mr-2 whitespace-nowrap cursor-pointer ${
                  activeFile === file.id
                    ? 'bg-[#3B66F5] text-white'
                    : 'text-[#8C95A6] hover:bg-[#F0F2F6] hover:text-[#1A1D24]'
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>

          <div className="p-6 bg-[#0E1324] text-slate-200 font-mono text-xs overflow-auto flex-1 min-h-[350px] max-h-[450px]">
            <pre className="whitespace-pre">{currentCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
