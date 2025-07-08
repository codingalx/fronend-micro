import { 
  getTenantById, 
  getOrganizationResourceByName, 
  getEmployeeResourceByName,
  getRecruitmentResourceByName,
  getPlanningResourceByName,
  getLeaveResourceByName, 
  getTrainingResourceByName,
  getUserResourceByName,
  getEvaluationResourceByName,
  getDelegationResourceByName,
  getDocumentResourceByName,
  getPromotionResourceByName,
  getSeparationResourceByName,
  getTransferResourceByName,
  getComplaintResourceByName,
  getDisciplineResourceByName,
  getAttendanceResourceByName,
  getItemResourceByName,
  getStoreResourceByName,
  getStoreMovementResourceByName,
  getFixedAssetResourceByName
} from "./securityApi";

export const canAccessResource = async (resourceName, userRoles, apiName) => {
  if (!resourceName || !apiName) {
    return false; // Return false if resourceName or apiName is not provided
  }

  try {
    // Fetch tenant information
    const tenantResponse = await getTenantById();
    if (!tenantResponse) {
      return false; // Tenant not found
    }

    const tenant = tenantResponse.data;
    const abbreviatedName = tenant.abbreviatedName;

    let resourceResponse;
    
    // Determine which API to call based on the apiName parameter
    switch (apiName) {
      case 'employee':
        resourceResponse = await getEmployeeResourceByName(resourceName);
        break;
      case 'recruitment':
        resourceResponse = await getRecruitmentResourceByName(resourceName);
        break;
      case 'planning':
        resourceResponse = await getPlanningResourceByName(resourceName);
        break;
      case 'organization':
        resourceResponse = await getOrganizationResourceByName(resourceName);
        break;
      case 'leave':
        resourceResponse = await getLeaveResourceByName(resourceName);
        break;
      case 'training':
        resourceResponse = await getTrainingResourceByName(resourceName);
        break;
      case 'user':
        resourceResponse = await getUserResourceByName(resourceName);
        break;
      case 'evaluation':
        resourceResponse = await getEvaluationResourceByName(resourceName);
        break;
      case 'delegation':
        resourceResponse = await getDelegationResourceByName(resourceName);
        break;

      case 'document':
        resourceResponse = await getDocumentResourceByName(resourceName);
        break;

      case 'promotion':
        resourceResponse = await getPromotionResourceByName(resourceName);
        break;
      
      case 'separation':
        resourceResponse = await getSeparationResourceByName(resourceName);
        break;

      case 'transfer':
         resourceResponse = await getTransferResourceByName(resourceName);
          break;
      case 'discipline':
            resourceResponse = await getDisciplineResourceByName(resourceName);
             break;
      case 'complaint':
            resourceResponse = await getComplaintResourceByName(resourceName);
              break;
      case 'attendance':
            resourceResponse = await getAttendanceResourceByName(resourceName);
              break;
      
       case 'item':
            resourceResponse = await getItemResourceByName(resourceName);
              break;
     
               case 'store':
            resourceResponse = await getStoreResourceByName(resourceName);
              break;

              
               case 'storeMovement':
            resourceResponse = await getStoreMovementResourceByName(resourceName);
              break;

                   
               case 'fixedAsset':
            resourceResponse = await getFixedAssetResourceByName(resourceName);
              break;

      default:
        console.error("Unknown API name:", apiName);
        return false; // Return false for unknown API names
    }

    const resource = resourceResponse.data;

    // Check if the resource is active
    if (resource.status !== "ACTIVE") {
      return false; // Resource is not active
    }

    // Construct required roles
    const requiredRoles = resource.requiredRoles.map(
      (role) => `${abbreviatedName.toLowerCase()}_${role}`
    );

    // Check if user has access
    return requiredRoles.some((role) => userRoles.includes(role));
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return false; // Forbidden access
    }

    console.error("An unexpected error occurred:", error);
    return false; // Handle any unexpected errors
  }
};


// import { 
//   getTenantById, 
//   getOrganizationResourceByName, 
//   getEmployeeResourceByName,
//   getRecruitmentResourceByName,
//   getPlanningResourceByName,
//   getLeaveResourceByName, 
//   getTrainingResourceByName,
//   getUserResourceByName,
//   getEvaluationResourceByName,
//   getDelegationResourceByName,
//   getDocumentResourceByName,
//   getPromotionResourceByName} from "./securityApi";

// export const canAccessResource = async (resourceName, userRoles, apiName) => {
//   try {
//     // Fetch tenant information
//     const tenantResponse = await getTenantById();
//     if (!tenantResponse) {
//       return false; // Tenant not found
//     }

//     const tenant = tenantResponse.data;
//     const abbreviatedName = tenant.abbreviatedName;

//     let resourceResponse;
//     let resource;

//     // Determine which API to call based on the apiName parameter
//     switch (apiName) {
//       case 'employee':
//         resourceResponse = await getEmployeeResourceByName(resourceName);
//         break;

//         case 'recruitment':
//           resourceResponse = await getRecruitmentResourceByName(resourceName);
//           break;

//         case 'planning':
//           resourceResponse = await getPlanningResourceByName(resourceName);
//           break;

//           case 'organization':
//             resourceResponse = await getOrganizationResourceByName(resourceName);
//             break;

//            case 'leave':
//               resourceResponse = await getLeaveResourceByName(resourceName);
//               break;

//               case 'training':
//                 resourceResponse = await getTrainingResourceByName(resourceName);
//                 break;

//                 case 'user':
//                   resourceResponse = await getUserResourceByName(resourceName);
//                   break;
                
//                   case 'evaluation':
//                     resourceResponse = await getEvaluationResourceByName(resourceName);
//                     break;

//                 case 'delegation':
//                       resourceResponse = await getDelegationResourceByName(resourceName);
//                       break;
                      
//                 case 'document':
//                   resourceResponse = await getDocumentResourceByName(resourceName);
//                   break;
//                   case 'promotion':
//                   resourceResponse = await getPromotionResourceByName(resourceName);
//                   break;


                  



                  
                
              
//       default:
//         throw new Error("Unknown API name");
//     }

//     resource = resourceResponse.data;

//     // Check if the resource is active
//     if (resource.status !== "ACTIVE") {
//       return false; // Resource is not active
//     }

//     // Construct required roles
//     const requiredRoles = resource.requiredRoles.map(
//       (role) => `${abbreviatedName.toLowerCase()}_${role}`
//     );

//     // Check if user has access
//     return requiredRoles.some((role) => userRoles.includes(role));
//   } catch (error) {
//     if (error.response && error.response.status === 403) {
//       return false; // Forbidden access
//     }

//     console.error("An unexpected error occurred:", error);
//     return false; // Handle any unexpected errors
//   }
// };
