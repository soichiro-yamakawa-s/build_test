import * as React from 'react';
import "./index.css"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Panel1 from '../panel1';
import Panel2 from '../panel2';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    // <Box sx={{ width: '100%', typography: 'body1' }}>
    //   <TabContext value={value}>
    //     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    //       <TabList onChange={handleChange} aria-label="lab API tabs example">
    //         <Tab sx={{width: '50%'}} label="ヒストリカル" value="1" />
    //         <Tab sx={{width: '50%'}} label="企業一覧" value="2" />
    //       </TabList>
    //     </Box>
    //     <TabPanel value="1"><Panel1></Panel1></TabPanel>
    //     <TabPanel value="2"><Panel2></Panel2></TabPanel>
    //   </TabContext>
    // </Box>
    <Box sx={{ padding: 2}}>
      <Panel1></Panel1>
    </Box>
  );
}