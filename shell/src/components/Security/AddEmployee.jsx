
import React, { useState, startTransition } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import EmployeeServiceResourceName from './Resource/EmployeeServiceResourceName';
import { useNavigate } from "react-router-dom";
import RoleProtectedRoute from './RoleProtectedRoute';
import { Suspense } from 'react';

const CreateEmployee = React.lazy(() => import('EmployeeService/CreateEmployee').catch(() => ({ 
  default: () => <div>Failed to load Create Employee</div> 
})));

const CreateAddress = React.lazy(() => import('EmployeeService/CreateAddress').catch(() => ({ 
  default: () => <div>Failed to load Create Employee Address</div> 
})));

const CreateEducation = React.lazy(() => import('EmployeeService/CreateEducation').catch(() => ({ 
  default: () => <div>Failed to load Create Education</div> 
})));


const CreateSkill = React.lazy(() => import('EmployeeService/CreateSkill').catch(() => ({ 
  default: () => <div>Failed to load Create Skill</div> 
})));

const CreateTraining = React.lazy(() => import('EmployeeService/CreateTraining').catch(() => ({ 
  default: () => <div>Failed to load Create Training </div> 
})));

const CreateFamily = React.lazy(() => import('EmployeeService/CreateFamily').catch(() => ({ 
  default: () => <div>Failed to load Create Family </div> 
})));

const CreateReference = React.lazy(() => import('EmployeeService/CreateReference').catch(() => ({ 
  default: () => <div>Failed to load Create refernce </div> 
})));

const CreateLanguage = React.lazy(() => import('EmployeeService/CreateLanguage').catch(() => ({ 
  default: () => <div>Failed to load Create Langugae </div> 
})));

const CreateExperience = React.lazy(() => import('EmployeeService/CreateExperience').catch(() => ({ 
  default: () => <div>Failed to load Create Experience </div> 
})));

const tabComponents = [
  { label: 'Personal', component: CreateEmployee, resource: EmployeeServiceResourceName.ADD_EMPLOYEE },
  { label: 'Address', component: CreateAddress, resource: EmployeeServiceResourceName.ADD_ADDRESS },

  { label: 'Education', component: CreateEducation, resource: EmployeeServiceResourceName.ADD_EDUCATION },

  { label: 'Skill', component: CreateSkill, resource: EmployeeServiceResourceName.ADD_SKILL },
  
  { label: 'Training', component: CreateTraining, resource: EmployeeServiceResourceName.ADD_TRAINING },

  { label: 'Family', component: CreateFamily, resource: EmployeeServiceResourceName.ADD_FAMILY },

  { label: 'Reference', component: CreateReference, resource: EmployeeServiceResourceName.ADD_REFERENCE },

  { label: 'Language', component:   CreateLanguage  , resource: EmployeeServiceResourceName.ADD_LANGUAGE },

  { label: 'Experience', component:   CreateExperience  , resource: EmployeeServiceResourceName.ADD_EXPERIENCE },

];

const AddEmployee = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [employeeId, setEmployeeId] = useState(null); 
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    if (employeeId || newValue === 0) {
      startTransition(() => {
        setActiveTab(newValue);
      });
    }
  };

  const handleEmployeeCreated = (id) => {
    setEmployeeId(id); 
  };

  const handleIconClick = () => {
    navigate(`/employee/list`);
  };

  const refreshPage = () => {
    window.location.reload();
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
              disabled={!employeeId && index !== 0} 
            />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="employee">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent id={employeeId} onEmployeeCreated={handleEmployeeCreated} />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default AddEmployee;










// import React, { useState } from 'react';
// import { Box, Tabs, Tab } from '@mui/material';
// import EmployeeServiceResourceName from './Resource/EmployeeServiceResourceName';
// // import ToolbarComponent from '../common/ToolbarComponent';
// import { useNavigate } from "react-router-dom";
// import RoleProtectedRoute from './RoleProtectedRoute';

// const CreateEmployee = React.lazy(() => import('EmployeeService/CreateEmployee').catch(() => ({ 
//   default: () => <div>Failed to load  Create Employee</div> 
// })));

// const CreateAddress = React.lazy(() => import('EmployeeService/CreateAddress').catch(() => ({ 
//   default: () => <div>Failed to load  Create Employee Address</div> 
// })));

// const CreateEducation = React.lazy(() => import('EmployeeService/CreateEducation').catch(() => ({ 
//   default: () => <div>Failed to load  Creaete Education </div> 
// })));



// const tabComponents = [
//   { label: 'Personal', component: CreateEmployee, resource: EmployeeServiceResourceName.ADD_EMPLOYEE },

//   // { label: 'Skill', component: CreateSkillofEmployee, resource: EmployeeServiceResourceName.GET_ALL_SKILLS },

//   // { label: 'Training', component: CreateTraining, resource: EmployeeServiceResourceName.ADD_TRAINING },
//   // { label: 'Language', component: CreateLanguage, resource: EmployeeServiceResourceName.ADD_LANGUAGE },
//   // { label: 'Family', component: CreateFamily, resource: EmployeeServiceResourceName.ADD_FAMILY },
//   // { label: 'Reference', component: CreateReference, resource: EmployeeServiceResourceName.ADD_REFERENCE },
//   // { label: 'Experience', component: CreateExperience, resource: EmployeeServiceResourceName.ADD_EXPERIENCE },
//   { label: 'Address', component: CreateAddress, resource: EmployeeServiceResourceName.ADD_ADDRESS },
//   { label: 'Education', component: CreateEducation, resource: EmployeeServiceResourceName.ADD_EDUCATION },
// ];

// const AddEmployee = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [employeeId, setEmployeeId] = useState(null); 
//   const navigate = useNavigate();


//   const handleTabChange = (event, newValue) => {
//     if (employeeId || newValue === 0) {
//       setActiveTab(newValue);
//     }
//   };

//   const handleEmployeeCreated = (id) => {
//     setEmployeeId(id); 
//   };
//   const handleIconClick = () => {
//     navigate(`/employee/list`);
//   };

//   const refreshPage = () => {
//     window.location.reload();
//   };

//   const { component: ActiveComponent, resource } = tabComponents[activeTab];

//   return (
//     <Box m="20px">
//       {/* <Header subtitle="Add New Employee" />
//      <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} refreshPage={refreshPage} /> */}
//       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//         <Tabs
//           value={activeTab}
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           aria-label="Employee information tabs"
//         >
//           {tabComponents.map((tab, index) => (
//             <Tab 
//               key={index} 
//               label={tab.label} 
//               disabled={!employeeId && index !== 0} 
//             />
//           ))}
//         </Tabs>
//       </Box>
//       <Box p={3}>
//         <RoleProtectedRoute requiredResourceName={resource}   apiName="employee"  >
//           <ActiveComponent id={employeeId} onEmployeeCreated={handleEmployeeCreated} />
//         </RoleProtectedRoute>

//       </Box>
//     </Box>
//   );
// };

// export default AddEmployee;
