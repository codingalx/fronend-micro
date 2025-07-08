import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App"; // Ensure you have the main App component
import CreateCountry from "./components/Country/CreateCountry";
import ListCountry from "./components/Country/ListCountry";
import DeleteCountry from "./components/Country/DeleteCountry";
import UpdateCountry from "./components/Country/UpdateCountry";

import CreateDutyStation from "./components/DutyStation/CreateDutyStation";
import ListDutyStation from "./components/DutyStation/ListDutyStation";
import DeleteDutyStation from "./components/DutyStation/DeleteDutyStation";
import UpdateDutyStation from "./components/DutyStation/UpdateDutyStation";

import CreateTitleName from "./components/TitleName/CreateTitleName";
import ListTitleName from "./components/TitleName/ListTitleName";
import DeleteTitleName from "./components/TitleName/DeleteTitleName";
import UpdateTitleName from "./components/TitleName/UpdateTitleName";

import AppLogin from "./components/AppLogin";
import UpdateLanguageName from "./components/LanguageName/UpdateLanguageName";
import DeleteLanguageName from "./components/LanguageName/DeleteLanguageName";
import ListLanguageName from "./components/LanguageName/ListLanguageName";
import CreateLangugaeName from "./components/LanguageName/CreateLangugaeName";
import AppLogout from "./components/AppLogout";
import ListEmployee from "./components/Employee/ListEmployee";
import CreateEmployee from "./components/Employee/CreateEmployee";
import DeleteEmployee from "./components/Employee/DeleteEmployee";
import EditEmployee from "./components/Employee/EditEmployee";
import CreateAddress from "./components/Address/CreateAddress";
import ListAddress from "./components/Address/ListAddress";
import DeleteAddress from "./components/Address/DeleteAddress";
import EditAddress from "./components/Address/EditAddress";
import CreateEducation from "./components/Education/CreateEducation";
import ListEducation from "./components/Education/ListEducation";
import DeleteEducation from "./components/Education/DeleteEducation";
import EditEducation from "./components/Education/EditEducation";
import CreateSkill from "./components/Skill/CreateSkill";
import ListSkill from "./components/Skill/ListSkill";
import DeleteSkill from "./components/Skill/DeleteSkill";
import EditSkill from "./components/Skill/EditSkill";
import CreateFamily from "./components/Family/CreateFamily";
import CreateLanguage from "./components/Language/CreateLanguage";

const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>

        <Route path="/login" element={<AppLogin />} /> {/* Login route */}
        <Route path="/logout" element={<AppLogout />} /> {/* Login route */}


        <Route path="employee">
        <Route path="list" element={<ListEmployee />} />
        <Route path="add" element={<CreateEmployee />} />
        <Route path="delete" element={<DeleteEmployee />} />
        <Route path="edit" element={<EditEmployee />} />





          <Route path="country" element={<CreateCountry />} />
          <Route path="list_country" element={<ListCountry />} />
          <Route path="delete_country" element={<DeleteCountry />} />
          <Route path="update_country" element={<UpdateCountry />} />
          
          <Route path="duty_station" element={<CreateDutyStation />} />
          <Route path="list_dutyStation" element={<ListDutyStation />} />
          <Route path="delete_dutyStation" element={<DeleteDutyStation />} />
          <Route path="update_dutyStation" element={<UpdateDutyStation />} /> 

          <Route path="title_name" element={<CreateTitleName />} />
          <Route path="list_titlename" element={<ListTitleName />} />
          <Route path="delete_titlename" element={<DeleteTitleName />} />
          <Route path="update_titlename" element={<UpdateTitleName />} /> 


          <Route path="language_name" element={<CreateLangugaeName />} />
          <Route path="list_languagename" element={<ListLanguageName />} />
          <Route path="delete_languagename" element={<DeleteLanguageName />} />
          <Route path="update_languagename" element={<UpdateLanguageName />} /> 


          <Route path="address" element={<CreateAddress />} />
          <Route path="list_address" element={<ListAddress />} />
          <Route path="delete_address" element={<DeleteAddress />} />
          <Route path="update_address" element={<EditAddress />} /> 

          <Route path="education" element={<CreateEducation />} />
          <Route path="list_education" element={<ListEducation />} />
          <Route path="delete_education" element={<DeleteEducation />} />
          <Route path="update_education" element={<EditEducation />} /> 


          <Route path="skill" element={<CreateSkill />} />
          <Route path="list_skill" element={<ListSkill />} />
          <Route path="delete_skill" element={<DeleteSkill />} />
          <Route path="update_skill" element={<EditSkill />} /> 

          <Route path="family" element={<CreateFamily />} /> 
          <Route path="language" element={<CreateLanguage />} /> 



        </Route>
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