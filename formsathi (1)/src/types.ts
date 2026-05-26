export interface User {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  verificationCode?: string;
  googleUser?: boolean;
}

export type DocumentType =
  | "Aadhaar Card"
  | "PAN Card"
  | "10th Marksheet"
  | "12th Marksheet"
  | "Graduation Certificate"
  | "Graduation Marksheet"
  | "Income Certificate"
  | "Caste Certificate"
  | "Domicile Certificate"
  | "Character Certificate"
  | "Experience Certificate"
  | "NCC Certificate"
  | "Sports Certificate"
  | "Disability Certificate"
  | "Passport Photo"
  | "Photo"
  | "Live Photo"
  | "Signature"
  | "Signature Scan"
  | "Thumb Impression"
  | "Mobile Number"
  | "Email ID";

export interface UploadedDocument {
  id: string;
  userId: string;
  type: DocumentType;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileData: string; // Base64 or object URL representing the file
  mimeType: string;
}

export interface VerifiedProfile {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  fatherName: string;
  aadhaarNumber: string;
  panNumber: string;
  updatedAt: string;
}

export interface FormDataFields {
  fullName: string;
  dateOfBirth: string;
  fatherName: string;
  documentNumber: string;
  formName: string;
}

export interface SavedPassword {
  id: string;
  userId: string;
  title: string;
  username: string;
  passwordEncrypted: string;
  url: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
