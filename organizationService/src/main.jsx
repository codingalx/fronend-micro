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
import CreateFieldstudy from './components/fieldStudy/CreateFieldstudy'
import UpdateFieldStudy from './components/fieldStudy/UpdateFieldStudy'
import DeleteFieldstudy from "./components/fieldStudy/DeleteFieldstudy";






const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> 
        <Route path="/logout" element={<AppLogout />} /> 
        <Route path="/field_study" element={<CreateFieldstudy />} /> 
        <Route path="/update_field_study" element={<UpdateFieldStudy />} /> 
        <Route path="/delete__field_study" element={<DeleteFieldstudy />} /> 


        
    
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