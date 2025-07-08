
import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { getAllFixedAsset } from "../../Api/fixedAssetService";




const GetAllFixedAsset = ({ refreshKey }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
    const [allFixedAssets, setAllFixedAssets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllFixedassets();
    }, [refreshKey]);

    const fetchAllFixedassets = async () => {
        try {
            const response = await getAllFixedAsset(tenantId);
            setAllFixedAssets(response.data);
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    const handleEditFixedAsset = (id) => {
        navigate('/asset/update_fixed_asset', { state: { id } });
    };

    const handleDeleteFixedAsset = (id, name) => {
        navigate('/asset/delete_fixed_asset', { state: { id, } });
    };




    const columns = [
        { field: "farNo", headerName: "farNo", flex: 1 },
        { field: "deliveryStatus", headerName: "deliveryStatus", flex: 1 },
        { field: "systemNumber", headerName: "systemNumber", flex: 1 },
        { field: "warrantyMonths", headerName: "warrantyMonths", flex: 1 },
        { field: "accountNumber", headerName: "accountNumber", flex: 1 },
        { field: "itemType", headerName: "itemType", flex: 1 },
        { field: "revaluationCost", headerName: "revaluationCost", flex: 1 },
        { field: "srId", headerName: "srId", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>


                    <Tooltip title="Delete fixed asset">
                        <IconButton
                            onClick={() => handleDeleteFixedAsset(params.row.id, params.row.name)}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>




                    <Tooltip title="Update fixed asset">
                        <IconButton
                            onClick={() => handleEditFixedAsset(params.row.id)}
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
            <Header subtitle="List Of Fixed aasets" />
            <Box m="40px 0 0 0" height="75vh">
                <DataGrid
                    rows={allFixedAssets}
                    columns={columns}
                    getRowId={(row) => row.id}
                    checkboxSelection={false}
                />
            </Box>
        </Box>
    );
};

export default GetAllFixedAsset;