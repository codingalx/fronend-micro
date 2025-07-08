

import React, { useState, startTransition, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from "react-router-dom";
import RoleProtectedRoute from './RoleProtectedRoute';
import EmployeeServiceResourceName from './Resource/EmployeeServiceResourceName';

const ViewEmployee = React.lazy(() => import('EmployeeService/ViewEmployee').catch(() => ({
  default: () => <div>Failed to load Employee View</div>
})));

const CreateSkill = React.lazy(() => import('EmployeeService/CreateSkill').catch(() => ({ 
  default: () => <div>Failed to load Create  Employee Employee </div> 
})));

const CreateTraining = React.lazy(() => import('EmployeeService/CreateTraining').catch(() => ({
  default: () => <div>Failed to load Create Training</div>
})));

const CreateLanguage = React.lazy(() => import('EmployeeService/CreateLanguage').catch(() => ({
  default: () => <div>Failed to load Create Language</div>
})));

const CreateFamily = React.lazy(() => import('EmployeeService/CreateFamily').catch(() => ({
  default: () => <div>Failed to load Create Family</div>
})));

const CreateReference = React.lazy(() => import('EmployeeService/CreateReference').catch(() => ({
  default: () => <div>Failed to load Create Reference</div>
})));

const CreateExperience = React.lazy(() => import('EmployeeService/CreateExperience').catch(() => ({
  default: () => <div>Failed to load Create Experience</div>
})));

const CreateAddress = React.lazy(() => import('EmployeeService/CreateAddress').catch(() => ({
  default: () => <div>Failed to load Create Address</div>
})));

const CreateEducation = React.lazy(() => import('EmployeeService/CreateEducation').catch(() => ({
  default: () => <div>Failed to load Create Education</div>
})));



const tabComponents = [
  { label: 'Personal', component: ViewEmployee, },
  { label: 'Skill', component: CreateSkill },
  
  { label: 'Training', component: CreateTraining },
  { label: 'Language', component: CreateLanguage },
  { label: 'Family', component: CreateFamily },
  { label: 'Reference', component: CreateReference},
  { label: 'Experience', component: CreateExperience},
  { label: 'Address', component: CreateAddress },
  { label: 'Education', component: CreateEducation},
  // Other tabs...
];

const Details = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    startTransition(() => {
      setActiveTab(newValue);
    });
  };

  const handleEmployeeCreated = (id) => {
    setEmployeeId(id);
    // Optionally switch to a specific tab if needed
    // setActiveTab(1); // Uncomment to switch to Skill tab upon creation
  };

  const { component: ActiveComponent, resource } = tabComponents[activeTab];

  return (
    <Box m="20px">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Employee information tabs"
        >
          {tabComponents.map((tab, index) => (
            <Tab 
              key={index} 
              label={tab.label} 
            />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute NorequiredResourceName={true}>
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent id={employeeId} onIdReceive={handleEmployeeCreated} />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default Details;