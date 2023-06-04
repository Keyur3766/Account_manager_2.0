import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { NavLink as RouterLink,  useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// @mui
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Stack,
  Button
} from '@mui/material';
import { useState, useEffect } from 'react';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import UserServices from '../services/UserServices';
import Label from '../components/label';




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



export default function TransactionCustomerPage() {
  const {t} = useTranslation();
  const [data, setData] = useState("");
  const [transactionAmount, setTransactionAmount] = useState([]);

  console.warn(transactionAmount);
  

  useEffect(()=>{

    const getCustomData = async() => {
    
      const result = await UserServices.FetchCustomer();
      setData(result.data);   
      
      const promises = result.data.map((entry) => UserServices.GetTransactionAmountById(entry.id).then((res)=>{
        const newTransactionAmount = { id: entry.id, amount: res.data.total };
        setTransactionAmount((prevTrans) => [...prevTrans, newTransactionAmount]);
      }));
      await Promise.all(promises); 
    };

    getCustomData();
  },[]);


  const mergeStates = async() => {
    const mergedState = await data.map(obj1 => {
      const obj2 = transactionAmount.find(obj2 => obj2.id === obj1.id);
      return obj2 ?{ ...obj1, ...obj2 }:obj1;
    });
    setData(mergedState);
  };

  useEffect(()=> {
    mergeStates();
  },[transactionAmount])


  const CUSTOMERDATA = Array.from(data);

  const navigate = useNavigate();
  const handleViewDetailsClick = (id) => {
    navigate('/dashboard/customerTransactions/details',{ state: { id } });
  }

  console.warn(CUSTOMERDATA);
  
  return (
    <>
      <Helmet>
        <title> Transactions </title>
      </Helmet>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {t('Customers')}
          </Typography>
        </Stack>

        <Divider />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {CUSTOMERDATA.map((row, index) => {
            return (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/assets/images/avatars/avatar_10.jpg" />
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
                  <Stack direction="row" spacing={2} alignItems="center">
                    
                      {row.amount>0? 
                      <Label color={'success'}>
                      <Typography variant="subtitle1" component="subtitle1">
                        {t(`You'll give`)} &#x20B9;{row.amount}
                      </Typography>
                      </Label>
                        :
                        <Label color={'error'}>
                      <Typography variant="subtitle1" component="subtitle1">
                        {t(`You'll get`)} &#x20B9;{Math.abs(row.amount)}
                      </Typography>
                      </Label>
                      }

                    <Button
                      variant="outlined"
                      sx={{ mt: 0, mr: 1, flexShrink: 0 }}
                      onClick={() => handleViewDetailsClick(row.id)}
                    >
                      {t('View details')}
                    </Button>
                  </Stack>
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            );
          })}
          
        </List>
    </>
  );
}
