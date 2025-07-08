import React, { createContext, useContext, useState, useEffect } from 'react';
import { getResourceByName,listEmployeeData, getResourceEmployeeByName, listAssessment  } from '../../../configuration/RecruitmentApp';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const IdContext = createContext();

export const useIds = () => {
  return useContext(IdContext);
};

export const IdProvider = ({ children, isLoggedIn }) => {
  const [employeeIdMap, setEmployeeIdMap] = useState({});
  const [employeeIds, setEmployeeIds] = useState([]);
  const [assessmentWeightIds, setAssessmentWeightIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId

  useEffect(() => {

    const fetchIds = async () => {
      if (!tenantId) {
        return false; // Exit early if tenantId is missing
      }
      const resourceResponse = await getResourceEmployeeByName("Get All Employees" );
      const resourceResponseTwo = await getResourceByName("Get All Assessment Weights" );


      const resource = resourceResponse.data;
      const resourceTwo = resourceResponseTwo.data;

  
      // Check if the resource is active
      if (resource.status !== "ACTIVE" || resourceTwo.status !== "ACTIVE") {
        return false;
      }

      setLoading(true);
      setError(null);
      
       

      try {
        const employeeResponse = await listEmployeeData(tenantId);

        if (!employeeResponse.data) {
          throw new Error('No data received from employees');
        }

        const employeeIds = employeeResponse.data.map(item => item.employeeId);
        setEmployeeIds(employeeIds);

        const employeeIdMap = {};
        employeeResponse.data.forEach(item => {
          employeeIdMap[item.employeeId] = item.id;
        });
        setEmployeeIdMap(employeeIdMap);

        const assessmentResponse = await listAssessment(tenantId);

        if (!assessmentResponse.data) {
          throw new Error('No data received from assessments');
        }

        const assessmentWeightIds = assessmentResponse.data.map(item => item.id);
        setAssessmentWeightIds(assessmentWeightIds);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoggedIn) {
      fetchIds();
    }
  }, [isLoggedIn, tenantId]);

  return (
    <IdContext.Provider value={{ employeeIdMap, employeeIds, assessmentWeightIds, loading, error }}>
      {children}
    </IdContext.Provider>
  );
};
