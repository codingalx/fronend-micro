import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { budgetYearEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const DetailsBudgetYear = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    budgetYear: "",
    description: "",
    isActive: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = budgetYearEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        console.log("data", data);
        setInitialValues({
          budgetYear: data.budgetYear || "",
          description: data.description || "",
          isActive: data.active === true ? true : false,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the holidays!");
      }
    };

    fetchData();
  }, [id]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        title="DETAILS OF BUDGET YEAR"
        subtitle="Details of an existing budget year profile"
      />

      <Formik enableReinitialize initialValues={initialValues}>
        {({ values }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              <TextField
                fullWidth
                label="Budget Year Name"
                type="text"
                id="budgetYear"
                name="budgetYear"
                value={values.budgetYear}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                label="Budget Year Description"
                multiline
                rows={5}
                value={values.description}
                name="description"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 4" }}
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isActive}
                      name="isActive"
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Active Year
                      {values.isActive && <span> ✔ </span>}
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
        
              <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/add_Leave_Info`,{ state: { activeTab: 0 } })}
                
              >
                Cancel
              </Button>
            </Box>
            
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default DetailsBudgetYear;
