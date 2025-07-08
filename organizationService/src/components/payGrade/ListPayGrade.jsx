import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { payGradeEndpoint, jobGradeEndpoint } from "../../../configuration/organizationApi";
import { canAccessResource } from "../../../configuration/SecurityService";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const ListPayGrade = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [payGradeToDelete, setPayGradeToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [jobGrades, setJobGrades] = useState([]);
  const [error, setError] = useState(null);
  
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [cangetdetail, setCangetdetail] = useState(false);


  const navigate = useNavigate();

  const handleDeletePayGrade = async () => {
    try {
      const { url, headers } = payGradeEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete-pay-grade/${payGradeToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete pay grade:", err);
    }
  };

  const handleEditPayGrade = (id) => {
    navigate("/edit_pay_grade", { state: { id } });
  };

  const handleDetailsPayGrade = (id) => {
    navigate("/details_pay_grade", { state: { id } });
  };

  const fetchPayGrades = async () => {
    const { url, headers } = payGradeEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });
    
      if (Array.isArray(response.data)) {
       
         setTenants(response.data);

      } else {
        setTenants([]);
        console.error("Expected an array but got:", response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  const fetchJobGrades = async () => {
    const { url, headers } = jobGradeEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });
      setJobGrades(response.data);
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_PAY_GRADE,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_PAY_GRADE,
      userRoles
    );
    const getdetails = await canAccessResource(
      OrganizationServiceResourceName.GET_PAY_GRADE_BY_ID,
      userRoles
    );

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
    setCangetdetail(getdetails);
  };

  useEffect(() => {
    fetchPayGrades();
    fetchJobGrades();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "jobGrades", headerName: "Job Grade Name", flex: 1.5 },
    { field: "salaryStep", headerName: "Salary Step", flex: 1 },
    { field: "initialSalary", headerName: "Init. Salary", flex: 1 },
    { field: "maximumSalary", headerName: "Max. Salary", flex: 1 },
    { field: "salary", headerName: "Salary", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {canDelete && (
            <Tooltip title="Delete Pay Grade">
              <IconButton
                onClick={() => {
                  setPayGradeToDelete(params.row.id);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}

          {canEdit && (
            <Tooltip title="Edit Pay Grade">
              <IconButton onClick={() => handleEditPayGrade(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {cangetdetail && (
                  <Tooltip title="View Details">
                  <IconButton onClick={() => handleDetailsPayGrade(params.row.id)} color="inherit">
                    <ReadMoreIcon />
                  </IconButton>
                </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header  subtitle="Managing the pay grade list" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            rows={tenants.map((tenant) => ({
              ...tenant,
              id: tenant.id,
              jobGrades: jobGrades.find((jg) => jg.id === tenant.jobGradeId)?.jobGradeName,
            }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this pay grade?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePayGrade} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListPayGrade;
