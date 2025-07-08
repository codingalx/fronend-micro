import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { listCourseCategory, listCourseTraining, deleteTrainingCourses } from "../../../configuration/TrainingApi";
import LayoutForCourse from "./LayoutForCourse";
import { tokens } from "../common/theme";
import { canAccessResource } from '../../../configuration/SecurityService';
import TrainingServiceResourceName from '../../../configuration/TrainingServiceResourceName';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const ListTrainingCourse = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [error, setError] = useState(null);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const [courseCategory, setCourseCategory] = useState([]);
  const [courseTraining, setCourseTraining] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const editAccess = await canAccessResource(
          TrainingServiceResourceName.UPDATE_TRAINING_COURSE,
          userRoles
        );
        const deleteAccess = await canAccessResource(
          TrainingServiceResourceName.DELETE_TRAINING_COURSE,
          userRoles
        );

        setCanEdit(!editAccess );
        setCanDelete(!deleteAccess );
      } catch (err) {
        console.error("Error checking permissions:", err.message);
        setCanEdit(false);
        setCanDelete(false);
      }
    };

    fetchPermissions();
  }, [userRoles,refreshKey]);

  useEffect(() => {
    fetchCourseCategory();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCourseTrainings(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchCourseCategory = async () => {
    try {
      const response = await listCourseCategory(tenantId);
      setCourseCategory(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const fetchCourseTrainings = async (categoryId) => {
    try {
      const response = await listCourseTraining(tenantId, categoryId);
      const courseTrainingData = response.data.map((course) => ({
        ...course,
        categoryName: getCategoryName(course.courseCategoryId),
      }));
      setCourseTraining(courseTrainingData);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getCategoryName = (courseCategoryId) => {
    const category = courseCategory.find((cat) => cat.id === courseCategoryId);
    return category ? category.categoryName : "Unknown";
  };

  const handleDelete = (courseTraining) => {
    setSkillToDelete(courseTraining);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTrainingCourses(tenantId, skillToDelete.id);
      const updatedTrainingCourses = courseTraining.filter((course) => course.id !== skillToDelete.id);
      setCourseTraining(updatedTrainingCourses);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handleCourseTraining = (id) => {
    navigate('/training/updateTrainingCourse', { state: { id } });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

 



  const columns = [
    { field: "courseName", headerName: "Course Name", flex: 1 },
    { field: "categoryName", headerName: "Category Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Course">
              <IconButton onClick={() => handleDelete(params.row)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update">
              <IconButton
                onClick={() => handleCourseTraining(params.row.id)}
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
    <LayoutForCourse subtitle="List Of Courses">
   
      
      <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel id="category-select-label">Search Training by Category Course</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          label="Category"
        >
          {courseCategory.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DataGrid
        rows={courseTraining}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection={false}
      />

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutForCourse>
  );
};

export default ListTrainingCourse;

// import React, { useEffect, useState } from "react";
// import { Box, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, useTheme } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useNavigate } from "react-router-dom";
// import DeleteDialog from "../DeleteDialog";
// import { listCourseCategory, listCourseTraining, deleteTrainingCourses } from "../../../configuration/TrainingApi";
// import ToolbarComponent from "./ToolbarComponent";
// import LayoutForCourse from "./LayoutForCourse";
// import { tokens } from "../common/theme";
// import {canAccessResource} from '../../../configuration/SecurityService'
// import TrainingServiceResourceName from '../../../configuration/TrainingServiceResourceName'
// import { useAtom } from 'jotai';
// import { authAtom } from 'shell/authAtom';


// const ListTrainingCourse = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const navigate = useNavigate();
//   const [selectedCategoryId, setSelectedCategoryId] = useState('');
//   const [error, setError] = useState(null);
//     const [authState] = useAtom(authAtom); // Access the shared authentication state
//     const tenantId = authState.tenantId
//     const userRoles = authState.roles;


//   const [courseCategory, setCourseCategory] = useState([]);
//   const [courseTraining, setCourseTraining] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [skillToDelete, setSkillToDelete] = useState(null);


//   const [canEdit, setCanEdit] = useState(false);
//   const [canDelete, setCanDelete] = useState(false);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const editAccess = await canAccessResource(
//           TrainingServiceResourceName.UPDATE_TRAINING_COURSE,
//           userRoles
//         );
//         const deleteAccess = await canAccessResource(
//           TrainingServiceResourceName.DELETE_TRAINING_COURSE,
//           userRoles
//         );
 
  
//         setCanEdit(editAccess || false);
//         setCanDelete(deleteAccess || false);
//       } catch (err) {
//         console.error("Error checking permissions:", err.message);
//         // Fallback to false if there's an error
//         setCanEdit(false);
//         setCanDelete(false);
//       }
//     };
  
//     fetchPermissions();
//   }, [userRoles]); // Re-run if user roles change


//   useEffect(() => {
//     fetchCourseCategory();
//   }, []);

//   useEffect(() => {
//     if (selectedCategoryId) {
//       fetchCourseTrainings(selectedCategoryId);
//     }
//   }, [selectedCategoryId]);

//   const fetchCourseCategory = async () => {
//     try {
//       const response = await listCourseCategory(tenantId);
//       setCourseCategory(response.data);
//     } catch (error) {
//       setError(error.message);
//       console.error(error.message);
//     }
//   };

//   const fetchCourseTrainings = async (categoryId) => {
//     try {
//       const response = await listCourseTraining(tenantId,categoryId);
//       const courseTrainingData = response.data.map((course) => ({
//         ...course,
//         categoryName: getCategoryName(course.courseCategoryId)
//       }));
//       setCourseTraining(courseTrainingData);
//     } catch (error) {
//       setError(error.message);
//       console.error(error.message);
//     }
//   };

//   const getCategoryName = (courseCategoryId) => {
//     const category = courseCategory.find((cat) => cat.id === courseCategoryId);
//     return category ? category.categoryName : "Unknown";
//   };

//   const handleDelete = (courseTraining) => {
//     setSkillToDelete(courseTraining);
//     setOpenDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await deleteTrainingCourses(tenantId,skillToDelete.id);
//       const updatedTrainingCourses = courseTraining.filter((course) => course.id !== skillToDelete.id);
//       setCourseTraining(updatedTrainingCourses);
//     } catch (error) {
//       setError(error.message);
//       console.error(error.message);
//     } finally {
//       setOpenDialog(false);
//     }
//   };

//   const handleCancelDelete = () => {
//     setOpenDialog(false);
//   };

//   const handleCourseTraining = (id) => {
//     navigate('/training/updateTrainingCourse', { state: { id } });
//   };

//   const handleCategoryChange = (event) => {
//     setSelectedCategoryId(event.target.value);
//   };

//   const handleIconClick = () => {
//     navigate('/training/trainingCourse');
//   };

//   const refreshPage = () => {
//     window.location.reload();
//   };

//   const columns = [
//     { field: "courseName", headerName: "Course Name", flex: 1 },
//     { field: "categoryName", headerName: "Category Name", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 150,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//          {canDelete && 
//           <Tooltip title="Delete Course">
//             <IconButton onClick={() => handleDelete(params.row)} color="error">
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         }
//             {canEdit &&
          
//           <Tooltip title="Update">
//             <IconButton
//               onClick={() => handleCourseTraining(params.row.id)}
//               color="primary"
//             >
//               <EditIcon />
//             </IconButton>
//           </Tooltip>
//             }
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <LayoutForCourse subtitle="List Of Courses">
//       <ToolbarComponent mainIconType="add" onMainIconClick={handleIconClick} refreshPage={refreshPage} />
      
//       <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
//         <InputLabel id="category-select-label">Search Training by Category Course</InputLabel>
//         <Select
//           labelId="category-select-label"
//           id="category-select"
//           value={selectedCategoryId}
//           onChange={handleCategoryChange}
//           label="Category"
//         >
//           {courseCategory.map((category) => (
//             <MenuItem key={category.id} value={category.id}>
//               {category.categoryName}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <DataGrid
//         rows={courseTraining}
//         columns={columns}
//         getRowId={(row) => row.id}
//         checkboxSelection={false}
//       />
//       <DeleteDialog
//         open={openDialog}
//         onClose={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//         message="Are you sure you want to delete this course?"
//       />
//     </LayoutForCourse>
//   );
// };

// export default ListTrainingCourse;






