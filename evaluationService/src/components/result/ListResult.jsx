import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import EvaluationServiceResourceName from "../../../configuration/EvaluationServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; 
import { getAllResult, listEmployee, getAllCategory, getAllCriterial } from "../../../configuration/EvaluationApi";

const ListResult = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;

  const [result, setResult] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [categories, setCategories] = useState([]);
  const [criterial, setCriterial] = useState([]);
  const [error, setError] = useState(null);

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    fetchAllResult();
    fetchAllEmployee();
    fetchAllCategory();
    fetchAllCriteria();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllResult = async () => {
    try {
      const response = await getAllResult(tenantId);
      const enrichedResults = response.data.map(item => ({
        ...item,
        employeeName: getEmployeeName(item.employeeId),
        categoryName: getCategoryName(item.categoryId),
        criteriaName: getCriteriaName(item.criteriaId),
      }));
      setResult(enrichedResults);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const fetchAllEmployee = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployee(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error.message);
    }
  };

  const fetchAllCategory = async () => {
    try {
      const response = await getAllCategory(tenantId);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error.message);
    }
  };

  const fetchAllCriteria = async () => {
    try {
      const response = await getAllCriterial(tenantId);
      setCriterial(response.data);
    } catch (error) {
      console.error("Failed to fetch criteria:", error.message);
    }
  };

  const getEmployeeName = (id) => {
    const employeeItem = employee.find(emp => emp.id === id);
    return employeeItem ? employeeItem.employeeId : "Unknown Employee";
  };

  const getCategoryName = (id) => {
    const categoryItem = categories.find(cat => cat.id === id);
    return categoryItem ? categoryItem.name : "Unknown Category";
  };

  const getCriteriaName = (id) => {
    const criteriaItem = criterial.find(crit => crit.id === id);
    return criteriaItem ? criteriaItem.name : "Unknown Criteria";
  };

  const handleEditResult = (id) => {
    navigate('/evaluation/update_result', { state: { id } });
  };

  const handleDeleteResult = (id) => {
    navigate('/evaluation/delete_result', { state: { id } });
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EvaluationServiceResourceName.UPDATE_EVALUATION_RESULT, userRoles);
    const deleteAccess = await canAccessResource(EvaluationServiceResourceName.DELETE_EVALUATION_RESULT, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const columns = [
    {
      field: "employeeName",
      headerName: "Employee",
      flex: 1,
    },
    {
      field: "categoryName",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "criteriaName",
      headerName: "Criteria",
      flex: 1,
    },
    { field: "result", headerName: "Result", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Result">
              <IconButton
                onClick={() => handleDeleteResult(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update Result">
              <IconButton
                onClick={() => handleEditResult(params.row.id)}
                color="primary"
              >
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
      <Header subtitle="List Of Results" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={result}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListResult;