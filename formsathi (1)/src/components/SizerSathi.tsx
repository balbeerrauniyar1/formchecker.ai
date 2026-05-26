import React, { useState, useRef, useEffect } from 'react';
import { User, UploadedDocument } from '../types';
import { addDocument } from '../utils/storage';
import { Sparkles, Sliders, UploadCloud, ImageIcon, CheckCircle, ShieldAlert, RefreshCw, ZoomIn, Sun, Crop } from 'lucide-react';

interface SizerSathiProps {
  currentUser: User;
  onDocumentsUpdated: () => void;
  documents: UploadedDocument[];
}

interface PresetSpec {
  name: string;
  portal: string;
  targetSlot: 'Photo' | 'Signature';
  minKB: number;
  maxKB: number;
  widthPx: number;
  heightPx: number;
  guideText: string;
}

const PORTAL_PRESETS: PresetSpec[] = [
  {
    name: 'SSC Passport Photo',
    portal: 'Staff Selection Commission (SSC)',
    targetSlot: 'Photo',
    minKB: 20,
    maxKB: 50,
    widthPx: 350,
    heightPx: 450,
    guideText: 'Ensure the photo was taken within the last 3 months, has a clear light background, and faces directly ahead. No sunglasses or caps allowed.'
  },
  {
    name: 'UPSC Standard Signature',
    portal: 'Union Public Service Commission (UPSC)',
    targetSlot: 'Signature',
    minKB: 10,
    maxKB: 20,
    widthPx: 350,
    heightPx: 150,
    guideText: 'Sign clearly in black/blue ink on white paper. Keep margins clean. Maximum file size is strictly 20KB.'
  },
  {
    name: 'IBPS Bank Photo Spec',
    portal: 'Institute of Banking Personnel Selection',
    targetSlot: 'Photo',
    minKB: 20,
    maxKB: 50,
    widthPx: 200,
    heightPx: 230,
    guideText: 'The photo must match passport dimensions. Adjust zoom slider to center your face cleanly within the grid box.'
  },
  {
    name: 'NTA JEE/NEET Signature',
    portal: 'National Testing Agency (NTA)',
    targetSlot: 'Signature',
    minKB: 4,
    maxKB: 30,
    widthPx: 400,
    heightPx: 120,
    guideText: 'Sign with running handwriting. Do not use capital letters exclusively. Crop width perfectly to eliminate whitespace.'
  }
];

