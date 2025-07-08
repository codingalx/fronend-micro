import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import { Typography } from "@mui/material";
import CreatePenalty from "./components/Penalty/CreatePenalty";
import AppLogin from "./components/AppLogin";
import ListPenalty from "./components/Penalty/ListPenalty";
import UpdatePenalty from "./components/Penalty/UpdatePenalty";
import DeletePenalty from "./components/Penalty/DeletePenalty";
import CreateOffense from "./components/Offense/CreateOffense";
import UpdateOffense from "./components/Offense/UpdateOffense";
import ListOffense from "./components/Offense/ListOffense";
import DeleteOffense from "./components/Offense/DeleteOffense";
import CreateDiscipline from "./components/Discipline/CreateDiscipline";
import ListDiscipline from "./components/Discipline/ListDiscipline";
import UpdateDiscipline from "./components/Discipline/UpdateDiscipline";
import DeleteDiscipline from "./components/Discipline/DeleteDiscipline";
import ApproveDiscipline from "./components/Discipline/ApproveDiscipline";
import ListDisciplineUser from "./components/Discipline/ListDisciplineUSer";
import CreateAppeal from "./components/Appeal/CreateAppeal";
import ListAppeal from "./components/Appeal/ListAppeal";
import DeleteAppeal from "./components/Appeal/DeleteAppeal";
import UpdateAppeal from "./components/Appeal/UpdateAppeal";
import ListDisciplineForUser from "./components/Discipline/ListDisciplineForUser";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/login" element={<AppLogin />} />
        

            {/* Termination Routes */}
          <Route path="/create-penalty" element={<CreatePenalty />} />
          <Route path="/update-penalty" element={<UpdatePenalty />} />
          <Route path="/list-penalty" element={<ListPenalty />} />
          <Route path="/delete-penalty" element={<DeletePenalty />} />

          <Route path="discipline/create-offense" element={<CreateOffense />} />
          <Route path="discipline/update-offense" element={<UpdateOffense />} />
          <Route path="discipline/list-offense" element={<ListOffense />} />
          <Route path="discipline/delete-offense" element={<DeleteOffense />} />

          
          <Route path="/create-discipline" element={<CreateDiscipline />} />
          <Route path="/update-discipline" element={<UpdateDiscipline />} />
          <Route path="/list-discipline" element={<ListDiscipline />} />
          <Route path="/delete-discipline" element={<DeleteDiscipline />} />
          <Route path="/approve-discipline" element={<ApproveDiscipline />} />
          <Route path="/list-discipline-user" element={<ListDisciplineUser />} />
          <Route path="/list-discipline-for-user" element={<ListDisciplineForUser />} />

          <Route path="/create-appeal" element={<CreateAppeal />} />
          <Route path="/list-appeal" element={<ListAppeal />} />
          <Route path="/delete-appeal" element={<DeleteAppeal />} /> 
          <Route path="/update-appeal" element={<UpdateAppeal/>} />
          
          
          </Routes>
    </Router>
  );
}

export default App;