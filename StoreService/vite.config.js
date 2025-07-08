
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
        name: "storeService", // Replace with your service name
        filename: "remoteEntry.js",
        remotes: {
          // shell: getEnvVar("SHELL_URL"),
            shell: "http://172.20.136.101:5000/dist/assets/remoteEntry.js",
          
        },

     
exposes: {
    // Cell components
    './CreateCell': './src/components/Cell/CreateCell.jsx',
    './DeleteCell': './src/components/Cell/DeleteCell.jsx',
    './ListCell': './src/components/Cell/ListCell.jsx',
    './UpdateCell': './src/components/Cell/UpdateCell.jsx',
    
    // IssuableItem components
    './CreateIssuableItem': './src/components/IssuableItem/CreateIssuableItem.jsx',
    './DeleteIssuableItem': './src/components/IssuableItem/DeleteIssuableItem.jsx',
    './ListIssuableItem': './src/components/IssuableItem/ListIssuableItem.jsx',
    './UpdateIssuableItem': './src/components/IssuableItem/UpdateIssuableItem.jsx',
    
    // ReceivableItem components
    './CreateReceivableItem': './src/components/ReceivableItem/CreateReceivableItem.jsx',
    './DeleteReceivableItem': './src/components/ReceivableItem/DeleteReceivableItem.jsx',
    './ListReceivableItem': './src/components/ReceivableItem/ListReceivableItem.jsx',
    './UpdateReceivableItem': './src/components/ReceivableItem/UpdateReceivableItem.jsx',
    
    // Shelf components
    './CreateShelf': './src/components/Shelf/CreateShelf.jsx',
    './DeleteShelf': './src/components/Shelf/DeleteShelf.jsx',
    './ListShelf': './src/components/Shelf/ListShelf.jsx',
    './UpdateShelf': './src/components/Shelf/UpdateShelf.jsx',
    
    // Store components
    './CreateStore': './src/components/Store/CreateStore.jsx',
    './DeleteStore': './src/components/Store/DeleteStore.jsx',
    './ListStore': './src/components/Store/ListStore.jsx',
    './UpdateStore': './src/components/Store/UpdateStore.jsx',
    
    // Store Requisition components
    './CreateStoreRequisition': './src/components/Store Requisition/CreateStoreRequisition.jsx',
    './DeleteStoreRequisition': './src/components/Store Requisition/DeleteStoreRequisition.jsx',
        './ListStoreRequisition': './src/components/Store Requisition/ListStoreRequisition.jsx',
                './UpdateStoreRequisition': './src/components/Store Requisition/UpdateStoreRequisition.jsx',


    
    // StoreCategory components
    './CreateStoreCategory': './src/components/StoreCategory/CreateStoreCategory.jsx',
    './DeleteStoreCategory': './src/components/StoreCategory/DeleteStoreCategory.jsx',
    './ListStoreCategory': './src/components/StoreCategory/ListStoreCategory.jsx',
    './UpdateStoreCategory': './src/components/StoreCategory/UpdateStoreCategory.jsx',
    
    // AppLogin
    './AppLogin': './src/components/AppLogin.jsx'
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
      port: parseInt(getEnvVar("STORE_SERVICE_PORT", "5018")),

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



