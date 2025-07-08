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
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));
import AddNewUser from "./components/User/AddNewuser";




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> {/* Login route */}
        <Route path="/logout" element={<AppLogout />} /> {/* Login route */} 
        <Route path="/user_manage" element={<AddNewUser />} /> {/* Login route */} 
      

      

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