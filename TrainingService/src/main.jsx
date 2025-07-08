import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { IdProvider } from "./context/IdContext";
import AppLogin from "./components/AppLogin";
import AppLogout from "./components/AppLogout";
import ListCourseCategory from "./components/TrainingCategory/ListCourseCategory";
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> 
        <Route path="/logout" element={<AppLogout />} /> 
        <Route path="training/listcoursecategory" element={<ListCourseCategory />} /> 

 
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
 <IdProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </IdProvider>
  </React.StrictMode>
);