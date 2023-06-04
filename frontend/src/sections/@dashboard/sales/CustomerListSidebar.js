import PropTypes from 'prop-types';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
// @mui
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Drawer,
  Avatar,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel,
  Stack,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';



// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

CustomerList.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function CustomerList({ openFilter, onOpenFilter, onCloseFilter, customerData, setCustomerId, setCustomerName, customerName }) {
  // console.log(customerData);
  const {t} = useTranslation();
  return (
    <>
      <TextField fullWidth label={t('Customer Name')} value={customerName || ""} name="custname" onClick={onOpenFilter} required />
      

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 400, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {t('Customers')}
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />
        <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
          {customerData.map((row) => {
            return (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={row.Name}
                    secondary={
                      <>
                        <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                          {row.City} 
                        </Typography>
                        {/* {row.Address} */}
                      </>
                    }
                  />
                  <Button variant="outlined" sx={{ mt: 0, mr: 1, flexShrink: 0 }} onClick = {()=>{setCustomerId(row.id);setCustomerName(row.Name);onCloseFilter()}}>
                    {t('Add')}
                  </Button>
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            );
          })}
          
        </List>
      </Drawer>
    </>
  );
}
