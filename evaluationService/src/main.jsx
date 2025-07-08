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
import UpdateResult from "./components/result/UpdateResult";
import DeleteResult from "./components/result/DeleteResult";
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));
import CreateCategory from "./components/category/CreateCategory";
import UpdateCategory from "./components/category/UpdateCategory";
import DeleteCategory from "./components/category/DeleteCategory";

import CreateCriterial from "./components/criterial/CreateCriterial";
import UpdateCriterial from "./components/criterial/UpdateCriterial";
import DeleteCriterial from "./components/criterial/DeleteCriterial";

import CreateSession from "./components/session/CreateSession";
import UpdateSession from "./components/session/UpdateSession";
import DeleteSession from "./components/session/DeleteSession";

import CreateLevel from "./components/levels/CreateLevel";
import DeleteLevel from "./components/levels/DeleteLevel";
import UpdateLevel from "./components/levels/UpdateLevel";
import CreateResult from "./components/result/CreateResult";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<AppLogin />} /> 
        <Route path="/logout" element={<AppLogout />} /> 
        <Route path="/evaluation/category" element={<CreateCategory />} /> 
        <Route path="/evaluation/update_category" element={<UpdateCategory />} /> 
        <Route path="/evaluation/delete_category" element={<DeleteCategory />} /> 

        <Route path="/evaluation/criterial" element={<CreateCriterial />} /> 
        <Route path="/evaluation/update_criterial" element={<UpdateCriterial />} /> 
        <Route path="/evaluation/delete_criterial" element={<DeleteCriterial />} />

        <Route path="/evaluation/session" element={<CreateSession />} /> 
        <Route path="/evaluation/update_session" element={<UpdateSession />} /> 
        <Route path="/evaluation/delete_session" element={<DeleteSession />} /> 

        <Route path="/evaluation/result" element={<CreateResult />} /> 





        


        <Route path="/evaluation/level" element={<CreateLevel />} /> 
        <Route path="/evaluation/update_level" element={<UpdateLevel />} /> 
        <Route path="/evaluation/delete_level" element={<DeleteLevel />} /> 



        


        



        <Route path="/evaluation/update_result" element={<UpdateResult />} /> 
        <Route path="/evaluation/delete_result" element={<DeleteResult />} /> 



       
        

 


        
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