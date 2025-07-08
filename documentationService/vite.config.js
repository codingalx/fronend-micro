
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
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
        name: "documentService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

       
        exposes: {
          "./CreateDocumentType":
            "./src/components/documentTpe/CreateDocumentType.jsx",
          "./DeleteDocumentType":
            "./src/components/documentTpe/DeleteDocumentType.jsx",
          "./UpdateDocumentType":
            "./src/components/documentTpe/UpdateDocumentType.jsx",

          "./CreateDocument": "./src/components/documents/CreateDocument.jsx",
          "./DeleteDocument": "./src/components/documents/DeleteDocument.jsx",
          "./ListDocument": "./src/components/documents/ListDocument.jsx",
          "./UpdateDocument": "./src/components/documents/UpdateDocument.jsx",

          "./DocumentApprovance": "./src/components/documents/DocumentApprovance.jsx",
          "./GenerateDocument": "./src/components/documents/GenerateDocument.jsx",



          



          
        },
        shared: [
          "react",
          "react-dom",
          "@mui/material",
          // '@mui/icons-material',
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
      port: parseInt(getEnvVar("DOCUMENT_SERVICE_PORT", "5010")),
      cors: true,
      strictPort: true,
      host: "0.0.0.0",
    },
    headers: {
      "Access-Control-Allow-Origin": "*", // Allows any origin (for dev only!)
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  };
});



// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import federation from "@originjs/vite-plugin-federation";
//   import path from 'path';

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, path.resolve(__dirname, '../'), '');

//   return {
//     plugins: [
//       react(),
//       federation({
//         name: "documentService",
//         filename: "remoteEntry.js",
//         remotes: {
//           shell: env.SHELL_URL, // Use environment variable
//         },

//         exposes: {
//           "./CreateDocumentType":
//             "./src/components/documentTpe/CreateDocumentType.jsx",
//           "./DeleteDocumentType":
//             "./src/components/documentTpe/DeleteDocumentType.jsx",
//           "./UpdateDocumentType":
//             "./src/components/documentTpe/UpdateDocumentType.jsx",

//           "./CreateDocument": "./src/components/documents/CreateDocument.jsx",
//           "./DeleteDocument": "./src/components/documents/DeleteDocument.jsx",
//           "./ListDocument": "./src/components/documents/ListDocument.jsx",
//           "./UpdateDocument": "./src/components/documents/UpdateDocument.jsx",

//           "./DocumentApprovance": "./src/components/documents/DocumentApprovance.jsx",
//           "./GenerateDocument": "./src/components/documents/GenerateDocument.jsx",



          



          
//         },
//         shared: [
//           "react",
//           "react-dom",
//           "@mui/material",
//           // '@mui/icons-material',
//           "@mui/x-data-grid",
//           "react-router-dom",
//           "jotai",
//         ],
//         dev: true,
//       }),
//     ],
//     build: {
//       modulePreload: false,
//       target: "esnext",
//       minify: false,
//       cssCodeSplit: false,
//     },
//     server: {
//       port: env.DOCUMENT_SERVICE_PORT,
//       cors: true,
//       strictPort: true,
//       host: "0.0.0.0",
//     },
//     headers: {
//       "Access-Control-Allow-Origin": "*", // Allows any origin (for dev only!)
//       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//       "Access-Control-Allow-Headers":
//         "X-Requested-With, content-type, Authorization",
//     },
//   };
// });