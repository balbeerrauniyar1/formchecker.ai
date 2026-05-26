import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import JSZip from "jszip";
import fs from "fs";

dotenv.config();

// Helper to recursively add files to JSZip
function zipFolderSync(currentPath: string, zipInstance: JSZip) {
  const items = fs.readdirSync(currentPath);
  for (const item of items) {
    if (
      item === "node_modules" ||
      item === "dist" ||
      item === ".git" ||
      item === ".github" ||
      item === ".next" ||
      item === "package-lock.json"
    ) {
      continue;
    }

    const fullPath = path.join(currentPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const folderZip = zipInstance.folder(item);
      if (folderZip) {
        zipFolderSync(fullPath, folderZip);
      }
    } else {
      const content = fs.readFileSync(fullPath);
      zipInstance.file(item, content);
    }
  }
}

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/download-all", async (req, res) => {
    try {
      const zip = new JSZip();
      const projectRoot = process.cwd();
      
      const items = fs.readdirSync(projectRoot);
      for (const item of items) {
        if (
          item === "node_modules" ||
          item === "dist" ||
          item === ".git" ||
          item === ".github" ||
          item === ".next" ||
          item === "package-lock.json"
        ) {
          continue;
        }
        
        const fullPath = path.join(projectRoot, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          const folderZip = zip.folder(item);
          if (folderZip) {
            zipFolderSync(fullPath, folderZip);
          }
        } else {
          const content = fs.readFileSync(fullPath);
          zip.file(item, content);
        }
      }
      
      const content = await zip.generateAsync({ type: "nodebuffer" });
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="FormSathi_Project_Codebase.zip"');
      res.setHeader("Content-Length", content.length);
      res.send(content);
    } catch (err: any) {
      console.error("Failed to generate zip", err);
      res.status(500).json({ error: "Failed to create download package" });
    }
  });

  app.post("/api/verify-document", async (req, res) => {
    try {
      const { docType, fileData, mimeType, profileData } = req.body;

      if (!fileData || !docType) {
        return res.status(400).json({ error: "Missing document data" });
      }

      // Convert base64
      let base64Data = fileData;
      if (base64Data.includes("base64,")) {
        base64Data = base64Data.split("base64,")[1];
      }

      const prompt = `You are an AI assistant tasked with verifying Indian documents (like Aadhaar Card, PAN Card). 
Analyze the provided document image.
Document Type provided by user: ${docType}

We have the following verified profile data for this user:
FullName: ${profileData?.fullName || "Not provided"}
DateOfBirth: ${profileData?.dateOfBirth || "Not provided"}
FatherName: ${profileData?.fatherName || "Not provided"}
AadhaarNumber: ${profileData?.aadhaarNumber || "Not provided"}
PanNumber: ${profileData?.panNumber || "Not provided"}

Verify if the uploaded document matches the intended type (${docType}), and see if the name or other details in the document match the verified profile data above. 
Provide a detailed matching confidence score (0-100%) and a reason for your evaluation. Return only a JSON response in the following schema:
{
  "isValidType": boolean,
  "confidenceScore": number,
  "matchedFields": ["Name", "DOB", etc...],
  "mismatchedFields": ["Name", "DOB", etc...],
  "reason": "Detailed string explaining the reasoning"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType || "image/jpeg"
            }
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      let verificationResult;
      try {
        verificationResult = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON", text);
        return res.status(500).json({ error: "Invalid response from AI" });
      }

      res.json(verificationResult);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to verify document" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, profileData, documentsData } = req.body;
      
      const systemInstruction = `You are FormSathi AI, an intelligent, persistent assistant for form-filling and document management.
You have access to the user's verified profile data and the list of documents they have uploaded (metadata only). 
If the user asks about their data or whether they have uploaded a specific document, use the provided context to answer accurately. 
You can guide them on what forms they can fill with their current document set, and what else they might need.
Keep answers helpful, conversational, and concise.

User's Profile Data:
${JSON.stringify(profileData, null, 2)}

User's Uploaded Document Catalog (types and filenames only):
${JSON.stringify(documentsData, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });
      
      res.json({ reply: response.text });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
