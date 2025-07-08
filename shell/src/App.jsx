import { DashboardLayout } from "insa_react_ui";
import React, { useContext, useEffect, useState } from "react";
import { navItems } from "../config/navItems";
import { Outlet } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "./components/Security/AuthContext";
import { canAccessResource } from "./components/Security/canAccessResource";

const App = () => {
  const { authState, logout } = useContext(AuthContext);
  const { tenantId, roles } = authState;
  const [filteredNavItems, setFilteredNavItems] = useState([]);
  const navigate = useNavigate();

  const getUserName = () => localStorage.getItem("username");
  const username = getUserName();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleresetPassWord = () => {
    navigate("/reset_password");
  };

  useEffect(() => {
    const ADD_TENANT_RESOURCES = [
      "Add Tenant",
      "Get All Tenants",
      "Get Tenant Details",
      "Download Tenant logo",
      "Update Tenant",
      "Delete Tenant",
    ];

    const filterSubMenu = async (subMenu) => {
      const filteredSubMenu = await Promise.all(
        subMenu.map(async (subItem) => {
          // Exclude for admin users if applicable
          if (
            username &&
            username.toLowerCase().includes(".admin") &&
            [
              "Get Employee by Employee ID",
              "Get All Languages",
              "Add Recruitment",
              "Get Employee Leave Balance",
              "Add Leave Schedule",
              "Add Leave Request",
              "Add Transfer Request",
              "Add Discipline",
              "Get Discipline by Offender Id",
              "Update Complaint",
              "Get Complaint Handling By Department Id"
            ].includes(subItem.resourceName)
          ) {
            return null;
          }

          // Handle resource access check
          if (subItem.resourceName) {
            const hasAccess = 
              !tenantId && ADD_TENANT_RESOURCES.includes(subItem.resourceName)
                ? true // Allow ADD_TENANT_RESOURCES if no tenantId
                : await canAccessResource(subItem.resourceName, roles, subItem.apiName);

            if (!hasAccess) return null;
          }

          // Check nested submenus
          if (subItem.subMenu && subItem.subMenu.length > 0) {
            const accessibleSubMenu = await filterSubMenu(subItem.subMenu);
            return accessibleSubMenu.length > 0
              ? { ...subItem, subMenu: accessibleSubMenu }
              : null;
          }

          return subItem;
        })
      );

      return filteredSubMenu.filter(Boolean);
    };

    const filterNavItems = async () => {
      const filteredItems = await Promise.all(
        navItems.map(async (item) => {
          // Allow admin to see tenant resources if tenantId does not exist
          if (!tenantId && username && username.toLowerCase().includes(".admin") && ADD_TENANT_RESOURCES.includes(item.resourceName)) {
            return item; // Include item for admin
          }

          // Skip resources related to tenants if tenantId exists
          if (tenantId && ADD_TENANT_RESOURCES.includes(item.resourceName)) {
            return null;
          }

          // Handle resource access check
          if (item.resourceName) {
            const hasAccess = 
              !tenantId && ADD_TENANT_RESOURCES.includes(item.resourceName)
                ? true // Allow ADD_TENANT_RESOURCES if no tenantId
                : await canAccessResource(item.resourceName, roles, item.apiName);

            if (!hasAccess) return null;
          }

          // Check nested submenus
          if (item.subMenu && item.subMenu.length > 0) {
            const accessibleSubMenu = await filterSubMenu(item.subMenu);
            return accessibleSubMenu.length > 0
              ? { ...item, subMenu: accessibleSubMenu }
              : null;
          }

          return item;
        })
      );

      setFilteredNavItems(filteredItems.filter(Boolean));
    };

    filterNavItems();
  }, [roles, username, tenantId]);

  const topBarItems = (
    <div className="flex flex-col gap-2 bg-white px-2 py-3 rounded-2xl divide-y-2">
      <Button onClick={handleLogout}>LogOut</Button>
      {username !== "admin" && (
        <Button onClick={handleresetPassWord}>Reset PassWord</Button>
      )}
    </div>
  );

  return (
    <DashboardLayout
      icon="/assets/svg/user.png"
      navItems={filteredNavItems}
      userName="INSA"
      topBarMenu={topBarItems}
      title="INSA"
      currentPage="HR System"
      footerText="INSA"
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default App;




















// import { DashboardLayout } from "insa_react_ui";
// import React, { useContext, useEffect, useState } from "react";
// import { navItems } from "../config/navItems";
// import { Outlet } from "react-router-dom";
// import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "./components/Security/AuthContext";
// import { canAccessResource } from "./components/Security/canAccessResource";


// const App = () => {
//   const { authState, logout } = useContext(AuthContext); // Access authState from context
//   const { tenantId, roles } = authState; // Get tenantId and roles from AuthContext
//   const [filteredNavItems, setFilteredNavItems] = useState([]);
//   const navigate = useNavigate();

//   const getUserName = () => localStorage.getItem("username");
//   const username = getUserName();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleresetPassWord = () => {
//     navigate("/reset_password");
//   };

//   useEffect(() => {
//     const ADD_TENANT_RESOURCES = [
//       "Add Tenant",
//       "Get All Tenants",
//       "Get Tenant Details",
//       "Download Tenant logo",
//       "Update Tenant",
//       "Delete Tenant",
//     ];

//     const filterSubMenu = async (subMenu) => {
//       const filteredSubMenu = await Promise.all(
//         subMenu.map(async (subItem) => {
//           // Exclude for admin users if applicable
//           if (
//             username &&
//             username.toLowerCase().includes(".admin") &&
//             [
//               "Get Employee by Employee ID",
//               "Get Employee Leave Balance",
//               "Add Leave Schedule",
//               "Add Leave Request",
//             ].includes(subItem.resourceName)
//           ) {
//             return null;
//           }

//           // Skip resources related to tenants if tenantId exists
//           if (tenantId && ADD_TENANT_RESOURCES.includes(subItem.resourceName)) {
//             return null;
//           }

//           // Handle resource access check
//           if (subItem.resourceName) {
//             const hasAccess =
//               !tenantId && ADD_TENANT_RESOURCES.includes(subItem.resourceName)
//                 ? true // Allow ADD_TENANT_RESOURCES if no tenantId
//                 : await canAccessResource(subItem.resourceName, roles);

//             if (!hasAccess) return null;
//           }

//           // Check nested submenus
//           if (subItem.subMenu && subItem.subMenu.length > 0) {
//             const accessibleSubMenu = await filterSubMenu(subItem.subMenu);
//             return accessibleSubMenu.length > 0
//               ? { ...subItem, subMenu: accessibleSubMenu }
//               : null;
//           }

//           return subItem;
//         })
//       );

//       return filteredSubMenu.filter(Boolean);
//     };

//     const filterNavItems = async () => {
//       const filteredItems = await Promise.all(
//         navItems.map(async (item) => {
//           // Exclude for admin users if applicable
//           if (
//             username &&
//             username.toLowerCase().includes(".admin") &&
//             [
//               "Get Employee by Employee ID",
//               "Get Employee Leave Balance",
//               "Add Leave Schedule",
//               "Add Leave Request",
//             ].includes(item.resourceName)
//           ) {
//             return null;
//           }

//           // Skip resources related to tenants if tenantId exists
//           if (tenantId && ADD_TENANT_RESOURCES.includes(item.resourceName)) {
//             return null;
//           }

//           // Handle resource access check
//           if (item.resourceName) {
//             const hasAccess =
//               !tenantId && ADD_TENANT_RESOURCES.includes(item.resourceName)
//                 ? true // Allow ADD_TENANT_RESOURCES if no tenantId
//                 : await canAccessResource(item.resourceName, roles);

//             if (!hasAccess) return null;
//           }

//           // Check nested submenus
//           if (item.subMenu && item.subMenu.length > 0) {
//             const accessibleSubMenu = await filterSubMenu(item.subMenu);
//             return accessibleSubMenu.length > 0
//               ? { ...item, subMenu: accessibleSubMenu }
//               : null;
//           }

//           return item;
//         })
//       );

//       setFilteredNavItems(filteredItems.filter(Boolean));
//     };

//     filterNavItems();
//   }, [roles, username, tenantId]); // Add tenantId to dependencies

//   const topBarItems = (
//     <div className="flex flex-col gap-2 bg-white px-2 py-3 rounded-2xl divide-y-2">
//       <Button onClick={handleLogout}>LogOut</Button>
//       {username !== "admin" && (
//         <Button onClick={handleresetPassWord}>Reset PassWord</Button>
//       )}
//     </div>
//   );

//   return (
//     <DashboardLayout
//       icon="/assets/svg/user.png"
//       navItems={filteredNavItems}
//       userName="INSA"
//       topBarMenu={topBarItems}
//       title="INSA"
//       currentPage="HR System"
//       footerText="INSA"
//     >
//       <Outlet />
//     </DashboardLayout>
//   );
// };

// export default App;




// import { Outlet } from "react-router-dom";
// import { DashboardLayout } from "insa_react_ui";
// import "./index.css";
// import { navItems } from "../config/navItems";
// import { Button } from "@mui/material";
// import AuthContext from "./components/Security/AuthContext";
// import { useContext } from "react";


// function App() {
//   const { logout } = useContext(AuthContext); // Access 
//   const getUserName = () => localStorage.getItem("username");
//   const username = getUserName();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

  



// //   const topBarItems = (
// //     // <div className="flex flex-col gap-2 bg-white px-2 py-3 rounded-2xl divide-y-2">
// //     // </div>

// // <div className="flex flex-col gap-2 bg-white px-2 py-3 rounded-2xl divide-y-2">
// // <Button onClick={handleLogout}>LogOut</Button>
// // </div>
// //   );

//   const topBarItems = (
//     <div className="flex flex-col gap-2 bg-white px-2 py-3 rounded-2xl divide-y-2">
//       <Button onClick={handleLogout}>LogOut</Button>
//       {/* {username !== "admin" && (
//         <Button onClick={handleresetPassWord}>Reset PassWord</Button>
//       )} */}
//     </div>
//   );


    


//   return (
//     <div className="App">
//         <DashboardLayout
//           icon="/logo.svg"
//           navItems={navItems}
//           userName="Fekadu Tadesse"
//           topBarMenu={topBarItems}
//           title="INSA"
//           currentPage="Home Page"
//           footerText="INSA"
//         >
       
//           <Outlet />
//         </DashboardLayout>
      
//     </div>
//   );
// }

// export default App;
