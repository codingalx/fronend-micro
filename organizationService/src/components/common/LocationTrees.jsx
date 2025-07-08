import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useState, useEffect } from "react";
import { listLocation } from "../../../configuration/organizationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


export default function LocationTrees({ onNodeSelect }) {
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
      const response = await listLocation(tenantId);
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
        label: dept.locationName,
        children: [],
      });
    });

    const tree = [];

    departments.forEach((dept) => {
      if (dept.parentLocationId) {
        const parent = departmentMap.get(dept.parentLocationId);
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
    const selectedNode = findNodeById(treeData, nodeId);
    if (onNodeSelect && selectedNode) {
      onNodeSelect(selectedNode.id, selectedNode.label); // Pass selected node info to parent
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
    <Box sx={{ minHeight: 352, minWidth: 300 }}>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <RichTreeView
          expandedItems={expandedItems} // Controlled expanded items state
          selectedItems={selectedItems} // Controlled selected items state
          onExpandedItemsChange={handleNodeToggle}
          onSelectedItemsChange={handleNodeSelect}
          items={treeData}
          checkboxSelection={false}
        />
      )}
    </Box>
  );
}
