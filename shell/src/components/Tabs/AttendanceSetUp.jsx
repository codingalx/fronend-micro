import React, { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleProtectedRoute from '../Security/RoleProtectedRoute';
import AttendanceServiceResourceName from '../Security/Resource/AttendanceServiceResourceName';


const CreateShift = React.lazy(() => import('attendanceService/CreateShift').catch(() => ({
  default: () => <div>Failed to load create shift time</div>
})));

const CreateWeekend = React.lazy(() => import('attendanceService/CreateWeekend').catch(() => ({
  default: () => <div>Failed to load create Weeks time</div>
})));

const CreateOvertime = React.lazy(() => import('attendanceService/CreateOvertime').catch(() => ({
  default: () => <div>Failed to load create over time</div>
})));
const CreateTimeTolerance = React.lazy(() => import('attendanceService/CreateTimeTolerance').catch(() => ({
  default: () => <div>Failed to load create time tolerance</div>
})));

const CreateExcuse = React.lazy(() => import('attendanceService/CreateExcuse').catch(() => ({
  default: () => <div>Failed to load create excuse type</div>
})));



const tabComponents = [
  { label: 'Shift Time', component: CreateShift, resource: AttendanceServiceResourceName.ADD_SHIFT },

   { label: 'Weekend', component: CreateWeekend, resource: AttendanceServiceResourceName.GET_ALL_SHIFTS },

   { label: 'OverTime', component: CreateOvertime, resource: AttendanceServiceResourceName.ADD_OVERTIME },

  { label: 'TimeTolerance', component: CreateTimeTolerance, resource: AttendanceServiceResourceName.ADD_TIME_TOLERANCE },


  { label: 'ExcuseTime', component: CreateExcuse, resource: AttendanceServiceResourceName.ADD_EXCUSE_TYPE },

  
];



const AttendanceSetUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [tabsUnlocked, setTabsUnlocked] = useState(false);

  useEffect(() => {
    if (location.state && typeof location.state.activeTab === 'number') {
      setActiveTab(location.state.activeTab);
    }
    setTabsUnlocked(true); // Assuming tabs can be unlocked at the start
  }, [location.state]);

  const handleTabChange = (event, tabIndex) => {
    setActiveTab(tabIndex);
    navigate('/attendance/set_up', { state: { activeTab: tabIndex } });
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
          aria-label="Attendance management tabs"
            sx={{ display: 'flex', justifyContent: 'center' }} // Center the tabs
        >
          {tabComponents.map((tab, index) => (
            <Tab key={index} label={tab.label} disabled={!tabsUnlocked && index !== 0} />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="attendance">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default AttendanceSetUp;