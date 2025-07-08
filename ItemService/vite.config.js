// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import federation from "@originjs/vite-plugin-federation";

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: "planning",
//       filename: "remoteEntry.js",
//       remotes: {
//         shell: "http://172.20.136.101:5000/dist/assets/remoteEntry.js",
//       },

//       shared: [
//         "react",
//         "react-dom",
//         "@mui/material",
//         // '@mui/icons-material',
//         "@mui/x-data-grid",
//         "react-router-dom",
//         "jotai",
//       ],
//       dev: true,
//     }),
//   ],
//   build: {
//     modulePreload: false,
//     target: "esnext",
//     minify: false,
//     cssCodeSplit: false,
//   },
//   server: {
//     port: 5008,
//     hmr: true,
//   },
// });


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
        name: "itemService", // Replace with your service name
        filename: "remoteEntry.js",
        remotes: {
          // shell: getEnvVar("SHELL_URL"),
            shell: "http://172.20.136.101:5000/dist/assets/remoteEntry.js",
          
        },

      exposes: {

     "./CreateItem": "./src/components/Item/CreateItem.jsx",
     "./UpdateItem": "./src/components/Item/UpdateItem.jsx",
     "./ListItems": "./src/components/Item/ItemList.jsx",
     "./DeleteItem": "./src/components/Item/DeleteItem.jsx",




     "./CreateInspection": "./src/components/Inspection/CreateInspection.jsx",
     "./UpdateInspection": "./src/components/Inspection/UpdateInspection.jsx",
     "./DeleteInspection": "./src/components/Inspection/DeleteInspection.jsx",
     "./ListInspectedItem": "./src/components/Inspection/ListInspectedItem.jsx",


        
       

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
      port: parseInt(getEnvVar("ITEM_SERVICE_PORT", "5018")),

      cors: true,
      strictPort: true,
      host: "0.0.0.0",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  };
});



