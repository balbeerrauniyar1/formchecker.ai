import React, { useState, useRef } from "react";
import {
  User,
  UploadedDocument,
  DocumentType,
  VerifiedProfile,
} from "../types";
import {
  addDocument,
  deleteDocument,
  downloadFile,
} from "../utils/storage";
import {
  FileText,
  UploadCloud,
  Info,
  Trash2,
  Download,
  Calendar,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DocumentWalletProps {
  currentUser: User;
  onDocumentsUpdated: () => void;
  documents: UploadedDocument[];
  profileData: VerifiedProfile | null;
}

const DOCUMENT_TYPES_LIST: DocumentType[] = [
  "Aadhaar Card",
  "PAN Card",
  "10th Marksheet",
  "12th Marksheet",
  "Graduation Certificate",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "Character Certificate",
  "Experience Certificate",
  "NCC Certificate",
  "Sports Certificate",
  "Disability Certificate",
  "Passport Photo",
  "Live Photo",
  "Signature Scan",
  "Thumb Impression",
  "Mobile Number",
  "Email ID",
];

export default function DocumentWallet({
  currentUser,
  onDocumentsUpdated,
  documents,
  profileData,
}: DocumentWalletProps) {
  const [selectedType, setSelectedType] =
    useState<DocumentType>("Aadhaar Card");
  const [dragging, setDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Storage option state dictionary to keep track of active download selection for each doc
  const [selectedDownloadOptions, setSelectedDownloadOptions] = useState<
    Record<string, "original" | "jpg_50" | "pdf_100">
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera integration states and helper references
  const [uploadMode, setUploadMode] = useState<"file" | "camera">("file");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraActive(true);
    setErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      triggerError("Could not access camera. Please check your camera permissions or try manual file upload.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const saveBase64Document = async (
    fileName: string,
    base64Data: string,
    mimeType: string,
    sizeStr: string,
  ) => {
    try {
      await addDocument(
        currentUser.id,
        selectedType,
        fileName,
        base64Data,
        mimeType,
        sizeStr,
      );

      triggerSuccess(
        `${selectedType} securely saved to your digital locker database!`,
      );
      onDocumentsUpdated();

      // Auto toggle to next empty type for ease of use
      const currentIndex = DOCUMENT_TYPES_LIST.indexOf(selectedType);
      const nextEmptyIndex = DOCUMENT_TYPES_LIST.findIndex(
        (t, idx) => idx > currentIndex && !getDocForType(t),
      );
      if (nextEmptyIndex !== -1) {
        setSelectedType(DOCUMENT_TYPES_LIST[nextEmptyIndex]);
      } else {
        const firstEmptyIndex = DOCUMENT_TYPES_LIST.findIndex(
          (t) => !getDocForType(t),
        );
        if (firstEmptyIndex !== -1) {
          setSelectedType(DOCUMENT_TYPES_LIST[firstEmptyIndex]);
        }
      }
    } catch (err: any) {
      console.error(err);
      triggerError(
        "Failed to save document. Please check your network or try a lighter file.",
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        const head = "data:image/jpeg;base64,";
        const bytesCount = Math.round((dataUrl.length - head.length) * (3 / 4));
        const sizeStr = `${(bytesCount / 1024).toFixed(1)} KB`;

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${selectedType.toLowerCase().replace(/\s+/g, "_")}_camera_${timestamp}.jpg`;

        saveBase64Document(fileName, dataUrl, "image/jpeg", sizeStr);
        stopCamera();
      }
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4500);
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 4500);
  };

  // Validation utility to check if file name indicates a wrong document slot
  const validateUploadedFile = (
    file: File,
    type: DocumentType,
  ): string | null => {
    const name = file.name.toLowerCase();

    // Aadhaar Card Checks
    if (type === "Aadhaar Card") {
      if (name.includes("pan")) {
        return "You are uploading a PAN Card in the Aadhaar Card slot. Please select 'PAN Card' from the dropdown or try another file.";
      }
      if (
        name.includes("marksheet") ||
        name.includes("10th") ||
        name.includes("12th") ||
        name.includes("graduation") ||
        name.includes("degree")
      ) {
        return "You are uploading a Marksheet in the Aadhaar Card slot. Please select the correct marksheet slot.";
      }
      if (
        name.includes("signature") ||
        name.includes("sign") ||
        name.includes("photo")
      ) {
        return "You are uploading a photo or signature in the Aadhaar Card slot.";
      }
    }

    // PAN Card Checks
    if (type === "PAN Card") {
      if (
        name.includes("aadhaar") ||
        name.includes("adhar") ||
        name.includes("uidai")
      ) {
        return "You are uploading an Aadhaar Card in the PAN Card slot. Please select 'Aadhaar Card' from the dropdown or try another file.";
      }
      if (
        name.includes("marksheet") ||
        name.includes("10th") ||
        name.includes("12th") ||
        name.includes("graduation") ||
        name.includes("degree")
      ) {
        return "You are uploading a Marksheet in the PAN Card slot. Please select the correct marksheet slot.";
      }
      if (
        name.includes("signature") ||
        name.includes("sign") ||
        name.includes("photo")
      ) {
        return "You are uploading a photo or signature in the PAN Card slot.";
      }
    }

    // 10th Marksheet Checks
    if (type === "10th Marksheet") {
      if (
        name.includes("12th") ||
        name.includes("twelfth") ||
        name.includes("hsc")
      ) {
        return "You are uploading a 12th Marksheet in the 10th Marksheet slot.";
      }
      if (
        name.includes("graduation") ||
        name.includes("degree") ||
        name.includes("btech") ||
        name.includes("bsc") ||
        name.includes("ba_")
      ) {
        return "You are uploading a Graduation Marksheet in the 10th Marksheet slot.";
      }
      if (
        name.includes("aadhaar") ||
        name.includes("adhar") ||
        name.includes("pan")
      ) {
        return "You are uploading an Identity Card in the 10th Marksheet slot.";
      }
    }

    // 12th Marksheet Checks
    if (type === "12th Marksheet") {
      if (
        name.includes("10th") ||
        name.includes("tenth") ||
        name.includes("ssc")
      ) {
        return "You are uploading a 10th Marksheet in the 12th Marksheet slot.";
      }
      if (
        name.includes("graduation") ||
        name.includes("degree") ||
        name.includes("btech") ||
        name.includes("bsc") ||
        name.includes("ba_")
      ) {
        return "You are uploading a Graduation Marksheet in the 12th Marksheet slot.";
      }
      if (
        name.includes("aadhaar") ||
        name.includes("adhar") ||
        name.includes("pan")
      ) {
        return "You are uploading an Identity Card in the 12th Marksheet slot.";
      }
    }

    // Graduation Marksheet Checks
    if (type === "Graduation Certificate") {
      if (
        name.includes("10th") ||
        name.includes("tenth") ||
        name.includes("12th") ||
        name.includes("twelfth")
      ) {
        return "You are uploading a high school marksheet in the Graduation slot.";
      }
      if (
        name.includes("aadhaar") ||
        name.includes("adhar") ||
        name.includes("pan")
      ) {
        return "You are uploading an Identity Card in the Graduation slot.";
      }
    }

    return null;
  };

  const handleFileProcess = (file: File) => {
    if (!file) return;

    // Check size limit (avoid localstorage quota error)
    if (file.size > 2 * 1024 * 1024) {
      triggerError(
        "File size exceeds 2MB limit. To avoid local storage quota warnings, upload a lighter file.",
      );
      return;
    }

    // Run filename and metadata checks to keep slots clean
    const validationError = validateUploadedFile(file, selectedType);
    if (validationError) {
      triggerError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;

      try {
        await addDocument(
          currentUser.id,
          selectedType,
          file.name,
          base64Data,
          file.type,
          sizeStr,
        );

        triggerSuccess(
          `${selectedType} securely uploaded and stored in cloud wallet sandbox!`,
        );
        onDocumentsUpdated();

        // Auto toggle to next empty type for ease of use
        const currentIndex = DOCUMENT_TYPES_LIST.indexOf(selectedType);
        const nextEmptyIndex = DOCUMENT_TYPES_LIST.findIndex(
          (t, idx) => idx > currentIndex && !getDocForType(t),
        );
        if (nextEmptyIndex !== -1) {
          setSelectedType(DOCUMENT_TYPES_LIST[nextEmptyIndex]);
        } else {
          const firstEmptyIndex = DOCUMENT_TYPES_LIST.findIndex(
            (t) => !getDocForType(t),
          );
          if (firstEmptyIndex !== -1) {
            setSelectedType(DOCUMENT_TYPES_LIST[firstEmptyIndex]);
          }
        }
      } catch (err: any) {
        console.error(err);
        triggerError(
          "Failed to save document. Please check your network or try a lighter file.",
        );
      }
    };
    reader.onerror = () => {
      triggerError("Could not process file. Try another document.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (docId: string, typeName: string) => {
    try {
      if (confirm(`Are you sure you want to delete your stored ${typeName}?`)) {
        await deleteDocument(currentUser.id, docId);
        triggerSuccess(`${typeName} removed from database.`);
        onDocumentsUpdated();
      }
    } catch (err: any) {
      console.error("Delete failed:", err);
      triggerError("Delete failed. Please try again.");
    }
  };

  const handleOptionChange = (
    docId: string,
    option: "original" | "jpg_50" | "pdf_100",
  ) => {
    setSelectedDownloadOptions((prev) => ({ ...prev, [docId]: option }));
  };

  const handleDownloadTrigger = (doc: UploadedDocument) => {
    const selectedOption = selectedDownloadOptions[doc.id] || "original";
    downloadFile(doc, selectedOption);
  };

  // Check if a document of specific type exists
  const getDocForType = (type: DocumentType) => {
    return documents.find((d) => d.type === type);
  };

  // Quick seed sample data if user wants immediate interactive testing
  const seedSampleDoc = async (type: DocumentType) => {
    // Generate an elegant SVG mock canvas
    const mockCanvas = document.createElement("canvas");
    mockCanvas.width = 400;
    mockCanvas.height = 350;
    const ctx = mockCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#F3F6FD";
      ctx.fillRect(0, 0, 400, 350);
      ctx.strokeStyle = "#3B66F5";
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 386, 336);

      ctx.fillStyle = "#A2ABB8";
      ctx.fillRect(40, 40, 320, 2);

      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#1A1D24";
      ctx.fillText(`GOVERNMENT OF INDIA`, 105, 75);
      
      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#3B66F5";
      ctx.fillText(type.toUpperCase(), 45, 140);
      
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#555E6E";
      ctx.fillText(`Holder Name : ${currentUser.fullName}`, 45, 200);
      ctx.fillText(`Status      : VERIFIED LOX`, 45, 230);
      ctx.fillText(`Identifier  : LOCKER-${Date.now().toString().slice(-6)}`, 45, 260);

      ctx.fillStyle = "#EBEFF8";
      ctx.fillRect(40, 290, 320, 1.5);
    }
    const mockDataUrl = mockCanvas.toDataURL("image/png");

    await addDocument(
      currentUser.id,
      type,
      `${type.toLowerCase().replace(" ", "_")}_verified_locker.png`,
      mockDataUrl,
      "image/png",
      "51.2 KB",
    );
    triggerSuccess(`Auto-generated secure mock ${type} template for immediate testing!`);
    onDocumentsUpdated();
  };

  return (
    <div className="space-y-8 text-[#1A1D24] font-sans">
      
      {/* 1. INTRO BANNER REDESIGN (Sleek light workspace) */}
      <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_10px_35px_rgba(59,102,245,0.015)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-[#3B66F5]" />
        </div>
        
        <div className="space-y-3 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[#3B66F5] font-extrabold text-[10px] uppercase tracking-wider bg-[#F3F6FD] px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="h-4 w-4 shrink-0 stroke-[2.5]" />
            <span>Secure DigiWallet Sandbox</span>
          </div>
          <h1 className="text-3.5xl font-black text-[#1A1D24] tracking-tight leading-none mt-1">
            Your Document Portfolio
          </h1>
          <p className="text-[#8C95A6] text-xs font-semibold leading-relaxed">
            Upload Aadhaar, PAN, Marksheets, and Experience Certificates.
            Everything is 100% end-to-end secured inside FormSathi personal ecosystem.
            Download conforming mock formats perfectly matching SSC, UPSC, or custom layout guidelines instantly.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <div className="flex items-center gap-3.5 bg-[#FAFBFD] px-5 py-4 rounded-2.5xl border border-[#EBEFF8] shadow-sm">
            <div className="h-10 w-10 rounded-2xl bg-[#F3F6FD] flex items-center justify-center text-[#3B66F5]">
              <HardDrive className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xs text-[#1A1D24] block leading-tight"> Lox Locker Storage</span>
              <span className="text-[#8C95A6] font-bold text-[10px] block mt-0.5">
                {documents.length} of {DOCUMENT_TYPES_LIST.length} Uploaded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success / Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 rounded-2xl bg-[#EDFAF0] border border-[#DEF7E5] px-4 py-3.5 text-xs font-bold text-[#47C965] shadow-xs"
          >
            <CheckCircle2 className="h-5 w-5 text-[#47C965] shrink-0" />
            <p>{successMessage}</p>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 rounded-2xl bg-[#FFF2F2] border border-[#FFE4E4] px-4 py-3.5 text-xs font-bold text-[#E02020] shadow-xs"
          >
            <AlertCircle className="h-5 w-5 text-[#E02020] shrink-0" />
            <p>{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. REQUISITE CHECKLIST GRID */}
      <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-7 md:p-8 shadow-[0_10px_35px_rgba(59,102,245,0.015)]">
        <div className="flex items-center gap-3.5 mb-6.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F6FD] text-[#3B66F5]">
            <FileText className="h-5.5 w-5.5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#1A1D24] tracking-tight">Required Documents Checklist</h2>
            <p className="text-[11px] text-[#8C95A6] font-semibold mt-0.5">Check off essential national items required for dynamic fast form submission</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3.5 gap-x-6 mb-2 mt-2">
          {DOCUMENT_TYPES_LIST.slice(0, 12).map((item) => {
            const isUploaded = !!getDocForType(item);
            return (
              <div key={item} className="flex items-center gap-3 py-1">
                <CheckCircle2
                  className={`h-4.5 w-4.5 shrink-0 transition-colors stroke-[2.5] ${
                    isUploaded ? "text-[#47C965]" : "text-[#C4CDDB]"
                  }`}
                />
                <span
                  className={`font-bold text-xs truncate transition-all ${
                    isUploaded ? "text-[#1A1D24]" : "text-[#8C95A6]"
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CORE UPLOAD & FILE REGISTRY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        
        {/* Upload gateway Form (Left Panel 1-Column) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-6 shadow-[0_10px_35px_rgba(59,102,245,0.015)] space-y-5">
            <h2 className="text-xs font-black text-[#1A1D24] uppercase tracking-wider flex items-center gap-2">
              <UploadCloud className="h-4.5 w-4.5 text-[#3B66F5] stroke-[2.2]" />
              Secure Upload Gateway
            </h2>

            <div className="space-y-1.5Packed">
              <label className="block text-[11px] font-bold text-[#8C95A6] uppercase tracking-wide">
                Select Document Slot
              </label>
              <select
                id="wallet-doc-type-select"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as DocumentType)
                }
                className="block w-full rounded-2xl border border-[#EBEFF8] bg-[#FAFBFD] py-3 px-4 text-xs font-bold text-[#1A1D24] focus:border-[#3B66F5] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]/10 mt-1 cursor-pointer"
              >
                {DOCUMENT_TYPES_LIST.map((type) => (
                  <option key={type} value={type}>
                    {type} {getDocForType(type) ? "✓ (Replace)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-[#F3F6FD] p-1.5 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setUploadMode("file");
                }}
                className={`flex-1 py-2 text-center text-[11px] font-extrabold rounded-xl transition-all cursor-pointer ${
                  uploadMode === "file"
                    ? "bg-white text-[#3B66F5] shadow-xs"
                    : "text-[#8C95A6] hover:text-[#1A1D24]"
                }`}
              >
                🗳️ File Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode("camera");
                }}
                className={`flex-1 py-2 text-center text-[11px] font-extrabold rounded-xl transition-all cursor-pointer ${
                  uploadMode === "camera"
                    ? "bg-white text-[#3B66F5] shadow-xs"
                    : "text-[#8C95A6] hover:text-[#1A1D24]"
                }`}
              >
                📸 Camera Snapshot
              </button>
            </div>

            {/* Conditionally Render File Drag & Drop or Camera Controller */}
            {uploadMode === "camera" ? (
              <div className="bg-[#FAFBFD] border-2 border-dashed border-[#EBEFF8] rounded-3xl p-5 text-center overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                {cameraActive ? (
                  <div className="w-full space-y-4">
                    <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video border border-[#FAFBFD]">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="absolute top-3 left-3 bg-[#1A1D24]/80 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-xs">
                        <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping"></span>
                        Live Camera
                      </div>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#3B66F5] hover:bg-[#2F52C7] text-white py-3 px-4 rounded-xl text-xs font-black transition-colors shadow-sm cursor-pointer"
                      >
                        <Camera className="h-4 w-4" /> Capture Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#64748B]/10 hover:bg-[#64748B]/15 text-[#64748B] py-3 px-4 rounded-xl text-xs font-black transition-colors cursor-pointer"
                      >
                        Stop Feed
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-4 w-full">
                    <div className="h-12 w-12 rounded-full bg-[#F3F6FD] border border-[#EBEFF8] flex items-center justify-center text-[#3B66F5] mx-auto animate-pulse">
                      <Video className="h-5 w-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1A1D24]">Snap Document with Camera</h4>
                      <p className="text-[10px] text-[#8C95A6] font-semibold mt-0.5">
                        Apne device camera se photo kheencho automatic process ke liye.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#3B66F5] hover:bg-[#2F52C7] text-white rounded-xl py-3 px-4 text-xs font-black shadow-sm transition-colors cursor-pointer"
                    >
                      <Camera className="h-4 w-4" /> Start Device Camera
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Drag & Drop Area */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragging
                    ? "border-[#3B66F5] bg-[#F3F6FD] scale-[0.98]"
                    : "border-[#EBEFF8] bg-[#FAFBFD] hover:bg-white hover:border-[#3B66F5]"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                />
                <UploadCloud className="h-10 w-10 text-[#A2ABB8] mx-auto mb-3 stroke-[1.8]" />
                <p className="text-xs font-extrabold text-[#1A1D24]">
                  Drag & Drop file here
                </p>
                <p className="text-[10px] text-[#8C95A6] font-semibold mt-1">
                  or click to browse computer parameters
                </p>
                <div className="mt-4.5 flex gap-1 items-center justify-center text-[9px] text-[#8C95A6] font-bold bg-[#F3F6FD] py-1.5 px-3 rounded-xl border border-[#EBEFF8]">
                  <span>PDF</span>•<span>PNG</span>•<span>JPG</span>•
                  <span>Max 2MB</span>
                </div>
              </div>
            )}

            {/* Simulated Seeding Section for convenience */}
            <div className="rounded-2xl bg-[#FFF9E9] p-4.5 border border-[#FFEFC2] flex gap-3 text-xs">
              <Info className="h-4.5 w-4.5 text-[#F5A623] shrink-0 mt-0.5 stroke-[2.2]" />
              <div className="space-y-1">
                <span className="font-extrabold text-[10px] text-[#F5A623] uppercase tracking-wider block">
                  Interactive Quick sandbox
                </span>
                <p className="text-[#966b16] text-[11px] font-semibold leading-relaxed">
                  Generate mock identity items or academic transcripts instant seed-token. No real documentation required!
                </p>
                <button
                  type="button"
                  id="seed-mock-doc-btn"
                  onClick={() => seedSampleDoc(selectedType)}
                  className="mt-2 inline-flex items-center gap-1.5 bg-[#F5A623] text-white rounded-xl px-3 py-1.5 text-[10px] font-extrabold shadow-sm hover:bg-[#dd941c] transition-colors"
                >
                  Generate Mock {selectedType}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Documents Registry list (Right Column) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-[2rem] border border-[#EBEFF8] bg-white p-6 md:p-8 shadow-[0_10px_35px_rgba(59,102,245,0.015)]">
            <div className="flex items-center justify-between border-b border-[#EBEFF8] pb-4 mb-6">
              <h2 className="text-sm font-extrabold text-[#1A1D24] uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#3B66F5] stroke-[2.2]" /> Active Locker Wallet Registry
              </h2>
              <span className="text-[10px] bg-[#F3F6FD] px-3.5 py-1.5 rounded-full text-[#3B66F5] font-extrabold border border-[#EBEFF8]">
                {documents.length} Stored Items
              </span>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
              {DOCUMENT_TYPES_LIST.map((type) => {
                const doc = getDocForType(type);
                const isSelectedOption =
                  selectedDownloadOptions[doc?.id || ""] || "original";

                return (
                  <div
                    key={type}
                    className={`rounded-2.5xl transition-all flex flex-col justify-between p-5 ${
                      doc
                        ? "border border-[#EBEFF8] bg-white shadow-sm hover:shadow-md hover:border-[#3B66F5]/40"
                        : "border-2 border-dashed border-[#EBEFF8] bg-[#FAFBFD] hover:border-[#3B66F5]/30 hover:bg-white"
                    }`}
                  >
                    <div>
                      {/* Slot Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold ${
                              doc
                                ? "bg-[#EDFAF0] text-[#47C965]"
                                : "bg-[#F3F6FD] text-[#A2ABB8]"
                            }`}
                          >
                            <FileText className="h-4.5 w-4.5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold text-[#1A1D24] tracking-tight truncate">
                              {type}
                            </h4>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C95A6]">
                              {doc ? "Securely Anchored" : "Empty Slot"}
                            </span>
                          </div>
                        </div>

                        {doc && (
                          <button
                            onClick={() => handleDelete(doc.id, type)}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[#8C95A6] hover:text-[#E02020] hover:bg-red-50 border border-[#EBEFF8] transition-colors text-[10px] font-bold"
                            title="Delete file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Content Section */}
                      {doc ? (
                        <div className="mt-4 space-y-3.5">
                          <div className="text-[11px] bg-[#FAFBFD] border border-[#EBEFF8] p-2.5 rounded-xl space-y-0.5 shadow-2xs">
                            <p
                              className="font-bold text-[#1A1D24] truncate"
                              title={doc.fileName}
                            >
                              {doc.fileName}
                            </p>
                            <div className="flex justify-between text-[9px] text-[#8C95A6] font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {doc.uploadDate}
                              </span>
                              <span>{doc.fileSize}</span>
                            </div>
                          </div>

                          {/* Options trigger */}
                          <div className="space-y-1.5 pt-2 border-t border-[#EBEFF8]">
                            <label className="block text-[9px] font-extrabold text-[#8C95A6] uppercase tracking-wider">
                              Compliance Output Format
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={isSelectedOption}
                                onChange={(e) =>
                                  handleOptionChange(
                                    doc.id,
                                    e.target.value as any,
                                  )
                                }
                                className="block w-full rounded-xl border border-[#EBEFF8] bg-[#FAFBFD] py-1.5 px-2.5 text-[10px] font-bold text-[#1A1D24] focus:outline-none focus:ring-1 focus:ring-[#3B66F5]"
                              >
                                <option value="original">Original Format</option>
                                <option value="jpg_50">JPG Format (Max 50KB)</option>
                                <option value="pdf_100">PDF Format (Max 100KB)</option>
                              </select>

                              <button
                                onClick={() => handleDownloadTrigger(doc)}
                                className="p-1.5 shrink-0 rounded-xl bg-[#3B66F5] text-white font-bold hover:bg-[#2F52C7] transition-all flex items-center justify-center cursor-pointer shadow-sm"
                                title="Download and check"
                              >
                                <Download className="h-3.5 w-3.5 stroke-[2.2]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 text-center py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedType(type);
                              fileInputRef.current?.click();
                            }}
                            className="inline-flex items-center gap-1 bg-[#FAFBFD] hover:bg-white border border-[#EBEFF8] hover:border-[#3B66F5] px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-[#8C95A6] hover:text-[#3B66F5] transition-all cursor-pointer"
                          >
                            <UploadCloud className="h-3.5 w-3.5 mr-1" /> Upload Slot
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
