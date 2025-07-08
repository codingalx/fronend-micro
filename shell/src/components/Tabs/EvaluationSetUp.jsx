import React, { useState, useEffect, startTransition, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleProtectedRoute from '../Security/RoleProtectedRoute';
import EvaluationServiceResourceName from '../Security/Resource/EvaluationServiceResourceName';

// Lazy-loaded components
const CreateCategory = React.lazy(() => import('evaluationService/CreateCategory').catch(() => ({
  default: () => <div>Failed to load category pages</div>
})));

const CreateCriterial = React.lazy(() => import('evaluationService/CreateCriterial').catch(() => ({
  default: () => <div>Failed to load criterial pages</div>
})));

const CreateLevel = React.lazy(() => import('evaluationService/CreateLevel').catch(() => ({
  default: () => <div>Failed to load level pages</div>
})));

const CreateSession = React.lazy(() => import('evaluationService/CreateSession').catch(() => ({
  default: () => <div>Failed to load session pages</div>
})));

const tabComponents = [

  { label: 'Category', component: CreateCategory, resource: EvaluationServiceResourceName.ADD_EVALUATION_CATEGORY },
  { label: 'Criterial', component: CreateCriterial, resource: EvaluationServiceResourceName.ADD_EVALUATION_CRITERIA },
  { label: 'Session', component: CreateSession, resource: EvaluationServiceResourceName.ADD_EVALUATION_SESSION },
  { label: 'Levels', component: CreateLevel, resource: EvaluationServiceResourceName.ADD_EVALUATION_LEVEL },
];

const EvaluationSetUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0); 

  useEffect(() => {
    if (location.state?.activeTab !== undefined) {
      setActiveTab(location.state.activeTab);
    } else {
      console.log('No activeTab in location.state');
    }
  }, [location.state]);

  const handleTabChange = (event, tabIndex) => {
    startTransition(() => {
      console.log(`Navigating to tab ${tabIndex}`);
      setActiveTab(tabIndex);
      navigate('/evaluation/evalution_setup', { state: { activeTab: tabIndex } });
    });
  };

  const { component: ActiveComponent, resource } = tabComponents[activeTab];

  return (
    <Box m="20px">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Evaluation management tabs"
          sx={{ justifyContent: 'center' }} // Center the tabs
        >
          {tabComponents.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="evaluation">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default EvaluationSetUp;