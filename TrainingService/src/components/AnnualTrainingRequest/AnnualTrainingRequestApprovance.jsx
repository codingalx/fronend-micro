import {
    Box,
    Button,
    TextField,
    Grid,
    FormControl, InputLabel, Select, MenuItem, FormHelperText
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {  getAnnualTrainingById, listOfBudgetYears, trainingRequestStatus } from "../../../configuration/TrainingApi";
import LayoutForCourse from '../TrainingCourse/LayoutForCourse' 
import ToolbarComponent from '../common/ToolbarComponent'
import Header from '../common/Header'
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";




const AnnualTrainingRequestApprovance = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const [allbudgetYearList, setAllbudgeYeartList] = useState([]);
    const [allCourseCategory, setallCourseCategory] = useState([]);
    const [allTrainingCourse, setallTrainingCourse] = useState([]);
    const [allTrainingInstution, setallTrainingInstution] = useState([]);
    const location = useLocation();
    const { trainingCourseId } = location.state;
    const trainingId = location?.state?.id
 
    const [openDialog, setOpenDialog] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);


    const [annualTrainingRequest, setAnnualTrainingRequest] = useState({
        budgetYearId: "",
        courseCategoryId: "",
       trainingCourseId: "",
        trainingInstitutionId: "",
        departmentId: 1,
        trainingType: "",
        trainingLocation: "",
        numberOfParticipants: "",
        numberOfDays: "",
        startDate: "",
        endDate: "",
        costPerPerson: "",
        sponsoredBy: "",
        reason: "",
        venue: "",
        remark: "",
        decision: ""
    });





    useEffect(() => {
        fetchBudgetYears();
        fetchCourseCategory();
        fetchTrainingCourse();
        fetchTrainingInstution();
    }, []);


    const fetchBudgetYears = async () => {
        try {
           
            await listOfBudgetYears()
            setAllbudgeYeartList(response.data);
            console.log("The list of budget year:", response.data);
        } catch (error) {
            console.error("Error fetching budget years:", error);
        }
    };


    const fetchCourseCategory = async () => {
        try {
            const response = await axios.get(`${REST_API_BASE_URL}course-categories/1/get-all`);
            setallCourseCategory(response.data);

            console.log("The list of course category:", response.data);
        } catch (error) {
            console.error("Error fetching Course category:", error);
        }
    };

    const fetchTrainingCourse = async (courseCategoryId) => {

        if (!courseCategoryId) {
            console.warn("Invalid courseCategoryId provided");
            return;
        }

        try {
            const response = await axios.get(`${REST_API_BASE_URL}training-courses/1/get-all/${courseCategoryId}`);
            setallTrainingCourse(response.data);
            console.log("The list of training courses:", response.data);
        } catch (error) {
            console.error("Error fetching training courses:", error);
        }
    };

    const getCourseTrainingById = async () => {
        try {
            const response = getCourseTrainingById(trainingCourseId);
            setallTrainingCourse(response.data);
            console.log("the fetched training course is:", response.data);
        } catch (error) {
            console.error("Error fetching Course category:", error);
        }
    };


    const fetchTrainingInstution = async () => {
        try {
            const response = await axios.get(`${REST_API_BASE_URL}training-institutions/1/get-all`);
            setallTrainingInstution(response.data);
            console.log("The list of Training Instution:", response.data);
        } catch (error) {
            console.error("Error fetching Course category:", error);
        }
    };
    const handleIconClick = () => {
        navigate('/training/listAnnualTrainingRequest');

    };

    const refreshPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchAnnualTrainingRequestById();
    }, []);

    const fetchAnnualTrainingRequestById = async () => {
        try {
            const response = await getAnnualTrainingById(trainingId);
            const data = response.data;
            //  data.trainingType = data.trainingType.toUpperCase();
            data.trainingLocation = data.trainingLocation.toUpperCase();


            setAnnualTrainingRequest(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch language:", error.message);
        }
    };


    const handleCourseFormSubmit = async (values, { resetForm }) => {
        try {

            const response = await trainingRequestStatus(trainingId, values);
            console.log("Update response:", response);
            if (response.status === 200) {
                console.log("Course updated successfully!");

                resetForm();

                // Navigate to the list page with the selected category ID
                //  navigate(`/training/listTrainingCourse?categoryId=${values.courseCategoryId}`);

            } else {
                console.error("Failed to update course: Unexpected response status", response.status);
            }
        } catch (error) {
            console.error("Failed to update course:", error);
        }
    };


    const checkoutSchema = yup.object().shape({
        decision: yup.number().required("decisionis required"),
      
       
    });


    return (
        <LayoutForCourse>
            <ToolbarComponent
                mainIconType="search"
                onMainIconClick={handleIconClick}
                refreshPage={refreshPage}
            />
            <Header subtitle="Create Training Request" />


            <Formik
                onSubmit={handleCourseFormSubmit}
                initialValues={annualTrainingRequest}
                validationSchema={checkoutSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    resetForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <FormControl
                                sx={{ gridColumn: "span 2" }}
                                error={!!touched.budgetYearId && !!errors.budgetYearId}
                            >
                                <InputLabel id="language-label">Select Budget Year</InputLabel>
                                <Select
                                    labelId="language-label"
                                    value={values.budgetYearId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="budgetYearId"
                                    disabled
                                >
                                    <MenuItem value="">
                                        <em>Select Budget Year</em>
                                    </MenuItem>
                                    {allbudgetYearList.map((budget) => (
                                        <MenuItem key={budget.id} value={budget.id}>
                                            {budget.budgetYear}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.budgetYearId && errors.budgetYearId && (
                                    <FormHelperText>{errors.budgetYearId}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControl
                                sx={{ gridColumn: "span 2" }}
                                error={!!touched.courseCategoryId && !!errors.courseCategoryId}
                            >
                                <InputLabel id="coursecategory-label">Select Course Category</InputLabel>
                                <Select
                                    labelId="courseCategory-label"
                                    value={values.courseCategoryId}
                                    onChange={async (e) => {
                                        const selectedCategoryId = e.target.value;
                                        handleChange(e);
                                        if (selectedCategoryId) {
                                            await fetchTrainingCourse(selectedCategoryId);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    name="courseCategoryId"
                                    disabled
                                >
                                    <MenuItem value="">
                                        <em>Select Course Category</em>
                                    </MenuItem>
                                    {allCourseCategory.map((courseCategory) => (
                                        <MenuItem key={courseCategory.id} value={courseCategory.id}>
                                            {courseCategory.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.courseCategoryId && errors.courseCategoryId && (
                                    <FormHelperText>{errors.courseCategoryId}</FormHelperText>
                                )}
                            </FormControl>



                            <FormControl
                                sx={{ gridColumn: "span 2" }}
                                error={!!touched.trainingCourseId && !!errors.trainingCourseId}
                            >
                                <InputLabel id="trainingCourse-label">Select Training Course</InputLabel>
                                <Select
                                    labelId="trainingCourse-label"
                                    value={values.trainingCourseId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="trainingCourseId"
                                    disabled
                                >
                                    <MenuItem value="">
                                        <em>Select Training Course</em>
                                    </MenuItem>
                                    {allTrainingCourse.length > 0 ? (
                                        allTrainingCourse.map((courseTraining) => (
                                            <MenuItem key={courseTraining.id} value={courseTraining.id}>
                                                {courseTraining.courseName}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No training courses available</MenuItem>
                                    )}
                                </Select>
                                {touched.trainingCourseId && errors.trainingCourseId && (
                                    <FormHelperText>{errors.trainingCourseId}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                sx={{ gridColumn: "span 2" }}
                                error={!!touched.trainingInstitutionId && !!errors.trainingInstitutionId}
                            >
                                <InputLabel id="trainingInstution-label">Select Training Instution</InputLabel>
                                <Select
                                    labelId="trainingInstution-label"
                                    value={values.trainingInstitutionId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="trainingInstitutionId"
                                    disabled
                                >
                                    <MenuItem value="">
                                        <em>Select Training Instution</em>
                                    </MenuItem>
                                    {allTrainingInstution.map((trainingInstution) => (
                                        <MenuItem key={trainingInstution.id} value={trainingInstution.id}>
                                            {trainingInstution.institutionName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.trainingInstitutionId && errors.trainingInstitutionId && (
                                    <FormHelperText>{errors.trainingInstitutionId}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                                <InputLabel>Please Select Training Type</InputLabel>
                                <Select
                                    label="trainingType"
                                    value={values.trainingType}

                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    required
                                    displayEmpty
                                    inputProps={{ "aria-label": "training Type" }}
                                    name="trainingType"
                                    error={!!touched.trainingType && !!errors.trainingType}
                                    sx={{ gridColumn: "span 2" }}
                                    disabled
                                >
                                    <MenuItem value="Annual Training">Annual Training</MenuItem>
                                    <MenuItem value="Unplanned Training">Unplanned Training</MenuItem>

                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                                <InputLabel>Please Select Training Location</InputLabel>
                                <Select
                                    label="trainingLocation"
                                    value={values.trainingLocation}

                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    required
                                    displayEmpty
                                    inputProps={{ "aria-label": "Training Location" }}
                                    name="trainingLocation"
                                    error={!!touched.trainingLocation && !!errors.trainingLocation}
                                    sx={{ gridColumn: "span 2" }}
                                    disabled
                                >
                                    <MenuItem value="LOCAL">Local</MenuItem>
                                    <MenuItem value="ABROAD">Abroad</MenuItem>

                                </Select>
                            </FormControl>



                            <TextField
                                fullWidth
                                type="number"
                                label="Cost Per Person"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.costPerPerson}
                                name="costPerPerson"
                                error={!!touched.costPerPerson && !!errors.costPerPerson}
                                helperText={touched.costPerPerson && errors.costPerPerson}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                disabled
                            />

                            <TextField
                                fullWidth
                                type="text"
                                label="Number Of Participants"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.numberOfParticipants}
                                name="numberOfParticipants"
                                error={!!touched.numberOfParticipants && !!errors.numberOfParticipants}
                                helperText={touched.numberOfParticipants && errors.numberOfParticipants}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                fullWidth
                                type="numberOfDays"
                                label="Number Of Days"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.numberOfDays}
                                name="numberOfDays"
                                error={!!touched.numberOfDays && !!errors.numberOfDays}
                                helperText={touched.numberOfDays && errors.numberOfDays}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                fullWidth
                                type="text"
                                label="sponsoredBy"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.sponsoredBy}
                                name="sponsoredBy"
                                error={!!touched.sponsoredBy && !!errors.sponsoredBy}
                                helperText={touched.sponsoredBy && errors.sponsoredBy}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                fullWidth
                                type="text"
                                label="reason"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.reason}
                                name="reason"
                                error={!!touched.reason && !!errors.reason}
                                helperText={touched.reason && errors.reason}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                fullWidth
                                type="text"
                                label="venue"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.venue}
                                name="venue"
                                error={!!touched.venue && !!errors.venue}
                                helperText={touched.venue && errors.venue}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                fullWidth
                                type="text"
                                label="Remark"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.remark}
                                name="remark"
                                error={!!touched.remark && !!errors.remark}
                                helperText={touched.remark && errors.remark}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <FormControl
                                fullWidth
                                sx={{ gridColumn: "span 2" }}
                                error={!!touched.decision && !!errors.decision}
                            >
                                <InputLabel id="decision-label">Decision</InputLabel>
                                <Select
                                    labelId="decision-label"
                                    value={values.decision}

                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    displayEmpty
                                    inputProps={{ "aria-label": "Decision" }}
                                    name="decision"
                                    error={!!touched.decision && !!errors.decision}
                                    helperText={touched.decision && errors.decision}
                                >
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="APPROVED">Approved</MenuItem>
                                    <MenuItem value="REJECTED">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.startDate}
                                name="startDate"
                                error={!!touched.startDate && !!errors.startDate}
                                helperText={touched.startDate && errors.startDate}
                                sx={{ gridColumn: "span 2" }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                fullWidth

                                type="date"
                                label="End Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.endDate}
                                name="endDate"
                                error={!!touched.endDate && !!errors.endDate}
                                helperText={touched.endDate && errors.endDate}
                                sx={{ gridColumn: "span 2" }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}

                            />



                        </Box>
                        <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16, marginTop: 8 }}>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Approvance
                                </Button>
                            </Grid>

                        </Grid>
                    </form>
                )}
            </Formik>

        </LayoutForCourse>

    );
};

export default AnnualTrainingRequestApprovance;
