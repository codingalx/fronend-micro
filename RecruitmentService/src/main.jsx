import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import AppLogin from "./components/Security/AppLogin";
import AppLogout from "./components/Security/AppLogout";
import CreateNewEmployee from "./components/CreateNewEmployee";
import CreateRecruitment from "./components/Recruitment/CreateRecruitment";
import ListRecruitment from "./components/Recruitment/ListRecruitment";
import DeleteRecruitment from "./components/Recruitment/DeleteRecruitment";
import { IdProvider } from "./components/Recruitment/IdContext";
import EditRecruitment from "./components/Recruitment/EditRecruitment";
import EditRecruitmentbyapprove from "./components/Recruitment/EditRecruitmentbyapprove";
import CreateMediaType from "./components/MediaType/CreateMediaType";
import ListMediaType from "./components/MediaType/ListMediaType";
import DeleteMediaType from "./components/MediaType/DeleteMediaType";
import UpdateMediaType from "./components/MediaType/UpdateMediaType";
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
        <Route path="/login" element={<AppLogin />} /> 
        <Route path="/logout" element={<AppLogout />} /> 
        <Route path="/create" element={<CreateNewEmployee />} /> 
        <Route path="/addRecruitment" element={<CreateRecruitment />} /> 
        <Route path="/lisRecruitment" element={<ListRecruitment />} /> 
        <Route path="/deleteRecruitment" element={<DeleteRecruitment />} /> 
        <Route path="/recruitment/edit" element={<EditRecruitment />} /> 
        <Route path="/approvance" element={<EditRecruitmentbyapprove />} /> 
        <Route path="/ListMedialtype" element={<ListMediaType />} />

        <Route path="/mediaType" element={<CreateMediaType />} />



                <Route path="/ListMedialtype" element={<ListMediaType />} /> 
                <Route path="/recruitment/delete_media_type" element={<DeleteMediaType />} /> 

                <Route path="/recruitment/update_media_type" element={<UpdateMediaType />} /> 


 

               


        

        <Route path="recruitment/">
          <Route
        
          >
            <Route path="create" element={<CreateRecruitment />} />
          </Route>
          

          <Route
           
          >
            <Route path="list" element={<ListRecruitment />} />
          </Route> 

          <Route
           
    
          >
            <Route path="delete" element={<DeleteRecruitment />} />
          </Route>
          


        </Route>
               
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