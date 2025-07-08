import React, { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RecruitmentServiceResourceName from '../Security/Resource/RecruitmentServiceResourceName';
import RoleProtectedRoute from '../Security/RoleProtectedRoute';

const CreateAdvertisment = React.lazy(() => import('RecruitmentService/CreateAdvertisment').catch(() => ({ 
  default: () => <div>Failed to load create advertisement</div> 
})));

const CreateApplicant = React.lazy(() => import('RecruitmentService/CreateApplicant').catch(() => ({ 
  default: () => <div>Failed to load create applicant</div> 
})));

const CreateAssessmentWeight = React.lazy(() => import('RecruitmentService/CreateAssessmentWeight').catch(() => ({ 
  default: () => <div>Failed to load create assessment weight</div> 
})));

const CreateShortListCriterial
= React.lazy(() => import('RecruitmentService/CreateShortListCriterial').catch(() => ({ 
  default: () => <div>Failed to load create shortlist criteria</div> 
})));

const tabComponents = [
  { label: 'Advertisement', component: CreateAdvertisment, resource: RecruitmentServiceResourceName.ADD_ADVERTISEMENT },
  { label: 'Applicant', component: CreateApplicant, resource: RecruitmentServiceResourceName.ADD_APPLICANT },
  { label: 'Assessment Weight', component: CreateAssessmentWeight, resource: RecruitmentServiceResourceName.ADD_ASSESSMENT_WEIGHT },
  { label: 'Criteria', component: CreateShortListCriterial, resource: RecruitmentServiceResourceName.ADD_SHORTLIST_CRITERIA },
];

const MoreAboutRecruitment = () => {
  const location = useLocation();
  const { id: recruitmentId, activeTab: initialTab = 0 } = location.state || {};
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (event, tabIndex) => {
    setActiveTab(tabIndex);
  };

  const { component: ActiveComponent, resource } = tabComponents[activeTab];

  return (
    <Box m="20px">
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        {tabComponents.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="recruitment">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent recruitmentId={recruitmentId} />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default MoreAboutRecruitment;