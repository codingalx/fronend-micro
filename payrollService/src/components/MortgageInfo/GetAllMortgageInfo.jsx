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
    getAllpayMortgageInfos,
    listEmployee,
} from "../../../Api/payrollApi";

const GetAllMortgageInfo = ({ refreshKey }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
    const [mortage, setMortage] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const [allMortageResponse, employeesResponse] = await Promise.all([
                getAllpayMortgageInfos(),
                listEmployee(tenantId),
            ]);

            const mortages = allMortageResponse.data.map(mortage => ({
                ...mortage,
                employeeId: getEmployeeId(mortage.employeeId, employeesResponse.data),
            }));

            setMortage(mortages);
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

    const handleEditMortage = (id) => {
        navigate("/payroll/update_mortgage-infos", { state: { id } });
    };

    const handleDeleteMortage = (id) => {
        navigate("/payroll/delete_mortgage-infos", { state: { id } });
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
                    <Tooltip title="Delete Mortage info">
                        <IconButton
                            onClick={() => handleDeleteMortage(params.row.id)}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Update mortage info">
                        <IconButton
                            onClick={() => handleEditMortage(params.row.id)}
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
            <Header subtitle="List of mortage information" />
            {error && <Typography color="error">{error}</Typography>}
            <Box m="40px 0 0 0" height="75vh">
                <DataGrid
                    rows={mortage}
                    columns={columns}
                    getRowId={(row) => row.id}
                    checkboxSelection={false}
                />
            </Box>
        </Box>
    );
};

export default GetAllMortgageInfo;