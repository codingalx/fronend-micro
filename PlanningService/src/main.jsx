import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AppLogin from "./components/Security/AppLogin";
import AppLogout from "./components/Security/AppLogout";
import CreatePlanning from "./components/CreatePlanning";
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));
import CreateNeedRequest from "./components/NeedRequest/CreateNeedRequest";
import ListNeedRequest from "./components/NeedRequest/ListNeedRequest";
import EditNeedRequest from './components/NeedRequest/EditNeedRequest'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> {/* Login route */}
        <Route path="/logout" element={<AppLogout />} /> {/* Login route */} 
        <Route path="/planning" element={<CreatePlanning />} /> {/* Login route */} 
        <Route path="/needrequest" element={< CreateNeedRequest/>} /> {/* Login route */} 
        <Route path="/list_needrequest" element={< ListNeedRequest/>} /> {/* Login route */} 
        <Route path="/_needrequest" element={< EditNeedRequest/>} /> {/* Login route */} 

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