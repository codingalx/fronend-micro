import React from "react";

const SelectedKeyContext = React.createContext({
  selectedKey: null,
  setSelectedKey: () => {},
});

export default SelectedKeyContext;
