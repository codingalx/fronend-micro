import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import OrganizationServiceResourceName from "../../components/Security/Resource/OrganizationServiceResourceName";
import RoleProtectedRoute from "../Security/RoleProtectedRoute";
import { Suspense } from "react";

const TreeOptional = React.lazy(() =>
  import("organization/TreeOptional").catch(() => ({
    default: () => <div>Failed to load Tree optional</div>,
  }))
);
const GetDepartemnet = React.lazy(() =>
  import("organization/GetDepartemnet").catch(() => ({
    default: () => <div>Failed to load Get Departement</div>,
  }))
);
const CreateJobRegistration = React.lazy(() =>
  import("organization/CreateJobRegistration").catch(() => ({
    default: () => <div>Failed to load Create job registration</div>,
  }))
);

const AddStaffPlan = React.lazy(() =>
  import("organization/AddStaffPlan").catch(() => ({
    default: () => <div>Failed to load add staff plan</div>,
  }))
);

const AddAddress = React.lazy(() =>
  import("organization/AddAddress").catch(() => ({
    default: () => <div>Failed to load add add address</div>,
  }))
);

const ChangeStructure = React.lazy(() =>
  import("organization/ChangeStructure").catch(() => ({
    default: () => <div>Failed to load change structure</div>,
  }))
);

const tabComponents = [
  {
    label: "Organization Structure",
    component: TreeOptional,
    resource: OrganizationServiceResourceName.GET_ALL_DEPARTMENTS,
  },

  {
    label: "Department/Process",
    component: GetDepartemnet,
    resource: OrganizationServiceResourceName.UPDATE_DEPARTMENT,
  },

  {
    label: "Job Register",
    component: CreateJobRegistration,
    resource: OrganizationServiceResourceName.ADD_JOB,
  },

  {
    label: "Staff Plan",
    component: AddStaffPlan,
    resource: OrganizationServiceResourceName.ADD_STAFF_PLAN,
  },

  {
    label: "Address",
    component: AddAddress,
    resource: OrganizationServiceResourceName.ADD_ADDRESS,
  },

  {
    label: "Change Structure",
    component: ChangeStructure,
    resource: OrganizationServiceResourceName.UPDATE_DEPARTMENT,
  },
];

const StructureTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(0);
  const [tabsUnlocked, setTabsUnlocked] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: null,
    name: null,
  });

  useEffect(() => {
    setActiveTab(0);
    setTabsUnlocked(false);

    if (location.state) {
      const { id, activeTab } = location.state;
      if (id) {
        setTabsUnlocked(true);
        setSelectedDepartment({ id, name: location.state.name || null });
      }
      if (typeof activeTab === "number") {
        setActiveTab(activeTab);
      }
    }
  }, [location.state]);

  const handleTabChange = (event, tabIndex) => {
    setActiveTab(tabIndex);

    navigate("/manage_organization", {
      state: {
        activeTab: tabIndex,
        id: selectedDepartment.id,
        name: selectedDepartment.name,
      },
    });
  };

  const handleDepartmentSelect = (id, name) => {
    setSelectedDepartment({ id, name });
    setTabsUnlocked(true);
    setActiveTab(0);
    console.log(`Selected Department: ${name} (ID: ${id})`);
  };

  const { component: ActiveComponent, resource } = tabComponents[activeTab];

  return (
    <Box m="20px">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Organization structure tabs"
        >
          {tabComponents.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              disabled={!tabsUnlocked && index !== 0}
            />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <RoleProtectedRoute
          requiredResourceName={resource}
          apiName="organization"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent onNodeSelect={handleDepartmentSelect} />
          </Suspense>
        </RoleProtectedRoute>
      </Box>
    </Box>
  );
};

export default StructureTab;
