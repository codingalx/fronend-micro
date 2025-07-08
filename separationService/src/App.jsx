import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import { Typography } from "@mui/material";
import CreateTermination from "./components/Termination/CreateTermination";
import ListTermination from "./components/Termination/ListTermination";
import CreateTerminationType from "./components/TerminationType/CreateTerminationType";
import ListTerminationType from "./components/TerminationType/ListTerminationType";
import CreateRetirement from "./components/Retirement/CreateRetirement";
import ListRetirement from "./components/Retirement/ListRetirement";
import CreateExitInterview from "./components/ExitInterview/CreateExitInterview";
import ListExitInterview from "./components/ExitInterview/ListExitInterview";
import ListClearance from "./components/Clearance/ListClearance";
import CreateClearanceDepartment from "./components/ClearanceDepartment/CreateClearanceDepartment";
import ListClearanceDepartment from "./components/ClearanceDepartment/ListClearanceDepartment";
import ApproveTermination from "./components/Termination/ApproveTermination";
import UpdateTermination from "./components/Termination/UpdateTermination";
import DeleteTermination from "./components/Termination/DeleteTermination";
import UpdateTerminationType from "./components/TerminationType/UpdateTerminationType";
import DeleteTerminationType from "./components/TerminationType/DeleteTerminationType";
import UpdateRetirement from "./components/Retirement/UpdateRetirement";
import DeleteRetirement from "./components/Retirement/DeleteRetirement";
import AppLogin from "./components/AppLogin";
import DeleteExitInterview from "./components/ExitInterview/DeleteExitInterview";
import UpdateExitInterview from "./components/ExitInterview/UpdateExitInterview";
import ApproveRetirement from "./components/Retirement/ApproveRetirement";
import UpdateClearanceDepartment from "./components/ClearanceDepartment/UpdateClearanceDepartment";
import DeleteClearanceDepartment from "./components/ClearanceDepartment/DeleteClearanceDepartment";
import CreateClearanceRetirement from "./components/Clearance/CreateClearanceRetirement";
import CreateClearanceTermination from "./components/Clearance/CreateClearanceTermination";
import CreateClearance from "./components/Clearance/CreateClearance";
import UpdateClearance from "./components/Clearance/UpdateClearance";
import DeleteClearance from "./components/Clearance/DeleteClearance";
import ListRetirementUser from "./components/Retirement/ListRetirementUser";
import ListTerminationUser from "./components/Termination/ListTerminationUser";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/login" element={<AppLogin />} />
        

            {/* Termination Routes */}
          <Route path="/create-termination" element={<CreateTermination />} />
          <Route path="/list-termination-user" element={<ListTerminationUser />} />

          <Route path="/list-termination" element={<ListTermination />} />
          <Route path="/approve-termination" element={<ApproveTermination />} />
          <Route path="/update-termination" element={<UpdateTermination />} />
          <Route path="/delete-termination" element={<DeleteTermination />} />

          {/* Termination Type Routes */}
          <Route path="/create-termination-type" element={<CreateTerminationType />} />
          <Route path="/list-termination-type" element={<ListTerminationType />} />
          <Route path="/update-termination-type" element={<UpdateTerminationType />} />
          <Route path="/delete-termination-type" element={<DeleteTerminationType />} />

          {/* Retirement Routes */}
          <Route path="/create-retirement" element={<CreateRetirement />} />
          <Route path="/list-retirement" element={<ListRetirement />} />
          <Route path="/approve-retirement" element={<ApproveRetirement />} />
          <Route path="/update-retirement" element={<UpdateRetirement />} />
          <Route path="/delete-retirement" element={<DeleteRetirement />} />
          <Route path="/list-retirement-user" element={<ListRetirementUser />} />

          

          {/* Exit Interview Routes */}
          <Route path="/create-exit-interview" element={<CreateExitInterview />} />
          <Route path="/list-exit-interview" element={<ListExitInterview />} />
          <Route path="/update-exit-interview" element={<UpdateExitInterview />} />
          <Route path="/delete-exit-interview" element={<DeleteExitInterview />} />

          {/* Clearance Routes */}
          <Route path="/create-clearance" element={<CreateClearance />} />
          <Route path="/list-clearance" element={<ListClearance />} />
          <Route path="/update-clearance" element={<UpdateClearance />} />
          <Route path="/delete-clearance" element={<DeleteClearance />} />
          <Route path="/create-clearance-retirement" element={<CreateClearanceRetirement />} />
          <Route path="/create-clearance-termination" element={<CreateClearanceTermination />} />

          {/* Clearance Department Routes */}
          <Route path="/create-clearance-department" element={<CreateClearanceDepartment />} />
          <Route path="/list-clearance-department" element={<ListClearanceDepartment />} />
          <Route path="/update-clearance-department" element={<UpdateClearanceDepartment />} />
          <Route path="/delete-clearance-department" element={<DeleteClearanceDepartment />} />

      

      </Routes>
    </Router>
  );
}

export default App;