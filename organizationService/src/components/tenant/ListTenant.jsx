import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import { deleteTenantsEndpoint, getAllTenantsEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ListTenant = () => {
  const [authState] = useAtom(authAtom); 
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]); // State for filtered rows
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(null);


  const displayTenants = async () => {
    const { url, headers } = getAllTenantsEndpoint(authState.accessToken); // Get the URL and headers
    try {
      const response = await axios.get(url, { headers }); // Use the headers in the request
      setTenants(response.data);
      setFilteredTenants(response.data); // Initially, all tenants are displayed
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    displayTenants();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = tenants.filter(
      (tenant) =>
        tenant.tenantName.toLowerCase().includes(query) ||
        tenant.abbreviatedName.toLowerCase().includes(query)
    );
    setFilteredTenants(filtered);
  };

  const handleDeleteClick = (tenantId) => {
    setSelectedTenantId(tenantId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { url, headers } = deleteTenantsEndpoint(authState.accessToken);
      await axios.delete(`${url}/${selectedTenantId}`, { headers });
      displayTenants();
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to delete tenant", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };
  
  const handleDefalutSetting = (id) => {
    navigate('/roleandresource', { state: { id } });
  };

  const columns = [
    { field: "tenantName", headerName: "Tenant Name", flex: 2.5 },
    { field: "abbreviatedName", headerName: "Abbreviated Name", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDeleteClick(params.row.id)}
          color="inherit"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "editAction",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate("/edittenant", { state: { id: params.row.id } })
          }
          color="inherit"
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "detailsAction",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate("/detailstenant", { state: { id: params.row.id } })
          }
          color="inherit"
        >
          <ReadMoreIcon />
        </IconButton>
      ),
    },
    // {
    //   field: "roleAction",
    //   headerName: "Configure Tenant",
    //   flex: 1.5,
    //   renderCell: (params) => (
    //     <Tooltip title="Add tenant Admin Role, Default Role, Admin User and Add Resource">
    //       <IconButton
    //         onClick={() =>
    //           navigate("/roleandresource", {
    //             state: {
    //               id: params.row.id,
    //               abbreviatedName: params.row.abbreviatedName,
    //             },
    //           })
    //         }
    //         color="inherit"
    //       >
    //         <SettingsIcon />
    //       </IconButton>
    //     </Tooltip>
    //   ),
    // },

    {
      field: "roleAction",
      headerName: "Configure Tenant",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
      
            <Tooltip title="Add tenant Admin Role, Default Role, Admin User and Add Resource">
     
           <IconButton
                onClick={() => handleDefalutSetting(params.row.id)}
              >
                  <SettingsIcon />
              </IconButton>
            </Tooltip>

        </Box>
      ),
    },
  ];

  return (
    <Box >
      <Header subtitle="Manage Tenants" />
      {/* Search Bar */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Search Tenants"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "300px" }}
        />
      </Box>

      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={(params, event) => event.stopPropagation()}
            rows={filteredTenants.map((tenant) => ({
              ...tenant,
              id: tenant.id,
            }))}
            columns={columns}
          />
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this tenant?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListTenant;
