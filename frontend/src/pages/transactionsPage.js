// @mui
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box, Stack, Link, Card, Button, Drawer, Typography,FormControl, CardHeader,TextField,InputAdornment,InputLabel,OutlinedInput } from '@mui/material';
// utils
import { fToNow } from '../utils/formatTime';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import UserServices from '../services/UserServices';


// ----------------------------------------------------------------------





export default function TransactionPage() {
    const [isGetOpen, setIsGetOpen] = useState(false);

    const toggleGetDrawer = () => setIsGetOpen(!isGetOpen);

    const [isGiveOpen, setIsGiveOpen] = useState(false);

    const [debitAmount, setDebitAmount] = useState(0);
    const [creditAmount, setCreditAmount] = useState(0);
    const [debitPurpose, setDebitPurpose] = useState('');
    const [creditPurpose, setCreditPurpose] = useState('');

    const toggleGiveDrawer = () => setIsGiveOpen(!isGiveOpen);
    const {t} = useTranslation();

    const location = useLocation();
    const customer_id = location.state.id;
    const [customerName, setCustomerName] = useState(''); 
    const [data, setData] = useState('');

    const getTransactionData = async() => {
      await UserServices.FetchTransactions(customer_id).then((res)=>{
        setData(res.data);      
      });
    };
  
    const TRANSACTIONSDATA = Array.from(data);
    


    const getCustomerName = async() => {
      await UserServices.FetchCustomerByID(customer_id).then((res)=>{
        setCustomerName(res.data.customerName);      
      });
    };

    useEffect(()=>{
      getTransactionData(customer_id);
      getCustomerName(customer_id);
    },[]);
    


    const sendCreditDatatoBackend = async() => {
      try {
        await UserServices.AddTransaction(customer_id, creditAmount,creditPurpose).then((res) => {
          if(res.status===200){
            console.log('success');
            window.location.reload()
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    const sendDebitDatatoBackend = async() => {
      try {
        await UserServices.AddTransaction(customer_id,(-1)*debitAmount,debitPurpose).then((res) => {
          if(res.status===200){
            console.log('success');
            window.location.reload()
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    

  return (
    <>
      <Card>
        <CardHeader title={t('Transactions')} />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
            {TRANSACTIONSDATA.map((row) => (
                <TransactionItem item={row} />
            ))}

          </Stack>
        </Scrollbar>
      </Card>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '80%',

          bgcolor: 'background.default',
        }}
      >
        <Stack
          spacing={3}
          direction="row"
          sx={{ p: 3, pr: 0, position: 'sticky', bottom: 0, width: '100%', justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ width: '40%', background: '#229A16' }}
            onClick={toggleGetDrawer}
          >
            <Typography variant="button" sx={{ color: 'white', fontSize: 16 }}>
              {t(`You'll Get`)}
            </Typography>
          </Button>
          <Button variant="contained" color="error" sx={{ width: '40%' }} onClick={toggleGiveDrawer}>
            <Typography variant="button" sx={{ color: 'white', fontSize: 16 }}>
              {t(`You'll Give`)}
            </Typography>
          </Button>
        </Stack>
      </Box>

        {/* Get Component Starts */}
      <Drawer
        anchor="bottom"
        open={isGetOpen}
        onClose={toggleGetDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50%',
            margin: '0 auto',
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <div style={{ height: 300 }}>
          <Box sx={{p:3, px:6 , width:'100%'}}>
            <Typography sx={{ mt: 1, color: '#229A16' }} variant="h5" align="center" gutterBottom>
              {t(`You got ${creditAmount} from ${customerName}`)}
            </Typography>

            <Stack spacing={3} sx={{width:'100%', alignItems:'center'}}>
            <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-amount" color="success">{t('Amount')}</InputLabel>
                    <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start" sx={{color: '#229A16'}}>&#x20B9;</InputAdornment>}
                    label={t('Amount')}
                    onChange={(e)=> setCreditAmount(e.target.value)}
                    name="amount"
                    type="number"
                    color="success"
                    sx={{
                        '& input': {
                          color: '#229A16',
                        },
                      }}
                    />
             </FormControl>
            <TextField
                  fullWidth
                  label={t('Details (i.e.Purpose, invoice no, challan no)')} 
                  name="item_color"
                  color="success"
                  onChange={(e)=> setCreditPurpose(e.target.value)}
                />
        <Button
            variant="contained"
            color="success"
            sx={{ width: '40%', background: '#229A16' }}
            onClick={sendCreditDatatoBackend}
          >
            <Typography variant="button" sx={{ color: 'white', fontSize: 16 }}>
              {t('Save')}
            </Typography>
          </Button>
            </Stack>

          </Box>
        </div>
      </Drawer>
      {/* Get Component Ends */}

      {/* Give Component Start */}
      <Drawer
        anchor="bottom"
        open={isGiveOpen}
        onClose={toggleGiveDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50%',
            margin: '0 auto',
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <div style={{ height: 300 }}>
          <Box sx={{p:3, px:6 , width:'100%'}}>
            <Typography sx={{ mt: 1}} color="error" variant="h5" align="center" gutterBottom>
              You will give {debitAmount} to {customerName}
            </Typography>

            <Stack spacing={3} sx={{width:'100%', alignItems:'center'}}>
            <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-amount" color="error">{t('Amount')}</InputLabel>
                    <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start" color="error">&#x20B9;</InputAdornment>}
                    label={t('Amount')}
                    name="amount"
                    type="number"
                    onChange={(e)=> setDebitAmount(e.target.value)}
                    color="error"
                    sx={{
                        '& input': {
                          color: 'red',
                        },
                      }}
                    />
             </FormControl>
            <TextField
                  fullWidth
                  label={t('Details (i.e.Purpose, invoice no, challan no)')} 
                  name="item_color"
                  onChange={(e)=> setDebitPurpose(e.target.value)}
                  color="error"
                />

        <Button
            variant="contained"
            color="error"
            sx={{ width: '40%', background: '#229A16' }}
            onClick={sendDebitDatatoBackend}
          >
            <Typography variant="button" sx={{ color: 'white', fontSize: 16 }}>
            {t('Save')}
            </Typography>
          </Button>
            </Stack>

          </Box>
        </div>
      </Drawer>
        {/* Give Component ends */}
    </>
  );
}

// ----------------------------------------------------------------------

// NewsItem.propTypes = {
//   news: PropTypes.shape({
//     description: PropTypes.string,
//     image: PropTypes.string,
//     postedAt: PropTypes.instanceOf(Date),
//     title: PropTypes.string,
//   }),
// };

function TransactionItem({item}) {
  const {t} = useTranslation();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    // Extract the day from the formatted date
    const day = Number(formattedDate.split(' ')[0]);
  
    // Add "th", "st", "nd", or "rd" suffix based on the day
    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = 'st';
    } else if (day === 2 || day === 22) {
      daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }
  
    // Replace the day in the formatted date with the formatted day
    const formattedDay = `${day}${daySuffix}`;
    const formattedDateWithDay = formattedDate.replace(day, formattedDay);
  
    return formattedDateWithDay;
  };


    const imagecreditPath = `/assets/images/covers/cover_9.jpg`;
    const imagedebitPath = `/assets/images/covers/cover_5.jpg`;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt="{title} " src={item.amount>0? imagecreditPath:imagedebitPath} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {item.purpose}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {formatDate(item.date)} 
        </Typography>
      </Box>  

      {item.amount > 0?

      <Typography variant="subtitle1" sx={{ pr: 3, flexShrink: 0, color: 'green' }}>
         &#x20B9;{item.amount} {t('Credited')}
      </Typography>
      :
      <Typography variant="subtitle1" sx={{ pr: 3, flexShrink: 0, color: 'red' }}>
         &#x20B9;{Math.abs(item.amount)} {t('Debited')}
      </Typography>

      } 
    </Stack>
  );
}
