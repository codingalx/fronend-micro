import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  
  Box,
} from "@mui/material";
import Header from "../Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  fetchAllPromoteCandidate,
  fetchAllPayGrade,
  getEmployeeByEmployeId,
} from "../../Api/ApiPromo";



const ListPromoteCandidate = ({ refreshKey }) => {
  const [promoteCandidates, setPromoteCandidates] = useState([]);
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId;
  

  useEffect(() => {
   

    loadPromoteCandidates();
  }, [ refreshKey]); 

  const loadPromoteCandidates = async () => {
    try {
      const promoteResponse = await fetchAllPromoteCandidate(tenantId);
      const promoteCandidatesData = promoteResponse.data;

      const payGradeResponse = await fetchAllPayGrade(tenantId);
      const payGradeData = payGradeResponse.data;

      const enrichedData = await Promise.all(
        promoteCandidatesData.map(async (candidate) => {
          const employeeId = candidate.candidate.employeeId;
          const employeeResponse = await getEmployeeByEmployeId(tenantId, employeeId);
          const employeeData = employeeResponse.data;

          const payGrade = payGradeData.find((pg) => pg.id === candidate.payGradeId);

          const fullName = `${employeeData.firstName || ""} ${
            employeeData.middleName || ""
          } ${employeeData.lastName || ""}`.trim();

          return {
            id: candidate.id,
            candidateName: fullName,
            salaryStep: payGrade ? payGrade.salaryStep : "Unknown",
            employeeId: employeeId, // Add employeeId for reference
          };
        })
      );

      setPromoteCandidates(enrichedData);
    } catch (error) {
      console.error("Error fetching promoted candidates:", error);
      
    } 
  };

  const columns = [
    { field: "candidateName", headerName: "Candidate Name", flex: 0.4,   },
    { field: "salaryStep", headerName: "Salary Step", flex: 0.1 },
  ];

 

  return (
     <Box m="20px">
        <Header  subtitle="List of promoted candidates" />
        <Box 
          m="40px 0 0 0" 
          height="75vh"
          
        >
            <DataGrid
              rows={promoteCandidates}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              autoHeight
            />
          </Box>
      
      
    
    </Box>
    );
  
};

export default ListPromoteCandidate;