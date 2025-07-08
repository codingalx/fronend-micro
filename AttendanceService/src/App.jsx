import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLogin from "./components/AppLogin";
import CreateShift from './components/Shift/CreateShift';
import ListShifts from './components/Shift/ListShifts';
import UpdateShift from './components/Shift/UpdateShift';
import DeleteShift from './components/Shift/DeleteShift';
import CreateWeekend from './components/Weekend/CreateWeekend';
import UpdateWeekend from './components/Weekend/UpdateWeekend';
import DeleteWeekend from './components/Weekend/DeleteWeekend';
import CreateOverTime from './components/OverTime/CreateOverTime';
import ListOverTime from './components/OverTime/ListOverTime';
import UpdateOverTime from './components/OverTime/UpdateOverTime';
import DeleteOverTime from './components/OverTime/DeleteOverTime';
import CreateTimeTolerance from './components/TimeTolerance/CreateTimeTolerance';
import UpdateTimeTolerance from './components/TimeTolerance/UpdateTimeTolerance';
import DeleteTimeTolerance from './components/TimeTolerance/DeleteTimeTolerance';
import CreateExcuse from './components/Excuse/CreateExcuse';
import UpdateExcuse from './components/Excuse/UpdateExcuse';
import DeleteExcuse from './components/Excuse/DeleteExcuse';
import CreateAttendanceLog from './components/AttendanceLog/CreateAttendanceLog';
import CreateAttendanceResult from './components/AttendaceResult/CreateAttendanceResult';
import AttendanceApproval from './components/AttendaceResult/AttendanceApproval';
import HrApproval from './components/AttendaceResult/HrApproval';
import EmployeeAttendanceView from './components/AttendaceResult/EmployeeAttendanceView';
const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<AppLogin />} />
      <Route path="/create-shift" element={<CreateShift />} />
      <Route path="/list-shifts" element={<ListShifts />} />
      <Route path="/updateshift" element={<UpdateShift />} />
      <Route path="/deleteshift" element={<DeleteShift />} />
      
      <Route path="/create-weekend" element={<CreateWeekend />} />

      <Route path="/update-weekend" element={<UpdateWeekend />} />
      <Route path="/attendance/delete-weekend" element={<DeleteWeekend />} />
      <Route path="/create-overtime" element={<CreateOverTime />} />
      <Route path="/list-overtime" element={<ListOverTime />} />

      <Route path="/update-overtime" element={<UpdateOverTime />} />
      <Route path="/delete-overtime" element={<DeleteOverTime />} />
      
      <Route path="/create-time-tolerance" element={<CreateTimeTolerance />} />
      <Route path='/update-time-tolerance' element={<UpdateTimeTolerance />}/>
      <Route path='/delete-time-tolerance' element={<DeleteTimeTolerance />}/>
      <Route path='/create-excuse' element={<CreateExcuse />}/>
      <Route path='/update-excuse' element={<UpdateExcuse />}/>
      <Route path='/delete-excuse' element={<DeleteExcuse />}/>
      <Route path='/create-attendance-log' element={<CreateAttendanceLog />}/>
      <Route path='/create-attendance-result' element={<CreateAttendanceResult />}/>
      <Route path='/attendance-approval' element={<AttendanceApproval />}/>
      <Route path='/hr-aproval' element={<HrApproval/>}/>

      <Route path='/employee-attendance' element={<EmployeeAttendanceView/>}/>


      




      {/* Add more routes as needed */}


    
      </Routes>
      </Router>
  )
}

export default App
