import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLogin from "./components/AppLogin";
import Dashboard from "./components/Dashboard";
import CreateTransfer from "./components/Transfer/CreateTransfer";
import EditTransfer from "./components/Transfer/EditTransfer";
import EditEmployeeTransfer from "./components/Transfer/EditEmployeeTransfer";
import DeleteTransfer from "./components/Transfer/DeleteTransfer";
import ListTransfer from "./components/Transfer/ListTransfer";
import CreateDirectAssignment from "./components/DirectAssignment/CreateDirectAssignment";
import EditDirectAssignment from "./components/DirectAssignment/EditDirectAssignment";
import DeleteDirectAssignment from "./components/DirectAssignment/DeleteDirectAssignment";
import ListDirectAssignment from "./components/DirectAssignment/ListDirectAssignment";
import EmployeeTransfers from "./components/Transfer/EmployeeTransfers"; // Import EmployeeTransfers
import "./App.css";
import MakeDecision from "./components/Transfer/MakeDecision"; // Corrected import path

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AppLogin />} />
      <Route path="/" element={<h1>Welcome to the Transfer Portal</h1>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/create-transfer"
        element={<CreateTransfer id="employee-id" />}
      />
      <Route path="/edit-transfer" element={<EditTransfer />} />
      <Route
        path="/edit-employee-transfer"
        element={<EditEmployeeTransfer />}
      />
      <Route path="/make-decision" element={<MakeDecision />} />
      <Route path="/delete-transfer" element={<DeleteTransfer />} />
      <Route
        path="/list-transfer"
        element={<ListTransfer employeeId="employee-id" refreshKey={0} />}
      />
      <Route
        path="/create-direct-assignment"
        element={<CreateDirectAssignment id="employee-id" />}
      />
      <Route
        path="/edit-direct-assignment"
        element={<EditDirectAssignment />}
      />
      <Route
        path="/delete-direct-assignment"
        element={<DeleteDirectAssignment />}
      />
      <Route
        path="/list-direct-assignment"
        element={
          <ListDirectAssignment employeeId="employee-id" refreshKey={0} />
        }
      />
      <Route
        path="/employee-transfers"
        element={<EmployeeTransfers employeeId="employee-id" />} 
      />
    </Routes>
  );
}

export default App;
