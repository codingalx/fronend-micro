
import React, { useEffect, useState } from "react";
import { Box, Tooltip, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import {  listInternshipPayments } from "../../../configuration/TrainingApi";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { canAccessResource } from "../../../configuration/SecurityService";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const ListInternshipPayment = ({ refreshKey }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [internPayment, setInternPayment] = useState([]);
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId
    const userRoles = authState.roles;
    


    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [internPaymentToDelete, setInternPaymentToDelete] = useState(null);


    const handleEditInternshipPayement = ( id) => {
        navigate('/training/updateInternPayement', { state: { id } });
    };

    useEffect(() => {
        fetchAllInternPayment();
        checkPermissions();
    }, [refreshKey]);

    const fetchAllInternPayment = async () => {
        try {
            const response = await listInternshipPayments(tenantId);
            const data = response.data;
            setInternPayment(data);
            console.log(data);
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    


    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

  
    const checkPermissions = async () => {
      // Check permissions for actions
      const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_INTERNSHIP_PAYMENT &&
        TrainingServiceResourceName.GET_INTERNSHIP_PAYMENT_BY_ID,
        userRoles);
  
      const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_INTERNSHIP_PAYMENT 
        , userRoles);
    
      setCanEdit(!editAccess);
      setCanDelete(!deleteAccess);
    };



    const columns = [

        { field: "startDate", headerName: "Start Date", flex: 1, cellClassName: "name-column--cell" },
        { field: "endDate", headerName: "End Date", flex: 1, cellClassName: "name-column--cell" },
        { field: "paymentAmount", headerName: "paymentAmount", flex: 1, cellClassName: "name-column--cell" },
        { field: "referenceLetter", headerName: "referenceLetter", flex: 1, cellClassName: "name-column--cell" },

        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

            {canDelete && (
                  <Tooltip title="Delete Intern Payment ">
                  <IconButton onClick={() => navigate("/training/deleteIntenpayment", { state: { paymentId: params.row.id } })} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
            )} 

            {canEdit && (
                     <Tooltip title="Update">
                     <IconButton
                         onClick={() => handleEditInternshipPayement( params.row.id)}
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

            <Header subtitle="Intern Payment Action" />
            <Box m="40px 0 0 0" height="75vh">
                <DataGrid
                    rows={internPayment}
                    columns={columns}
                    getRowId={(row) => row.id}
                    checkboxSelection={false}
                />
            </Box>
            {/* <DeleteDialog
                open={openDialog}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this Intern Payment"
            /> */}
        </Box>
    );
};

export default ListInternshipPayment;

