import React, { useEffect, useState, useContext } from "react";
import { Box, Tooltip, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import {tokens} from '../common/theme'
import { listAddress } from "../../Api/employeeApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { canAccessResource } from "../../Api/SecurityService";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; 
import NotFoundHandle from "../common/NotFoundHandle";


const ListAddress = ({ employerId, refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const userRoles = authState.roles
  const tenantId = authState.tenantId;




  const [address, setAddress] = useState([]);
  const [error, setError] = useState(null);

  const handleEditAddress = (employerId, id) => {
    navigate('/employee/EditAddress', { state: { employerId, id } });
  };

  const handleDelete = (employerId, id) => {
    navigate('/employee/deleteAddress', { state: { employerId, id } });
  };

  useEffect(() => {
    fetchAddress();
    checkPermissions();
  }, [refreshKey]);

  const fetchAddress = async () => {
    try {
      const response = await listAddress(tenantId,employerId);
      const data = response.data;
      setAddress(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_ADDRESS, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_ADDRESS, userRoles);

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  if (!(employerId)) {
    return <NotFoundHandle message="No employee selected to get address." navigateTo="/employee/list" />;
  }

  const columns = [
    { field: "addressType", headerName: "Address Type", flex: 1, cellClassName: "name-column--cell" },
    { field: "houseNumber", headerName: "House Number", flex: 1, cellClassName: "name-column--cell" },
    { field: "homeTelephone", headerName: "Home Telephone", flex: 1, cellClassName: "name-column--cell" },
    { field: "officeTelephone", headerName: "Office Telephone", flex: 1, cellClassName: "name-column--cell" },
    { field: "mobileNumber", headerName: "Mobile Number", flex: 1, cellClassName: "name-column--cell" },
    { field: "email", headerName: "Email", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Address of Employer">
              <IconButton onClick={() => handleDelete(employerId, params.row.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update">
              <IconButton onClick={() => handleEditAddress(employerId, params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List of Employee Address" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={address}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
     
    </Box>
  );
};

export default ListAddress;
