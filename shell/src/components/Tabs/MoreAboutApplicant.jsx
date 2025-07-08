import React, { useState, useEffect, startTransition, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import {  useLocation } from 'react-router-dom';
import RoleProtectedRoute from '../Security/RoleProtectedRoute'; // Fixed import path
import RecruitmentServiceResourceName from '../Security/Resource/RecruitmentServiceResourceName';

const CreateApplicantExperience = React.lazy(() => import('RecruitmentService/CreateApplicantExperience').catch(() => ({
  default: () => <div>Failed to load create applicant experience</div> // Corrected typo
})));

const CreateApplicantCertificate = React.lazy(() => import('RecruitmentService/CreateApplicantCertificate').catch(() => ({
  default: () => <div>Failed to load create applicant certificate</div>
})));

const CreateApplicantLanguage = React.lazy(() => import('RecruitmentService/CreateApplicantLanguage').catch(() => ({
  default: () => <div>Failed to load create applicant language</div> // Corrected typo
})));

const CreateApplicantEducation = React.lazy(() => import('RecruitmentService/CreateApplicantEducation').catch(() => ({
  default: () => <div>Failed to load create applicant education</div>
})));

const CreateApplicantReference = React.lazy(() => import('RecruitmentService/CreateApplicantReference').catch(() => ({
  default: () => <div>Failed to load create applicant reference</div> // Corrected typo
})));

const tabComponents = [
  { label: 'Education', component: CreateApplicantEducation, resource: RecruitmentServiceResourceName.ADD_EDUCATION },
  { label: 'Training', component: CreateApplicantCertificate, resource: RecruitmentServiceResourceName.ADD_TRAINING },
  { label: 'Reference', component: CreateApplicantReference, resource: RecruitmentServiceResourceName.ADD_REFERENCE },
  { label: 'Language', component: CreateApplicantLanguage, resource: RecruitmentServiceResourceName.ADD_LANGUAGE },
  { label: 'Experience', component: CreateApplicantExperience, resource: RecruitmentServiceResourceName.ADD_EXPERIENCE },
];

const MoreAboutApplicant = () => {
  const location = useLocation();
  const { recruitmentId, id: applicantId, activeTab: initialTab = 0 } = location?.state || {};
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (location.state && typeof location.state.activeTab === 'number') {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (event, tabIndex) => {
    startTransition(() => {
      setActiveTab(tabIndex);
    });
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
            <ActiveComponent applicantId={applicantId} recruitmentId={recruitmentId} />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default MoreAboutApplicant;