
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';



export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "../");
  const localEnv = loadEnv(mode, envDir, "");

  const getEnvVar = (key, fallback = "") =>
    process.env[key] || localEnv[key] || fallback;


  return {
    plugins: [
      react(),
      federation({
        name: "complaintService",
        filename: "remoteEntry.js",
        remotes: {
           shell: getEnvVar("SHELL_URL"),
        },

        
      exposes: {
        // ComplaintType
        "./CreateComplaintType":
          "./src/components/ComplaintType/CreateComplaintType.jsx",
        "./ListComplaintType":
          "./src/components/ComplaintType/ListComplaintType.jsx",
        "./UpdateComplaintType":
          "./src/components/ComplaintType/UpdateComplaintType.jsx",
        "./DeleteComplaintType":
          "./src/components/ComplaintType/DeleteComplaintType.jsx",

        // Complaint
        "./CreateComplaint": "./src/components/Complaint/CreateComplaint.jsx",
        "./ListComplaint": "./src/components/Complaint/ListComplaint.jsx",
        "./UpdateComplaint": "./src/components/Complaint/UpdateComplaint.jsx",
        "./DeleteComplaint": "./src/components/Complaint/DeleteComplaint.jsx",
        "./ListComplaintByEmployee":
          "./src/components/Complaint/ListComplaintByEmployee.jsx",

        // ComplaintHandling
        "./CreateComplaintHandling":
          "./src/components/ComplaintHandling/CreateComplaintHandling.jsx",
        "./ListComplaintHandlingsByDepartment":
          "./src/components/ComplaintHandling/ListComplaintHandlingsByDepartment.jsx",
        "./UpdateComplaintHandlingDecision":
          "./src/components/ComplaintHandling/UpdateComplaintHandlingDecision.jsx",
        "./CreateComplaintHandlingRejected":
          "./src/components/ComplaintHandling/CreateComplaintHandlingRejected.jsx",
        "./DeleteComplaintHandling":
          "./src/components/ComplaintHandling/DeleteComplaintHandling.jsx",

        // Attachments
        "./ListAttachments": "./src/components/Attachments/ListAttachments.tsx",
        "./DeleteAttachment":
          "./src/components/Attachments/DeleteAttachment.jsx",
      },
       
        shared: [
          "react",
          "react-dom",
          "@mui/material",
          "@mui/x-data-grid",
          "react-router-dom",
          "jotai",
        ],
        dev: true,
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      port: parseInt(getEnvVar("COMPLAINT_SERVICE_PORT", "5015")),
      cors: true,
      strictPort: true,
      host: "0.0.0.0",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
  };
});


