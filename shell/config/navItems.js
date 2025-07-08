export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    subMenu: [],
    icon: "/dashboard.svg",
  },

  {
    label: "Tenant Service",
    icon: "/tree.svg",

    subMenu: [
      {
        href: "/manageteant",
        label: "Manage Tenant ",
        subMenu: [],
        icon: "/list.svg",
        resourceName: "Get All Tenants",
      },

      {
        href: "/addtenant",
        label: " Add Tenant ",
        subMenu: [],
        icon: "/user_3.svg",
        resourceName: "Add Tenant",
      },
    ],
  },

  {
    label: "User Service",
    icon: "/user_3.svg",
    subMenu: [
      {
        href: "/user_manage",
        label: "Manage User ",
        subMenu: [],
        icon: "/list.svg",
        resourceName: "Get All Users",
        apiName: "user",
      },
      {
        href: "/role_manage",
        label: " Manage Role ",
        subMenu: [],
        icon: "/user_3.svg",
        resourceName: "Get All Users",
        apiName: "user",
      },
    ],
  },

  {
    label: "Org Stru. Service",
    icon: "/tree.svg",

    subMenu: [
      {
        href: "/manage_organization_info",
        label: "Set Up Organization",
        subMenu: [],
        icon: "/add.svg",
        apiName: "organization",
        resourceName: "Add Job Grade",
      },
      {
        href: "/manage_organization",
        label: "Organization Structure",
        subMenu: [],
        icon: "/structurechange.svg",
        resourceName: "Add Department",
        apiName: "organization",
      },
    ],
  },

  {
    label: "Emp Profile",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/employee/addEmployee",
        label: "Add Employee",
        subMenu: [],
        icon: "/add.svg",
        resourceName: "Add Employee",
        apiName: "employee",
      },
      {
        href: "/employee/list",
        label: "List Employee",
        resourceName: "Get All Employees",
        subMenu: [],
        icon: "/list.svg",
        apiName: "employee",
      },
      {
        href: "/employee/details",
        resourceName: "Get All Languages",
        label: "Your Profile",
        subMenu: [],
        icon: "/profile.svg",
        apiName: "employee",
      },
    ],
  },

  {
    label: "Recruitment",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/recruitment/create",
        label: "Manage Recruitment",
        resourceName: "Add Recruitment",
        subMenu: [],
        icon: "/add.svg",
        apiName: "recruitment",
      },

      {
        href: "/recruitment/list",
        label: "List Recruitment",
        resourceName: "Get All Recruitments",
        subMenu: [],
        icon: "/list.svg",
        apiName: "recruitment",
      },
      {
        href: "/recruitment/media_type",
        label: "Media Type",
        resourceName: "Add Media Type",
        subMenu: [],
        icon: "/list.svg",
        apiName: "recruitment",
      },
    ],
  },

  {
    label: "Planning",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/planning/needRequest",
        label: " Need Request ",
        resourceName: "Add HR Need Request",
        apiName: "planning",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/planning/listRequest",
        label: " List Need Request ",
        apiName: "planning",
        resourceName: "Get All HR Need Requests",
        subMenu: [],
        icon: "/list.svg",
      },
    ],
  },

  {
    label: "Leave Service",
    icon: "/staffplan.svg",
    subMenu: [
      {
        href: "/add_Leave_Info",
        label: "Set Up Leave",
        subMenu: [],
        icon: "/add.svg",
        resourceName: "Add Budget Year",
        apiName: "leave",
      },

      {
        href: "/addleaverequest",
        label: "Manage Leave Req",
        subMenu: [],
        icon: "/add.svg",
        resourceName: "Add Leave Request",
        apiName: "leave",
      },

      {
        href: "/addleaveschedule",
        label: "Add Leave Schedule",
        subMenu: [],
        icon: "/add.svg",
        resourceName: "Add Leave Schedule",
        apiName: "leave",
      },

      {
        href: "/leavebalance",
        label: "Leave Balance",
        subMenu: [],
        icon: "/list.svg",
        resourceName: "Get Employee Leave Balance",
        apiName: "leave",
      },
    ],
  },

  {
    label: "Training",
    icon: "/training.svg",
    subMenu: [
      {
        label: " Annual Training ",
        subMenu: [
          {
            href: "/training/coursecategory",
            label: " Course Category",
            subMenu: [],
            icon: "/trainingcourse.svg",
            resourceName: "Add Training Course Category",
            apiName: "training",
          },

          {
            href: "/training/trainingCourse",
            label: "Training Course",
            subMenu: [],
            icon: "/trainingcourse.svg",
            resourceName: "Add Training Course",
            apiName: "training",
          },

          {
            href: "/training/createdocument",
            label: "Add Trainee Document",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add Pre Service Checked Document",
            apiName: "training",
          },

          {
            href: "/training/trainingInstution",
            label: "Training Institution",
            subMenu: [],
            icon: "/traininginstution.svg",
            resourceName: "Add Training Institution",
            apiName: "training",
          },

          {
            href: "/training/annualTrainingRequest",
            label: "Annual Training Request",
            subMenu: [],
            icon: "/annualTrainingrequest.svg",
            resourceName: "Add Training",
            apiName: "training",
          },

          {
            href: "/training/annualPlan",
            label: " Annual Training Plan",
            subMenu: [],
            icon: "/annualtrainingplan.svg",
            resourceName: "Add Annual Training Plan",
            apiName: "training",
          },
        ],
        icon: "/annualtraining.svg",
      },

      {
        label: "Pre Service",
        subMenu: [
          {
            href: "/training/coursetype",
            label: "Course Type",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add Pre Service Course Type",
            apiName: "training",
          },

          {
            href: "/training/preserviceCourses",
            label: " Course ",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add Pre Service Course",
            apiName: "training",
          },

          {
            href: "/training/preserviceTraining",
            label: "Pre-Service Training",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add Pre Service Trainee",
            apiName: "training",
          },
        ],
        icon: "/service.svg",
      },

      {
        label: "InterniShip",
        subMenu: [
          {
            href: "/training/university",
            label: "University",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add University",
            apiName: "training",
          },

          {
            href: "/training/internstudent",
            label: "Interniship Student",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add Internship Student",
            apiName: "training",
          },

          {
            href: "/training/listInternPayement",
            label: "list Interniship Payment",
            subMenu: [],
            icon: "/list.svg",
            resourceName: "Add Internship Payment",
            apiName: "training",
          },
        ],
        icon: "/intern.svg",
      },

      {
        label: "Education ",
        subMenu: [
          {
            href: "/training/educationOpportunity",
            label: "Register Education Opportunity",
            subMenu: [],
            icon: "/add.svg",
            resourceName: "Add Education Opportunity",
            apiName: "training",
          },
        ],
        icon: "/education.svg",
      },
    ],
  },

  {
    label: "Evaluation",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/evaluation/result",
        label: "Add Evaluation Result",
        apiName: "evaluation",
        resourceName: "Update Evaluation Result",
        subMenu: [],
        icon: "/add.svg",
      },
      {
        href: "/evaluation/evalution_setup",
        label: "Set Up Evaluation",
        resourceName: "Add Evaluation Criteria",
        apiName: "evaluation",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },

  {
    label: "Delegation",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/delegation/create",
        label: "Add Delegation",
        apiName: "delegation",
        resourceName: "Add Delegation",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/delegation/list",
        label: "List Delegation",
        apiName: "delegation",
        resourceName: "Get All Active Delegations",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },

  {
    label: "Document",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/document/document_type",
        label: " Document Type",
        apiName: "document",
        resourceName: "Get All Document Type",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/document/create",
        label: " Document ",
        apiName: "document",
        resourceName: "Add Document",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/document/list",
        label: "  List Document ",
        apiName: "document",
        resourceName: "Get All Documents",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },

  {
    label: "Transfer",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/transfer/create-transfer",
        label: "Add Transfer",
        apiName: "transfer",
        resourceName: "Add Transfer Request",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/transfer/list",
        label: "List Transfer",
        apiName: "transfer",
        resourceName: "Get All Transfer Request",
        subMenu: [],
        icon: "/list.svg",
      },

      {
        href: "/transfer/direct_assigment",
        label: "Add Assignment",
        apiName: "transfer",
        resourceName: "Add Direct Assignment",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },

  {
    label: "Promotion",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "promotion/criteria_name",
        label: " Criterial Name",
        apiName: "promotion",
        resourceName: "Add Promotion Criteria Name",
        subMenu: [],
        icon: "/add.svg",
      },
      {
        href: "promotion/CreatePromotionCriteria",
        label: "Promote Criterial",
        apiName: "promotion",
        resourceName: "Add Promotion Criteria",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "promotion/createPromotionCandidate",
        label: "Promotion Candidate",
        apiName: "promotion",
        resourceName: "Add Promotion Candidate",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },

  {
    label: "Separation",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/separation/create-termination-type",
        label: "Termination Type",
        apiName: "separation",
        resourceName: "Add Termination Type",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/separation/create-termination",
        label: "Add Termination",
        apiName: "employee",
        resourceName: "Get All Languages",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/separation/list-termination",
        label: "Approve Termination",
        apiName: "separation",
        resourceName: "Approve Termination",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/separation/list-clearance",
        label: "Get All Clearances",
        apiName: "separation",
        resourceName: "Get All Clearances",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/separation/create-retirement",
        label: "Add Retriment",
        apiName: "employee",
        resourceName: "Get All Languages",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/separation/list-retirement",
        label: "Approve Retirement",
        apiName: "separation",
        resourceName: "Approve Retirement",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/separation/create-clearance-department",
        label: "Add Clearance Department",
        apiName: "separation",
        resourceName: "Add Clearance Department",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },


  {
    label: "Discipline",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/discipline/create-penalty",
        label: "Add Penalty",
        apiName: "discipline",
        resourceName: "Add Discipline Penalty",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/discipline/create-offense",
        label: "Add Offense",
        apiName: "discipline",
        resourceName: "Add Discipline Offense",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/discipline/create-discipline",
        label: "Add Discipline",
        apiName: "discipline",
        resourceName: "Add Discipline",
        subMenu: [],
        icon: "/add.svg",
      },  

      {
        href: "/discipline/list-discipline",
        label: "Get All Discipline",
        apiName: "discipline",
        resourceName: "Get All Discipline",
        subMenu: [],
        icon: "/list.svg",
      },

      {
        href: "/discipline/list-discipline-for-user",
        label: " Get All Offender",
        apiName: "discipline",
        resourceName:"Get Discipline by Offender Id",
        subMenu: [],
        icon: "/list.svg",
      },

    ],
  },


  {
    label: "Complaint",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/complaint/create-complaint-type",
        label: "Add Complaint Type",
        apiName: "complaint",
        resourceName: "Add Complaint Type",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/complaint/create-complaint",
        label: "Add Complaint",
        apiName: "complaint",
        resourceName: "Update Complaint",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/complaint/list-complaints",
        label: "Get All Complaints",
        apiName: "complaint",
        resourceName: "Get All Complaint",
        subMenu: [],
        icon: "/list.svg",
      },

      {
        href: "/complaint/list-complaint-handlings-by-department",
        label: "Complaint Handling ",
        apiName: "complaint",
        resourceName: "Get Complaint Handling By Department Id",
        subMenu: [],
        icon: "/list.svg",
      },

     
    ],
  },


   {
    label: "Attendance",
    icon: "/organization.svg",
    subMenu: [
      {
        href: "/attendance/set_up",
        label: "Set_up Attendance",
        apiName: "attendance",
        resourceName: "Add Shift",
        subMenu: [],
        icon: "/add.svg",
      },

      {
        href: "/attendance/employee-attendance",
        label: "My Attendance",
        apiName: "employee",
        resourceName: "Get All Languages",
        subMenu: [],
        icon: "/add.svg",
      },

       {
        href: "/attendance/attendance-approval",
        label: "Dept Approval",
        apiName: "attendance",
        resourceName: "Add Attendance Status",
        subMenu: [],
        icon: "/add.svg",
      },
       {
        href: "/attendance/hr-aproval",
        label: "HR approval",
        apiName: "attendance",
        resourceName: "Add Attendance Status",
        subMenu: [],
        icon: "/add.svg",
      },

         {
        href: "/attendance/create-attendance-log",
        label: "HR approval",
        apiName: "attendance",
        resourceName: "Add Attendance Log",
        subMenu: [],
        icon: "/add.svg",
      },


        {
        href: "/item/create-item",
        label: "Manage Item",
        apiName: "item",
        resourceName: "Add Item",
        subMenu: [],
        icon: "/add.svg",
      },



     
      

    
    ],
  },


   {
    label: "Item",
    icon: "/organization.svg",
    subMenu: [
      
        {
        href: "/item/create-item",
        label: "Manage Item",
        apiName: "item",
        resourceName: "Add Item",
        subMenu: [],
        icon: "/add.svg",
      },

       {
        href: "/item/create-inspection",
        label: "Manage Inspection",
        apiName: "item",
        resourceName: "Create Purchase Inspection",
        subMenu: [],
        icon: "/add.svg",
      },
    ],
  },

  {
    label: "Store",
    icon: "/organization.svg",
    subMenu: [
      
        {
        href: "/store/store_setup",
        label: "Set Up Store",
        apiName: "store",
        resourceName: "Add Store",
        subMenu: [],
        icon: "/add.svg",
      },

       {
        href: "/store/create-store-requisition",
        label: "Manage Store Requision",
        apiName: "store",
        resourceName: "Add Store Requisition",
        subMenu: [],
        icon: "/add.svg",
      },

        {
        href: "/store/create-receivable-item",
        label: "Manage Receivable Item",
        apiName: "store",
        resourceName: "Add Receivable Item",
        subMenu: [],
        icon: "/add.svg",
      },
      {
        href: "/store/create-issuable-item",
        label: "Manage Issuable Item",
        apiName: "store",
        resourceName: "Add Issuable Item",
        subMenu: [],
        icon: "/add.svg",
      },
      
      
    ],

    
  },


   {
    label: "Store Movement",
    icon: "/organization.svg",
    subMenu: [
      
        {
        href: "/storeMovent/create_storeIssued_voucher",
        label: "Manage Store Issued Vouncher",
        apiName: "storeMovement",
        resourceName: "Add Store Issue Voucher",
        subMenu: [],
        icon: "/add.svg",
      },

       {
        href: "/storeMovent/create_goodReceiving_note",
        label: "Manage Good Receiving Note",
        apiName: "storeMovement",
        resourceName: "Add Good Receiving Note",
        subMenu: [],
        icon: "/add.svg",
      },

        {
        href: "/storeMovent/create_gatepass_infomation",
        label: "Manage Gate Pass Information",
        apiName: "storeMovement",
        resourceName: "Add Gate Pass Information",
        subMenu: [],
        icon: "/add.svg",
      },


       {
        href: "/storeMovent/create_inter_Store_Issue",
        label: "Manage Inter Store Issue Voucher For Issue",
        apiName: "storeMovement",
        resourceName: "Add Inter Store Issue Voucher For Issue",
        subMenu: [],
        icon: "/add.svg",
      },

          {
        href: "/storeMovent/create_inter_Store_receiving",
        label: "Manage Inter Store Issue Voucher For Receiving",
        apiName: "storeMovement",
        resourceName: "Add Inter Store Issue Voucher For Receiving",
        subMenu: [],
        icon: "/add.svg",
      },


    
      
      
    ],


   
  },


    {
    label: "Fixed Asset",
    icon: "/organization.svg",
    subMenu: [
      
        {
        href: "/asset/create_fixed_asset",
        label: "Manage Fixed asset",
        apiName: "fixedAsset",
        resourceName: "Get All Resources",
        subMenu: [],
        icon: "/add.svg",
      }, 
      
    ],


   
  },
  
    



  






];
