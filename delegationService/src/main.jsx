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
import CreateDelegation from "./components/delegation/CreateDelegation";
import UpdateDelegation from "./components/delegation/UpdateDelegation";
import DeleteDelegation from "./components/delegation/DeleteDelegation";
import TerminateDelegation from "./components/delegation/TerminateDelegation";
import ListDelegation from "./components/delegation/ListDelegation";
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> 
        <Route path="/logout" element={<AppLogout />} /> 
        <Route path="/delegation" element={<CreateDelegation />} /> 
        <Route path="/delegation/update" element={<UpdateDelegation />} /> 
        <Route path="/delegation/delete" element={<DeleteDelegation />} /> 
        <Route path="/delegation/terminate" element={<TerminateDelegation />} /> 
        <Route path="/delegation/list" element={<ListDelegation />} /> 




        


        
    
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