export default function SizerSathi({ currentUser, onDocumentsUpdated, documents }: SizerSathiProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetSpec>(PORTAL_PRESETS[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Custom interactive sliders
  const [zoom, setZoom] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(35);

  const [savingLoading, setSavingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw the canvas on parameters update
  useEffect(() => {
    drawCanvas();
  }, [selectedPreset, imageSrc, zoom, brightness, contrast]);

  // Adjust target size slider bound when preset changes
  useEffect(() => {
    // Put target size precisely in the middle of min and max parameters of portal guidelines
    setTargetSizeKB(Math.round((selectedPreset.minKB + selectedPreset.maxKB) / 2));
  }, [selectedPreset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    canvas.width = selectedPreset.widthPx;
    canvas.height = selectedPreset.heightPx;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        
        // Filter effects (brightness/contrast)
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

        // Calculate positioning centered
        const targetAspectRatio = canvas.width / canvas.height;
        const imgAspectRatio = img.width / img.height;

        let renderWidth = canvas.width;
        let renderHeight = canvas.height;

        if (imgAspectRatio > targetAspectRatio) {
          renderWidth = canvas.height * imgAspectRatio;
        } else {
          renderHeight = canvas.width / imgAspectRatio;
        }

        // Apply zoom slider
        const zoomFactor = zoom / 100;
        renderWidth *= zoomFactor;
        renderHeight *= zoomFactor;

        // Draw image aligned to center
        const xOffset = (canvas.width - renderWidth) / 2;
        const yOffset = (canvas.height - renderHeight) / 2;

        ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
        ctx.restore();

        // Overlay transparent guideline borders
        ctx.strokeStyle = '#3B66F5';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        
        ctx.fillStyle = 'rgba(59, 102, 245, 0.03)';
        ctx.fillRect(4, 4, canvas.width - 8, canvas.height - 8);
      };
      img.src = imageSrc;
    } else {
      // Empty display canvas background template
      ctx.fillStyle = '#FAFBFD';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border outline
      ctx.strokeStyle = '#C4CDDB';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Centered guide text
      ctx.fillStyle = '#555E6E';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Upload Original ${selectedPreset.targetSlot}`, canvas.width / 2, canvas.height / 2 - 10);
      
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#8C95A6';
      ctx.fillText(`${selectedPreset.widthPx} x ${selectedPreset.heightPx} View Area`, canvas.width / 2, canvas.height / 2 + 15);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setZoom(100);
        setBrightness(100);
        setContrast(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToWallet = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) {
      setErrorMsg('Please upload and position your file on the canvas first.');
      return;
    }

    setSavingLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Dynamically compress and calculate input target quality KB exactly
    setTimeout(async () => {
      let ratio = 0.95;
      let dataUrl = canvas.toDataURL('image/jpeg', ratio);
      let sizeKB = (dataUrl.length * (3/4)) / 1024;
      
      let attempts = 0;
      let minRatio = 0.1;
      let maxRatio = 0.95;
      
      while (sizeKB > targetSizeKB && attempts < 8 && maxRatio - minRatio > 0.05) {
        maxRatio = ratio;
        ratio = (minRatio + maxRatio) / 2;
        dataUrl = canvas.toDataURL('image/jpeg', ratio);
        sizeKB = (dataUrl.length * (3/4)) / 1024;
        attempts++;
      }
      
      if (sizeKB < targetSizeKB * 0.5 && attempts < 8) {
         minRatio = ratio;
         let testRatio = (minRatio + maxRatio) / 2;
         let testDataUrl = canvas.toDataURL('image/jpeg', testRatio);
         let testSizeKB = (testDataUrl.length * (3/4)) / 1024;
         if (testSizeKB <= targetSizeKB) {
           dataUrl = testDataUrl;
           sizeKB = testSizeKB;
         }
      }

      // Inject to documents store
      await addDocument(
        currentUser.id,
        selectedPreset.targetSlot as any,
        `${selectedPreset.name.replace(/\s+/g, '_')}_optimized.jpg`,
        dataUrl,
        'image/jpeg',
        `${Math.round(sizeKB)} KB`
      );

      setSavingLoading(false);
      setSuccessMsg(`Success! Optimized ${selectedPreset.targetSlot} successfully written directly back to your Doc Wallet Slot!`);
      onDocumentsUpdated();

      setTimeout(() => setSuccessMsg(''), 6000);
    }, 1500);
  };

  const loadSampleForPresets = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = selectedPreset.widthPx;
    tempCanvas.height = selectedPreset.heightPx;
    const ctx = tempCanvas.getContext('2d');
    
    if (ctx) {
      if (selectedPreset.targetSlot === 'Photo') {
        ctx.fillStyle = '#F3F6FD';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        ctx.strokeStyle = '#3B66F5';
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, tempCanvas.width, tempCanvas.height);

        ctx.fillStyle = '#E1E8FF';
        ctx.beginPath();
        ctx.arc(tempCanvas.width / 2, tempCanvas.height / 2, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3B66F5';
        ctx.beginPath();
        ctx.arc(tempCanvas.width / 2, tempCanvas.height / 2 - 30, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1A1D24';
        ctx.beginPath();
        ctx.ellipse(tempCanvas.width / 2, tempCanvas.height / 2 + 75, 75, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FAFBFD';
        ctx.fillRect(30, tempCanvas.height - 70, tempCanvas.width - 60, 45);
        ctx.fillStyle = '#1A1D24';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(currentUser.fullName.toUpperCase().substring(0, 22), 40, tempCanvas.height - 52);
        ctx.fillText(`DATE: ${new Date().toLocaleDateString('en-IN')}`, 40, tempCanvas.height - 38);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(35, tempCanvas.height / 2 + 10);
        ctx.bezierCurveTo(70, 10, 120, tempCanvas.height - 20, 160, tempCanvas.height / 2);
        ctx.bezierCurveTo(200, 20, 230, tempCanvas.height - 10, 275, tempCanvas.height / 2 - 15);
        ctx.lineTo(tempCanvas.width - 55, tempCanvas.height / 2 + 15);
        ctx.stroke();

        ctx.strokeStyle = '#3B66F5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(80, tempCanvas.height / 2 + 20);
        ctx.lineTo(280, tempCanvas.height / 2 + 23);
        ctx.stroke();
      }
    }

    setFileName(`${selectedPreset.targetSlot.toLowerCase()}_sample_proof.jpg`);
    setImageSrc(tempCanvas.toDataURL('image/jpeg'));
  };

  return (
    <div className="space-y-6 text-[#1A1D24] font-sans">
      
      {/* Intro section Header */}
      <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_10px_35px_rgba(59,102,245,0.015)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Crop className="w-64 h-64 text-[#3B66F5] rotate-12" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 text-[#3B66F5] font-extrabold text-[10px] uppercase tracking-wider bg-[#F3F6FD] px-3.5 py-1.5 rounded-full mb-1">
            <Sparkles className="h-4 w-4 stroke-[2.2]" />
            <span>Precision Compression Optimizer</span>
          </div>
          <h1 className="text-3xl font-black text-[#1A1D24] tracking-tight">Signature & Photo Optimizer</h1>
          <p className="text-[#8C95A6] text-xs font-semibold leading-relaxed max-w-2xl mt-1">
            Achieve pixel-perfect cropping and target output file sizes. Instantly format photo components to comply strictly with SSC, UPSC, or other banking recruitment boards.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-2xl bg-[#EDFAF0] border border-[#DEF7E5] px-4 py-3.5 text-xs font-bold text-[#47C965] shadow-xs">
          <p>{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-[#FFF2F2] border border-[#FFE4E4] p-4 text-xs font-bold text-[#E02020] flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#E02020] shrink-0 stroke-[2.2]" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Main dashboard core splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6.5">
        
        {/* Controls Column (Left Column) (Col-span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-[#EBEFF8] bg-white p-5 shadow-sm space-y-5">
            <h2 className="text-xs font-bold text-[#1A1D24] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#EBEFF8] pb-3">
              <Sliders className="h-4.5 w-4.5 text-[#3B66F5] stroke-[2.2]" /> Controller presets
            </h2>

            {/* Portal Preset Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wider">
                Recruitment Exam Preset
              </label>
              <select
                id="preset-specification-select"
                value={PORTAL_PRESETS.indexOf(selectedPreset)}
                onChange={(e) => {
                  const preset = PORTAL_PRESETS[Number(e.target.value)];
                  setSelectedPreset(preset);
                }}
                className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-2.5 px-3.5 text-xs text-[#1A1D24] font-extrabold cursor-pointer focus:border-[#3B66F5] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]"
              >
                {PORTAL_PRESETS.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name} ({p.targetSlot})
                  </option>
                ))}
              </select>
            </div>

            {/* Target guidelines preview parameters metrics */}
            <div className="rounded-2xl bg-[#FAFBFD] p-4 border border-[#EBEFF8] space-y-2.5">
              <span className="text-[9px] font-black text-[#555E6E] uppercase tracking-wider block">compliance specifications</span>
              <div className="grid grid-cols-2 gap-3 text-xs leading-snug">
                <div>
                  <span className="text-[#8C95A6] block text-[9px] uppercase font-bold">Portal Authority</span>
                  <span className="font-extrabold text-[#1A1D24] truncate block mt-0.5">{selectedPreset.portal}</span>
                </div>
                <div>
                  <span className="text-[#8C95A6] block text-[9px] uppercase font-bold">Target Size Guideline</span>
                  <span className="font-extrabold text-[#3B66F5] block mt-0.5">{selectedPreset.minKB}KB to {selectedPreset.maxKB}KB</span>
                </div>
                <div>
                  <span className="text-[#8C95A6] block text-[9px] uppercase font-bold">Target Slot</span>
                  <span className="font-extrabold text-[#1A1D24] block mt-0.5">{selectedPreset.targetSlot}</span>
                </div>
                <div>
                  <span className="text-[#8C95A6] block text-[9px] uppercase font-bold">Resolution Standard</span>
                  <span className="font-extrabold text-[#1A1D24] block mt-0.5">{selectedPreset.widthPx}x{selectedPreset.heightPx} px</span>
                </div>
              </div>
              <p className="text-[10px] text-[#8C95A6] leading-relaxed pt-2.5 border-t border-[#EBEFF8] font-semibold">
                {selectedPreset.guideText}
              </p>
            </div>

            {/* Interactive sliders for fine tuning */}
            <div className="space-y-4 pt-1">
              
              {/* Size slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#8C95A6] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                    <Sliders className="h-3 w-3 inline text-[#3B66F5] stroke-[2.2]" /> Target Output Size
                  </span>
                  <span className="font-extrabold text-[#3B66F5] font-mono">{targetSizeKB} KB</span>
                </div>
                <input
                  type="range"
                  min={selectedPreset.minKB}
                  max={selectedPreset.maxKB}
                  step={1}
                  value={targetSizeKB}
                  onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#EBEFF8] rounded-lg appearance-none cursor-pointer accent-[#3B66F5]"
                />
                <div className="flex justify-between text-[9px] text-[#8C95A6] font-extrabold mt-0.5">
                  <span>Min: {selectedPreset.minKB}KB</span>
                  <span>Max: {selectedPreset.maxKB}KB</span>
                </div>
              </div>

              {/* Zoom slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#8C95A6] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                    <ZoomIn className="h-3.5 w-3.5 inline text-[#3B66F5]" /> Zoom Dimension
                  </span>
                  <span className="font-extrabold text-[#1A1D24] font-mono">{zoom}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={250}
                  step={1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#EBEFF8] rounded-lg appearance-none cursor-pointer accent-[#3B66F5]"
                />
              </div>

              {/* Brightness slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#8C95A6] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                    <Sun className="h-3.5 w-3.5 inline text-[#F5A623]" /> Brightness Filter
                  </span>
                  <span className="font-extrabold text-[#1A1D24] font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  step={1}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#EBEFF8] rounded-lg appearance-none cursor-pointer accent-[#F5A623]"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Live Canvas Workspace Arena Panel (Col-span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-[#EBEFF8] bg-white p-6 shadow-sm flex flex-col items-center justify-between min-h-[480px]">
            
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBEFF8] pb-3 mb-6">
                <div>
                  <h3 className="text-xs font-black text-[#1A1D24] uppercase tracking-wide flex items-center gap-1.5">
                    <ImageIcon className="h-4.5 w-4.5 text-[#3B66F5] stroke-[2.2]" /> Live Canvas Workshop
                  </h3>
                  <p className="text-[11px] text-[#8C95A6] font-semibold mt-0.5">Scale and position signature / photos inside required margins</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAFBFD] hover:bg-white border border-[#EBEFF8] text-xs text-[#8C95A6] hover:text-[#1A1D24] font-bold transition-all cursor-pointer"
                  >
                    <UploadCloud className="h-4 w-4 stroke-[2.2]" /> Local File
                  </button>
                  
                  <button
                    type="button"
                    onClick={loadSampleForPresets}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9E9] text-xs text-[#F5A623] hover:bg-neutral-50 font-bold border border-[#FFEFC2] transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-[#F5A623] stroke-[2.2]" /> Load Sample Spec
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
              </div>
            </div>

            {/* The physical rendered standard layout boundary mockup view block */}
            <div className="bg-[#FAFBFD] p-8 rounded-2xl border border-[#EBEFF8] flex items-center justify-center min-h-[250px] w-full max-w-sm shadow-inner relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[8px] font-black text-[#8C95A6] py-1 px-2.5 rounded-lg tracking-wider uppercase border border-[#EBEFF8]">
                {selectedPreset.targetSlot} Guideline Overlay
              </div>
              <canvas
                ref={canvasRef}
                className="shadow-sm bg-white border border-[#EBEFF8] max-w-full rounded transition-all"
              />
            </div>

            {/* Actions controls */}
            <div className="w-full mt-6 border-t border-[#EBEFF8] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="font-bold text-[#8C95A6] text-[11px]">
                {imageSrc 
                  ? `Active File: ${fileName.substring(0, 24)}...` 
                  : 'Ready. Pick your custom file or click load sample.'
                }
              </span>

              <button
                type="button"
                id="sizer-sathi-injector-btn"
                disabled={!imageSrc || savingLoading}
                onClick={handleSaveToWallet}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B66F5] text-white font-bold px-6 py-3 text-xs tracking-wider uppercase shadow-md shadow-[#3B66F5]/10 hover:bg-[#2F52C7] transition-all cursor-pointer"
              >
                {savingLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 stroke-[2.2]" />
                )}
                Save to My Wallet Slot
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
