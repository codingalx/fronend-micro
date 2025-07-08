import React, { useState, useEffect, startTransition, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import RoleProtectedRoute from '../Security/ProtectedRoute';
import OrganizationServiceResourceName from '../Security/Resource/OrganizationServiceResourceName';

const CreateJobGrade = React.lazy(() => import('organization/CreateJobGrade').catch(() => ({ 
  default: () => <div>Failed to load Create Job Grade</div> 
})));

const CreateJobCategory = React.lazy(() => import('organization/CreateJobCategory').catch(() => ({ 
  default: () => <div>Failed to load Create Job Category</div> 
})));

const CreateWorkUnit = React.lazy(() => import('organization/CreateWorkUnit').catch(() => ({ 
  default: () => <div>Failed to load Create Work Unit</div> 
})));

const CreateEducationLevel = React.lazy(() => import('organization/CreateEducationLevel').catch(() => ({ 
  default: () => <div>Failed to load Create Education Level</div> 
})));

const CreateFieldstudy = React.lazy(() => import('organization/CreateFieldstudy').catch(() => ({ 
  default: () => <div>Failed to load Create  field of study</div> 
})));

const CreateQualification = React.lazy(() => import('organization/CreateQualification').catch(() => ({ 
  default: () => <div>Failed to load Create Qualification</div> 
})));

const CreatePayGrade = React.lazy(() => import('organization/CreatePayGrade').catch(() => ({ 
  default: () => <div>Failed to load Create Pay Grade</div> 
})));

const CreateLocationType = React.lazy(() => import('organization/CreateLocationType').catch(() => ({ 
  default: () => <div>Failed to load Create Location Type</div> 
})));

const CreateLocation = React.lazy(() => import('organization/CreateLocation').catch(() => ({ 
  default: () => <div>Failed to load Create Location</div> 
})));

const CreateDepartementType = React.lazy(() => import('organization/CreateDepartementType').catch(() => ({ 
  default: () => <div>Failed to load Create Department Type</div> 
})));

const AddDepartement = React.lazy(() => import('organization/AddDepartement').catch(() => ({ 
  default: () => <div>Failed to load Add Department</div> 
})));

const tabComponents = [
  { label: 'Job Grade', component: CreateJobGrade, resource: OrganizationServiceResourceName.ADD_JOB_GRADE },
  { label: 'Job Category', component: CreateJobCategory, resource: OrganizationServiceResourceName.ADD_JOB_CATEGORY },
  { label: 'Work Unit', component: CreateWorkUnit, resource: OrganizationServiceResourceName.ADD_WORK_UNIT },
  { label: 'Education Level', component: CreateEducationLevel, resource: OrganizationServiceResourceName.ADD_EDUCATION_LEVEL },
  { label: 'Qualification', component: CreateQualification, resource: OrganizationServiceResourceName.ADD_QUALIFICATION },
  { label: 'Pay Grade', component: CreatePayGrade, resource: OrganizationServiceResourceName.ADD_PAY_GRADE },
  { label: 'Location Type', component: CreateLocationType, resource: OrganizationServiceResourceName.ADD_LOCATION_TYPE },
  { label: 'Location', component: CreateLocation, resource: OrganizationServiceResourceName.ADD_LOCATION },
  { label: 'Department Type', component: CreateDepartementType, resource: OrganizationServiceResourceName.ADD_DEPARTMENT_TYPE },
  { label: 'Department', component: AddDepartement, resource: OrganizationServiceResourceName.ADD_DEPARTMENT },
  { label: 'Field Of Study', component: CreateFieldstudy, resource: OrganizationServiceResourceName.ADD_FIELD_OF_STUDY },


];

const OrganizationTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0); 

  useEffect(() => {
    if (location.state && typeof location.state.activeTab === 'number') {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (event, tabIndex) => {
    startTransition(() => {
      setActiveTab(tabIndex);
      navigate('/manage_organization_info', { state: { activeTab: tabIndex } });
    });
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
          aria-label="Organization management tabs"
        >
          {tabComponents.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="organization">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default OrganizationTab;