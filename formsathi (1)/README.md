# FormSathi 📝✨

**FormSathi** is India's first AI-powered document vault and real-time form checker. It serves students and job seekers by providing a Secure Document Wallet, an AI-powered Form Checker that runs against a verified profile, and a Job & Scholarship Hub. It drastically reduces rejection rates in scholarship, government job, and defence forms.

## 🚀 Features
- **Secure Document Wallet**: Store Aadhaar, PAN, Photos, and Marksheets in their original quality to prevent compression issues.
- **Verified Profile**: Acts as your single source of truth for all form-filling.
- **AI Form Checker (`/api/check-form`)**: Upload a screenshot of your filled form and our AI (Google Gemini Flash) securely compares every field against your verified profile, detecting mismatches (like date format errors or incorrectly sized photos) instantly.
- **AI Rules Memory**: The AI remembers your preferences across exam forms (e.g., UPSC needs a slate photo).
- **Floating AI Chat**: A contextual AI assistant available precisely when you need help filling out confusing form fields.
- **Job & Scholarship Hub**: Curated official portals and reminder setting capabilities.
- **Real-Time Chrome Extension**: Analyzes forms directly on the webpage (using the included extension) and highlights errors.

## 🛠 Tech Stack
- **Frontend**: React 18 / Vite (TypeScript), Tailwind CSS.
- **UI Components**: `lucide-react`, `framer-motion` for fluid animations.
- **Backend/API**: Express (Node.js) using the `server.ts` full-stack setup, seamlessly proxying calls to Gemini AI.
- **Database**: Firebase (Firestore) securely protected by Row-Level Security.
- **Storage**: Firebase Storage for pristine document keeping.
- **Authentication**: Firebase Authentication (Email/Password, Phone OTP, Google OAuth).
- **AI**: Google Gemini Flash API (`@google/genai`).

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd formsathi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root folder based on `.env.example`:
   ```bash
   # Server-side secrets
   GEMINI_API_KEY="your-gemini-flash-api-key"

   # Client-side Firebase configs
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🧩 Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `/extension` folder from this repository.
5. The FormSathi assistant is now live! Pin it to your toolbar and use it on any admission/job application page. 
*(Note: Be sure to log in to the extension to synchronize with your verified profile).*

## 🔒 Firebase Deployment (Firestore/Storage Rules)

To ensure the safety of user data, ensure you deploy the strictest row-level security policies.

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```
2. **Login to Firebase:**
   ```bash
   firebase login
   ```
3. **Initialize Firestore and Storage:**
   If this is a new project, run:
   ```bash
   firebase init
   ```
   *Select Firestore and Storage, and use the default rule file names (`firestore.rules` and `storage.rules`).*

4. **Paste Firestore Rules (`firestore.rules`):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /userProfiles/{uid} { allow read,write: if request.auth.uid == uid; }
       match /documents/{doc} { allow read,write,delete: if request.auth.uid == resource.data.userId; }
       match /formChecks/{doc} { allow read,write,delete: if request.auth.uid == resource.data.userId; }
       match /userRules/{doc} { allow read,write,delete: if request.auth.uid == resource.data.userId; }
       match /chatMessages/{doc} { allow read,write,delete: if request.auth.uid == resource.data.userId; }
       match /reminders/{doc} { allow read,write,delete: if request.auth.uid == resource.data.userId; }
     }
   }
   ```

5. **Paste Storage Rules (`storage.rules`):**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/{allPaths=**} {
         allow read,write: if request.auth.uid == userId;
       }
     }
   }
   ```

6. **Deploy the rules:**
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

## 🌐 Deploying Server to Production

Because FormSathi uses sensitive API keys and server-side components (using a proxy backend), it compiles everything natively to Node execution using `esbuild`. 
Any host that supports Node.js or Docker can run the project.

Here's how to build and start internally:
```bash
npm run build
npm run start
```
This serves on port `3000` locally/in your cloud container natively.
