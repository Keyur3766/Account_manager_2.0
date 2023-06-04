import React from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddChallanPage from './AddChallanPage';
import AddSalesPage  from './AddSale';




export default function SalesPage() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const {t} = useTranslation();
  return (
    <>
    <Helmet>
        <title> Sales </title>
      </Helmet>
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={t('Add Delievery Challan')} value="1" />
            <Tab label={t('Add Sale')} value="2" />
          </TabList>
        </Box>
        <TabPanel value="1"><AddChallanPage/></TabPanel>
        <TabPanel value="2"><AddSalesPage/></TabPanel>
      </TabContext>
    </Box>

    </>

  )
}
