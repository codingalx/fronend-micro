import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateComplaintType from "./components/ComplaintType/CreateComplaintType";
import ListComplaintType from "./components/ComplaintType/ListComplaintType";
import UpdateComplaintType from "./components/ComplaintType/UpdateComplaintType";
import DeleteComplaintType from "./components/ComplaintType/DeleteComplaintType";
import CreateComplaint from "./components/Complaint/CreateComplaint";
import ListComplaint from "./components/Complaint/ListComplaint";
import UpdateComplaint from "./components/Complaint/UpdateComplaint";
import DeleteComplaint from "./components/Complaint/DeleteComplaint";
import ListComplaintByEmployee from "./components/Complaint/ListComplaintByEmployee";
import CreateComplaintHandling from "./components/ComplaintHandling/CreateComplaintHandling";
import ListComplaintHandlingsByDepartment from "./components/ComplaintHandling/ListComplaintHandlingsByDepartment";
import UpdateComplaintHandlingDecision from "./components/ComplaintHandling/UpdateComplaintHandlingDecision";
import CreateComplaintHandlingRejected from "./components/ComplaintHandling/CreateComplaintHandlingRejected";
import DeleteComplaintHandling from "./components/ComplaintHandling/DeleteComplaintHandling";
import ListAttachments from "./components/Attachments/ListAttachments";
import DeleteAttachment from "./components/Attachments/DeleteAttachment";
import Dashboard from "./components/Dashboard";
import AppLogin from "./components/AppLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AppLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Complaint Type Routes */}
        <Route
          path="/create-complaint-type"
          element={<CreateComplaintType />}
        />
        <Route path="/list-complaint-types" element={<ListComplaintType />} />
        <Route
          path="/update-complaint-type"
          element={<UpdateComplaintType />}
        />
        <Route
          path="/delete-complaint-type"
          element={<DeleteComplaintType />}
        />

        {/* Complaint Routes */}
        <Route path="/create-complaint" element={<CreateComplaint />} />
        <Route path="/list-complaints" element={<ListComplaint />} />
        <Route path="/update-complaint" element={<UpdateComplaint />} />
        <Route path="/delete-complaint" element={<DeleteComplaint />} />
        
        <Route
          path="/list-complaint-by-employee"
          element={<ListComplaintByEmployee />}
        />

        {/* Complaint Handling Routes */}
        
        <Route
          path="/create-complaint-handling"
          element={<CreateComplaintHandling />}
        />
        <Route
          path="/list-complaint-handlings-by-department"
          element={<ListComplaintHandlingsByDepartment />}
        />
        <Route
          path="/update-complaint-handling-decision"
          element={<UpdateComplaintHandlingDecision />}
        />
        <Route
          path="/create-complaint-handling-rejected"
          element={<CreateComplaintHandlingRejected />}
        />
        <Route
          path="/delete-complaint-handling"
          element={<DeleteComplaintHandling />}
        />

        {/* Attachments Routes */}
        <Route path="/attachments-list" element={<ListAttachments />} />
        <Route path="/delete-attachment" element={<DeleteAttachment />} />
      </Routes>
    </Router>
  );
}

export default App;
