import React from 'react';
import { Box, IconButton, Toolbar, Divider } from '@mui/material';
import { Search, Refresh, Dashboard, Home, Add } from '@mui/icons-material';

function ToolbarComponent({ mainIconType, showBothIcons, onMainIconClick, onSecondaryIconClick, refreshPage }) {
  return (
    <Toolbar style={{ backgroundColor: 'white', borderColor: 'white', marginBottom: 10, minHeight: 56 }}>
      <Box display="flex" alignItems="center" marginLeft="auto">
        <IconButton
          onClick={onMainIconClick}
          style={{ backgroundColor: 'white', borderColor: 'white' }}
          title={mainIconType === 'search' ? 'Search' : 'Add'}
        >
          {mainIconType === 'search' ? <Search /> : <Add />}
        </IconButton>
        {showBothIcons && (
          <>
            <Divider orientation="vertical" flexItem style={{ marginLeft: 10, marginRight: 10 }} />
            <IconButton
              onClick={onSecondaryIconClick}
              style={{ backgroundColor: 'white', borderColor: 'white' }}
              title="Add"
            >
              <Add />
            </IconButton>
          </>
        )}
        <Divider orientation="vertical" flexItem style={{ marginLeft: 10, marginRight: 10 }} />
        <IconButton onClick={refreshPage} title="Refresh">
          <Refresh />
        </IconButton>
        <Divider orientation="vertical" flexItem style={{ marginLeft: 10, marginRight: 10 }} />
        <IconButton href="../../hrms/hrmsDashboard.xhtml" title="Dashboard">
          <Dashboard />
        </IconButton>
        <Divider orientation="vertical" flexItem style={{ marginLeft: 10, marginRight: 10 }} />
        <IconButton href="../../../HomePage.xhtml" title="Home Page">
          <Home />
        </IconButton>
      </Box>
    </Toolbar>
  );
}

export default ToolbarComponent;
