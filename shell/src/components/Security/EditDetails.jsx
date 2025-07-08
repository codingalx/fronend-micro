import React, { useState, useEffect, startTransition, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import RoleProtectedRoute from './RoleProtectedRoute';
import EmployeeServiceResourceName from './Resource/EmployeeServiceResourceName';

const CreateEducation = React.lazy(() => import('EmployeeService/CreateEducation').catch(() => ({ 
  default: () => <div>Failed to load Create Education</div> 
})));

const EditEmployee = React.lazy(() => import('EmployeeService/EditEmployee').catch(() => ({ 
  default: () => <div>Failed to load Edit Employee</div> 
})));

const CreateAddress = React.lazy(() => import('EmployeeService/CreateAddress').catch(() => ({ 
  default: () => <div>Failed to load Create Employee Address</div> 
})));

const CreateSkill = React.lazy(() => import('EmployeeService/CreateSkill').catch(() => ({ 
  default: () => <div>Failed to load Create  Employee Employee </div> 
})));

const CreateTraining = React.lazy(() => import('EmployeeService/CreateTraining').catch(() => ({ 
  default: () => <div>Failed to load Create Employee Training </div> 
})));

const CreateFamily = React.lazy(() => import('EmployeeService/CreateFamily').catch(() => ({ 
  default: () => <div>Failed to load Create Employee faminly</div> 
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
  { label: 'Personal', component: EditEmployee, resource: EmployeeServiceResourceName.UPDATE_EMPLOYEE },
  { label: 'Address', component: CreateAddress, resource: EmployeeServiceResourceName.ADD_ADDRESS },
  { label: 'Skill', component: CreateSkill, resource: EmployeeServiceResourceName.ADD_SKILL },
  { label: 'Education', component: CreateEducation, resource: EmployeeServiceResourceName.ADD_EDUCATION },

  { label: 'Training', component: CreateTraining, resource: EmployeeServiceResourceName.ADD_TRAINING },

  { label: 'Family', component: CreateFamily, resource: EmployeeServiceResourceName.ADD_FAMILY },

  { label: 'Reference', component: CreateReference, resource: EmployeeServiceResourceName.ADD_REFERENCE },

  { label: 'Language', component:   CreateLanguage  , resource: EmployeeServiceResourceName.ADD_LANGUAGE },

  { label: 'Experience', component:   CreateExperience  , resource: EmployeeServiceResourceName.ADD_EXPERIENCE },

 
];

const EditDetails = () => {
  const location = useLocation();
  const [id, setId] = useState(location.state?.id || null);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 0);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.id) {
      handleIdReceived(location.state.id);
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    if (id || newValue === 0) {
      startTransition(() => {
        setActiveTab(newValue);
      });
    }
  };

  const handleIdReceived = (newId) => {
    setId(newId);
  };

  const { component: ActiveComponent, resource } = tabComponents[activeTab];

  const handleIconClick = () => {
    navigate(`/employee/list`);
  };

  const refreshPage = () => {
    window.location.reload();
  };

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
              disabled={!id && index !== 0} 
            />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="employee">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent id={id} onIdReceive={handleIdReceived} />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default EditDetails;


// import React, { useState, useEffect } from 'react';
// import { Box, Tabs, Tab } from '@mui/material';
// import { useLocation } from 'react-router-dom';
// import { startTransition } from 'react';

// // import Header from '../../Header';
// // import RoleProtectedRoute from '../../Auth/RoleProtectedRoute ';
// // import CreateSkillofEmployee from '../Skill/CreateSkillofEmployee';
// // import CreateTraining from '../Training/CreateTraining';
// // import CreateLanguage from '../Language/CreateLanguage';
// // import CreateFamily from '../Family/CreateFamily';
// // import CreateReference from '../Reference/CreateReference';
// // import CreateExperience from '../Experence/CreateExperience';
// // import CreateAddress from '../Address/CreateAddress';
// // import CreateEducation from '../Education/CreateEducation';
// import RoleProtectedRoute from './RoleProtectedRoute';
// import EmployeeServiceResourceName from './Resource/EmployeeServiceResourceName';
// import CreateAddress from 'EmployeeService/CreateAddress';

// const CreateEducation = React.lazy(() => import('EmployeeService/CreateEducation').catch(() => ({ 
//   default: () => <div>Failed to load  Creaete Education </div> 
// })));

// const EditEmployee = React.lazy(() => import('EmployeeService/EditEmployee').catch(() => ({ 
//   default: () => <div>Failed to load  Edit Employee</div> 
// })));

// const CreateAddress = React.lazy(() => import('EmployeeService/CreateAddress').catch(() => ({ 
//   default: () => <div>Failed to load  Create Employee Address</div> 
// })));

// import { useNavigate } from "react-router-dom";


// const tabComponents = [
//   { label: 'Personal', component: EditEmployee, resource: EmployeeServiceResourceName.UPDATE_EMPLOYEE },
  

//   // { label: 'Skill', component: CreateSkillofEmployee, resource: EmployeeServiceResourceName.GET_ALL_SKILLS },
//   // { label: 'Training', component: CreateTraining, resource: EmployeeServiceResourceName.ADD_TRAINING },
//   // { label: 'Language', component: CreateLanguage, resource: EmployeeServiceResourceName.ADD_LANGUAGE },
//   // { label: 'Family', component: CreateFamily, resource: EmployeeServiceResourceName.ADD_FAMILY },
//   // { label: 'Reference', component: CreateReference, resource: EmployeeServiceResourceName.ADD_REFERENCE },
//   // { label: 'Experience', component: CreateExperience, resource: EmployeeServiceResourceName.ADD_EXPERIENCE },
//   { label: 'Address', component: CreateAddress, resource: EmployeeServiceResourceName.ADD_ADDRESS },
//   { label: 'Education', component: CreateEducation, resource: EmployeeServiceResourceName.ADD_EDUCATION },
// ];

// const EditDetails = () => {
//   const location = useLocation();
//   const [id, setId] = useState(location.state?.id || null);
//   const [activeTab, setActiveTab] = useState(location.state?.activeTab || 0);

//   const navigate = useNavigate();





//   useEffect(() => {
//     if (location.state?.id) {
//       handleIdReceived(location.state.id);
//     }
//   }, [location.state]);

//   const handleTabChange = (event, newValue) => {
//     if (id || newValue === 0) {
//       setActiveTab(newValue);
//     }
//   };

//   const handleIdReceived = (newId) => {
//     setId(newId);
//   };

//   const { component: ActiveComponent, resource } = tabComponents[activeTab];
//   const handleIconClick = () => {
//     navigate(`/employee/list`);
//   };

//   const refreshPage = () => {
//     window.location.reload();
//   };

//   return (
//     <Box m="20px">
//       {/* <Header subtitle="Update Employee Information" />
//       <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} refreshPage={refreshPage} /> */}

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
//               disabled={!id && index !== 0} 
//             />
//           ))}
//         </Tabs>
//       </Box>
//       <Box p={3}>
//         <RoleProtectedRoute requiredResourceName={resource} apiName="employee">
//           <ActiveComponent id={id} onIdReceive={handleIdReceived} />
//         </RoleProtectedRoute>
//       </Box>
//     </Box>
//   );
// };

// export default EditDetails;
