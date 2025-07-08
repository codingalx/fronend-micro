import React, { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleProtectedRoute from '../Security/RoleProtectedRoute';
import LeaveServiceResourceName from '../Security/Resource/LeaveServiceResourceName';

const AddHoliday = React.lazy(() => import('leaveService/AddHoliday').catch(() => ({
  default: () => <div>Failed to load Add Holiday</div>
})));

const AddHolidayMgmt = React.lazy(() => import('leaveService/AddHolidayMgmt').catch(() => ({
  default: () => <div>Failed to load Add Holiday management</div>
})));

const AddLeaveType = React.lazy(() => import('leaveService/AddLeaveType').catch(() => ({
  default: () => <div>Failed to load Add leave type</div>
})));

const AddLeaveSettings = React.lazy(() => import('leaveService/AddLeaveSettings').catch(() => ({
  default: () => <div>Failed to load Add leave setting</div>
})));

const ListLeaveRequest = React.lazy(() => import('leaveService/ListLeaveRequest').catch(() => ({
  default: () => <div>Failed to load Add leave request</div>
})));

const ManageLeaveSchedule = React.lazy(() => import('leaveService/ManageLeaveSchedule').catch(() => ({
  default: () => <div>Failed to load manage Leave request</div>
})));

const AddBudgetYear = React.lazy(() => import('leaveService/AddBudgetYear').catch(() => ({
  default: () => <div>Failed to load budget year</div>
})));

const tabComponents = [
  { label: 'Budget Year', component: AddBudgetYear, resource: LeaveServiceResourceName.ADD_BUDGET_YEAR },
  { label: 'Holiday', component: AddHoliday, resource: LeaveServiceResourceName.ADD_HOLIDAY },
  { label: 'Holiday Management', component: AddHolidayMgmt, resource: LeaveServiceResourceName.ADD_HOLIDAY_MANAGEMENT },
  { label: 'Leave Type', component: AddLeaveType, resource: LeaveServiceResourceName.ADD_LEAVE_TYPE },
  { label: 'Leave Setting', component: AddLeaveSettings, resource: LeaveServiceResourceName.ADD_LEAVE_SETTING },
  { label: 'Leave Requests', component: ListLeaveRequest, resource: LeaveServiceResourceName.GET_ALL_LEAVE_REQUESTS },
  { label: 'Leave Schedules', component: ManageLeaveSchedule, resource: LeaveServiceResourceName.GET_ALL_LEAVE_SCHEDULES },
];

const LeaveInfo = () => {
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
    navigate('/add_Leave_Info', { state: { activeTab: tabIndex } });
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
          aria-label="Leave management tabs"
        >
          {tabComponents.map((tab, index) => (
            <Tab key={index} label={tab.label} disabled={!tabsUnlocked && index !== 0} />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute requiredResourceName={resource} apiName="leave">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default LeaveInfo;