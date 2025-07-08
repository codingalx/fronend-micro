import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import {   departmentTypesEndpoint,
  departmentEndpoint, } from "../../../configuration/organizationApi";
  import Header from "../common/Header";
  import { canAccessResource } from "../../../configuration/SecurityService";
  import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
  import { useAtom } from 'jotai';
  import { authAtom } from 'shell/authAtom'; 
  

const ListDepartment = ({refreshKey}) => {
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departementToDelete, setDepartementToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canAddAddress, setCanAddAddress] = useState(false);
  const [canAddStaffPlan, setCanAddStaffPlan] = useState(false);
  const [canChangeStructure, setCanChangeStructure] = useState(false);
  const [canViewDetails, setCanViewDetails] = useState(false);
  const userRoles = authState.roles;

  // Function to handle deletion
  const handleDeleteRole = async () => {
    console.log("Deleting departement:", departementToDelete); // Debugging log
    try {
      const { url, headers } = departmentEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/${departementToDelete}`, {
        headers,
      });

      console.log("Departement deleted successfully:", departementToDelete);
      setReloadTrigger((prev) => prev + 1); // Trigger reload after successful delete
      setDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to delete departement", error);
    }
  };

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [error, setError] = useState(null);

  const displayTenants = async () => {
    const { url, headers } = departmentEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      if (Array.isArray(response.data)) {
       
         setTenants(response.data);

      } else {
        setTenants([]);
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const fetchDepartmentTypes = async () => {
    const { url, headers } = departmentTypesEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setDepartmentTypes(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const checkPermissions = async () => {
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_DEPARTMENT,
      userRoles
    );
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_DEPARTMENT,
      userRoles
    );
    const addAddressAccess = await canAccessResource(
      OrganizationServiceResourceName.ADD_ADDRESS,
      userRoles
    );
    const addStaffPlanAccess = await canAccessResource(
      OrganizationServiceResourceName.ADD_STAFF_PLAN,
      userRoles
    );
    const changeStructureAccess = await canAccessResource(
      OrganizationServiceResourceName.CHANGE_STRUCTURE,
      userRoles
    );
    const viewDetailsAccess = await canAccessResource(
      OrganizationServiceResourceName.GET_DEPARTMENT_BY_ID,
      userRoles
    );

    setCanDelete(deleteAccess);
    setCanEdit(editAccess);
    setCanAddAddress(addAddressAccess);
    setCanAddStaffPlan(addStaffPlanAccess);
    setCanChangeStructure(changeStructureAccess);
    setCanViewDetails(viewDetailsAccess);
  };

  useEffect(() => {
    displayTenants();
    fetchDepartmentTypes();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "departmentName", headerName: "Department Name", flex: 2 },
    { field: "departmentTypes", headerName: "Department Type", flex: 1 },

    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) =>
        canDelete && (
          <Tooltip title="Delete Department">
            <IconButton
              onClick={() => {
                console.log("Delete button clicked for:", params.row.id);
                setDepartementToDelete(params.row.id); // Set the role to delete
                setDeleteDialogOpen(true); // Open the delete dialog
              }}
              color="inherit"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
    },
    {
      field: "editAction",
      headerName: "Edit Department",
      flex: 1,
      renderCell: (params) =>
        canEdit && (
          <Tooltip title="Edit Department">
            <IconButton
              onClick={() => navigate("/edit_department", { state: { id: params.row.id } })}
              color="inherit"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
    },

    // {
    //   field: "addAction",
    //   headerName: "Add Address",
    //   flex: 1,
    //   renderCell: (params) =>
    //     canAddAddress && (
    //       <Tooltip title="Add Address">
    //         <IconButton
    //          onClick={() => navigate("/manage_organization", { state: { id: params.row.id,activeTab: 3 } })}
    //           color="inherit"
    //         >
    //           <AddRoadSharpIcon />
    //         </IconButton>
    //       </Tooltip>
    //     ),
    // },

    // {
    //   field: "planAction",
    //   headerName: "Add Staff Plan",
    //   flex: 1,
    //   renderCell: (params) =>
    //     canAddStaffPlan && (
    //       <Tooltip title="Add Staff Plan">
    //         <IconButton
    //           onClick={() => navigate("/manage_organization", { state: { id: params.row.id,activeTab: 2 } })}
    //           color="inherit"
    //         >
    //           <PlaylistAddCheckSharpIcon />
    //         </IconButton>
    //       </Tooltip>
    //     ),
    // },




    // {
    //   field: "structureAction",
    //   headerName: "Structure Change",
    //   flex: 1,
    //   renderCell: (params) =>
    //     canChangeStructure && (
    //       <Tooltip title="Change Structure">
    //         <IconButton
    //           onClick={() => navigate("/structure_change", { state: { id: params.row.id } })}
    //           color="inherit"
    //         >
    //           <PublishedWithChangesSharpIcon />
    //         </IconButton>
    //       </Tooltip>
    //     ),
    // },
    {
      field: "detailsAction",
      headerName: "Details Dep",
      flex: 1,
      renderCell: (params) =>
        canViewDetails && (
          <Tooltip title="View Details">
            <IconButton
              onClick={() => navigate("/details_department", { state: { id: params.row.id } })}
              color="inherit"
            >
              <ReadMoreIcon />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        subtitle="Managing the department list"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {},
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {},
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={handleCellClick}
            rows={tenants.map((tenants) => ({
              ...tenants,
              id: tenants.id,
              departmentTypes: departmentTypes.find(
                (type) => type.id === tenants.departmentTypeId
              )?.departmentTypeName,
            }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this department?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRole} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListDepartment;