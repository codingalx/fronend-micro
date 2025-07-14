import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
    listEmployee,
    getAllCourtCase,
} from "../../../Api/payrollApi";

const GetAllCourtCase = ({ refreshKey }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
    const [courtCase, setCourtCase] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const [allCourtCaseResponse, employeesResponse] = await Promise.all([
                getAllCourtCase(),
                listEmployee(tenantId),
            
            ]);

            const courtCases = allCourtCaseResponse.data.map(courtcase => ({
                ...courtcase,
                employeeId: getEmployeeId(courtcase.employeeId, employeesResponse.data),
            }));

            setCourtCase(courtCases);
            setEmployeeData(employeesResponse.data);
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    const getEmployeeId = (id, employees) => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? employee.employeeId : "Unknown";
    };

    const handleEditCourtCase = (id) => {
        navigate("/payroll/update_court_case", { state: { id } });
    };

    const handleDeleteCourtCase = (id) => {
        navigate("/payroll/delete_court_case", { state: { id } });
    };

    const columns = [
        { field: "receiverName", headerName: "Receiver Name", flex: 1 },
        { field: "bankName", headerName: "Bank Name", flex: 1 },
        { field: "bankBranch", headerName: "Bank Branch", flex: 1 },
        { field: "bankAccount", headerName: "Bank Account", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        { field: "appliedTo", headerName: "Applied To", flex: 1 },
        { field: "appliedFrom", headerName: "Applied From", flex: 1 },
        { field: "employeeId", headerName: "Employee ID", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="Delete court case">
                        <IconButton
                            onClick={() => handleDeleteCourtCase(params.row.id)}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Update court case">
                        <IconButton
                            onClick={() => handleEditCourtCase(params.row.id)}
                            color="primary"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header subtitle="List of court cases" />
            {error && <Typography color="error">{error}</Typography>}
            <Box m="40px 0 0 0" height="75vh">
                <DataGrid
                    rows={courtCase}
                    columns={columns}
                    getRowId={(row) => row.id}
                    checkboxSelection={false}
                />
            </Box>
        </Box>
    );
};

export default GetAllCourtCase;