import React, { useState, useEffect, startTransition, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleProtectedRoute from '../Security/RoleProtectedRoute';
import StoreServiceResourceName from '../Security/Resource/StoreServiceResourceName';

// Lazy-loaded components
const CreateStoreCategory = React.lazy(() => import('storeService/CreateStoreCategory').catch(() => ({
  default: () => <div>Failed to load create category pages</div>
})));

const CreateStore = React.lazy(() => import('storeService/CreateStore').catch(() => ({
  default: () => <div>Failed to load create store pages</div>
})));

const CreateShelf = React.lazy(() => import('storeService/CreateShelf').catch(() => ({
  default: () => <div>Failed to load create shelf pages</div>
})));

const CreateCell = React.lazy(() => import('storeService/CreateCell').catch(() => ({
  default: () => <div>Failed to load create cell pages</div>
})));

const tabComponents = [
  { label: 'Store Category', component: CreateStoreCategory, resource: StoreServiceResourceName.CREATE_STORE_CATEGORY },
  { label: 'Store', component: CreateStore, resource: StoreServiceResourceName.CREATE_STORE },
  { label: 'Store Shelf', component: CreateShelf, resource: StoreServiceResourceName.CREATE_SHELF },
  { label: 'Store Cell', component: CreateCell, resource: StoreServiceResourceName.CREATE_CELL },
];

const StoreSetUp = () => {
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
      navigate('/store/store_setup', { state: { activeTab: tabIndex } });
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
          aria-label="Store management tabs"
          sx={{ justifyContent: 'center' }} // Center the tabs
        >
          {tabComponents.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="store">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default StoreSetUp;