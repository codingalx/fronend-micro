import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useState, useEffect } from "react";
import { listDepartement } from "../../../configuration/organizationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

export default function TreeOptional({ onNodeSelect }) {
  const [treeData, setTreeData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await listDepartement(tenantId);
      const formattedData = buildTree(response.data);
      setTreeData(formattedData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error.message);
    }
  };

  const buildTree = (departments) => {
    const departmentMap = new Map();

    // Initialize the map with all departments
    departments.forEach((dept) => {
      departmentMap.set(dept.id, {
        id: dept.id,
        label: dept.departmentName,
        parentDepartmentId: dept.parentDepartmentId, // Include parentDepartmentId for easy access
        children: [],
      });
    });

    const tree = [];

    // Build the tree by associating sub-departments with their parent
    departments.forEach((dept) => {
      if (dept.parentDepartmentId) {
        const parent = departmentMap.get(dept.parentDepartmentId);
        if (parent) {
          parent.children.push(departmentMap.get(dept.id));
        }
      } else {
        // If no parent, it's a root node
        tree.push(departmentMap.get(dept.id));
      }
    });

    return tree;
  };

  const handleNodeSelect = (event, nodeId) => {
    setSelectedItems([nodeId]); // Update selected items state

    // Find the selected node
    const selectedNode = findNodeById(treeData, nodeId);

    if (selectedNode) {
      const { parentDepartmentId } = selectedNode; // Extract parentDepartmentId

      if (onNodeSelect) {
        // Pass selected node info (including parentDepartmentId) to parent
        onNodeSelect(selectedNode.id, selectedNode.label, parentDepartmentId);
      }

      // Save or handle the parentDepartmentId here
      console.log(`Selected Department: ${selectedNode.label}`);
      console.log(`Parent Department ID: ${parentDepartmentId}`);
      // Example: Save to database, or trigger a state update
      // saveParentDepartmentId(parentDepartmentId);
    }
  };

  const handleNodeToggle = (event, nodeIds) => {
    setExpandedItems(nodeIds); // Update expanded items state
  };

  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: 352,
        minWidth: 300,
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      {error ? (
        <Typography
          variant="body1"
          color="error"
          sx={{ textAlign: "center", mt: 2 }}
        >
          Error: {error}
        </Typography>
      ) : (
        <RichTreeView
          expandedItems={expandedItems} // Controlled expanded items state
          selectedItems={selectedItems} // Controlled selected items state
          onExpandedItemsChange={handleNodeToggle}
          onSelectedItemsChange={handleNodeSelect}
          items={treeData}
          checkboxSelection={false}
          sx={{
            "& .MuiTreeView-root": {
              backgroundColor: "#fff",
              borderRadius: 1,
              p: 1,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      )}
    </Box>
  );
}
