import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllClearanceDepartments, getAllDepartments } from "../../Api/separationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header"; 

const ListClearanceDepartment = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [clearanceDepartments, setClearanceDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClearanceDepartments();
  }, [refreshKey]);

  const fetchClearanceDepartments = async () => {
    try {
      const [clearanceResponse, departmentResponse] = await Promise.all([
        getAllClearanceDepartments(tenantId),
        getAllDepartments(tenantId)
      ]);
      
      setClearanceDepartments(clearanceResponse.data);
      setDepartments(departmentResponse.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching clearance departments:', error);
    }
  };

  const handleUpdate = (id) => {
    navigate('/separation/update-clearance-department', { state: { clearanceDepartmentId: id } });
  };

  const handleDelete = (id, name) => {
    navigate('/separation/delete-clearance-department', { state: { clearanceDepartmentId: id, name } });
  };

  const departmentMap = departments.reduce((acc, department) => {
    acc[department.id] = department.departmentName;
    return acc;
  }, {});

  const rows = clearanceDepartments.map(department => ({
    ...department,
    departmentName: departmentMap[department.departmentId] || 'Unknown Department'
  }));

  const columns = [
    { field: 'departmentName', headerName: 'Department Name', flex: 1 },
    { field: 'sequencePriority', headerName: 'Sequence Priority', flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Update Clearance Department">
            <IconButton 
              onClick={() => handleUpdate(params.row.id)} 
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Clearance Department">
            <IconButton 
              onClick={() => handleDelete(params.row.id, params.row.departmentName)} 
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Clearance Departments"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListClearanceDepartment;