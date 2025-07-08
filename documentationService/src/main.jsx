import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AppLogin from "./components/security/AppLogin";
import AppLogout from "./components/security/AppLogout";
import CreateDocumentType from "./components/documentTpe/CreateDocumentType";
import UpdateDocumentType from "./components/documentTpe/UpdateDocumentType";
import DeleteDocumentType from "./components/documentTpe/DeleteDocumentType";

const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> 
      <Route path="/logout" element={<AppLogout />} /> 
      <Route path="/document/document_type" element={<CreateDocumentType />} /> 
      <Route path="/document/update_documentType" element={<UpdateDocumentType />} /> 
      <Route path="/document/delete_documentType" element={<DeleteDocumentType />} /> 




     
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);