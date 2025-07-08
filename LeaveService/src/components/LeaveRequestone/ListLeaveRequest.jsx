import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState, useContext } from "react";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../../configuration/SecurityService";
import { getAllbudgetYears, getAllLeaveType, getAllLeaveRequest } from "../../../configuration/LeaveApi";
import LeaveServiceResourceName from "../../../configuration/LeaveServiceResourceName";
import CancelIcon from '@mui/icons-material/Cancel';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const ListLeaveRequest = ({refreshKey}) => {
    const navigate = useNavigate();
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId
    const userRoles = authState.roles;

    const [accessDenied, setAccessDenied] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [canApprovedepaerement, setCanApprovedepaerement] = useState(false);
    const [canApprovehr, setCanApprovehr] = useState(false);


    const [leaveRequest, setLeaveRequest] = useState([]);

    canApprovehr
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllLeaveRequest();
        checkPermissions();
    }, [refreshKey]);

    const fetchAllLeaveRequest = async () => {
        try {
            const [leaveRequestResponse, leaveTypeResponse, budgetYearResponse] = await Promise.all([
                getAllLeaveRequest(tenantId),
                getAllLeaveType(tenantId),
                getAllbudgetYears(tenantId),
            ]);

            const leaveRequestData = leaveRequestResponse.data;
            const leaveTypedata = leaveTypeResponse.data;
            const budgetYearData = budgetYearResponse.data;

            const mappedData = leaveRequestData.map((request) => ({
                ...request,
                leaveTypeName: getgetJob(request.leaveTypeId, leaveTypedata),
                budgetYear: getBudgetYear(request.budgetYearId, budgetYearData),

            }));

            setLeaveRequest(mappedData);
            showNotification("analsisi  fetched successfully!", "success");
        } catch (error) {
            setError(error.message);
            showNotification("Failed to fetch leaveRequest. Please try again.", "error");
        }
    };


    const getgetJob = (leaveTypeId, leaveTypes) => {
        const leaveType = leaveTypes.find((leavetype) => leavetype.id === leaveTypeId);
        return leaveType ? leaveType.leaveTypeName : "Unknown";
    };





    const getBudgetYear = (budgetYearId, budgetYears) => {
        const budgetYear = budgetYears.find((year) => year.id === budgetYearId);
        return budgetYear ? budgetYear.budgetYear : "Unknown";
    };

    const showNotification = (message, severity) => {
        setNotification({ open: true, message, severity });
    };



    const HandleLeaveRequest = (id) => {
        navigate("/editleaverequest", { state: { id } });
    };
    const handleLeaveRequestDepartementApprove = (id) => {
        navigate('/departement_Approvance', { state: { id } });
    };

    const handleLeaveRequestHrApprove = (id) => {
        navigate('/hr_Approvance', { state: { id } });
    };

    

    const checkPermissions = async () => {
        setCanEdit(await canAccessResource(LeaveServiceResourceName.UPDATE_LEAVE_REQUEST, userRoles));

        setCanDelete(await canAccessResource(LeaveServiceResourceName.DELETE_LEAVE_REQUEST, userRoles));

        setCanApprovedepaerement(await canAccessResource(LeaveServiceResourceName.DEPARTMENT_APPROVE_LEAVE_REQUEST, userRoles));

        setCanApprovehr(await canAccessResource(LeaveServiceResourceName.HR_APPROVE_LEAVE_REQUEST, userRoles));
    };


    const columns = [

        { field: "numberOfDays", headerName: "numberOfDays", flex: 1 },
        { field: "leaveStart", headerName: "leaveStart", flex: 1 },
        { field: "numberOfApprovedDays", headerName: "numberOfApprovedDays", flex: 1 },
        { field: "description", headerName: "description", flex: 1 },
        { field: "day", headerName: "day", flex: 1 },

        { field: "leaveTypeName", headerName: "leaveTypeName", flex: 1 },
        { field: "budgetYear", headerName: "Budget Year", flex: 1 },
        {
            field: "actions",
            headerName: "Actions ",
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {canDelete && (
                        <Tooltip title="Delete Leave Request">
                            <IconButton onClick={() => navigate("/deleteLeaveRequest", { state: { id: params.row.id } })} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {canEdit && params.row.departmentDecision === 'PENDING'&& (
                        <Tooltip title="Update Leave Request">
                            <IconButton onClick={() => HandleLeaveRequest(params.row.id)} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {canApprovedepaerement && params.row.departmentDecision === 'PENDING' && (
                        <Tooltip title="This Leave Request is Pending for departement decision">
                            <IconButton onClick={() => handleLeaveRequestDepartementApprove(params.row.id)}>
                                <HourglassEmptyIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {canApprovehr && params.row.departmentDecision === 'APPROVED'&&params.row.hrDecision === 'PENDING' && (
                        <Tooltip title="This Leave Request is Pending for hr decision">
                            <IconButton onClick={() => handleLeaveRequestHrApprove(params.row.id)}>
                                <HourglassEmptyIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {params.row.departmentDecision === 'REJECTED' && (
                        <Tooltip title="This LeaveRequest Rejected Your departement">
                            <IconButton>
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    )}


                </Box>
            ),
        },
    ];


    return (
        <Box m="20px">
            <Box m="40px 0 0 0" height="75vh">
                <DataGrid
                    rows={leaveRequest}
                    columns={columns}
                    getRowId={(row) => row.id}
                    checkboxSelection={false}
                />
            </Box>

        </Box>
    );
};


export default ListLeaveRequest;
