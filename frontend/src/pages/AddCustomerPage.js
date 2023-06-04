import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import UserServices from '../services/UserServices';

// import label from 'src/components/label';

const cities = [
  {
    value: 'rajkot',
    label: 'Rajkot',
  },
  {
    value: 'ahmedabad',
    label: 'Ahmedabad',
  },
  {
    value: 'delhi',
    label: 'Delhi',
  },
  {
    value: 'kolkata',
    label: 'Kolkata',
  },
];

export default function AddCustomerPage() {
  const [values, setValues] = useState({
    custname: '',
    email: '',
    address: '',
    city: 'Rajkot',
    phone: '',
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateMobileNumber = (number) => {
    const mobileNumberRegex = /^[0-9]{10}$/;
    return mobileNumberRegex.test(number);
  };

  const SendDataToBackEnd = async () => {
    setEmailError('');
    setMobileError('');
    if(!validateEmail(email)){
        setEmailError('* Please Enter Valid Email-address');
    }
    if(!validateMobileNumber(phone)){
      setMobileError('* Please Enter Valid Mobile Number');
    }
    else{
      try {
        UserServices.Add_Customer(custname, email, address, city, phone).then((res) => {
          console.log('success');
          console.log(res);
          navigate('/dashboard/user');
        });
      } catch (error) {
        console.log(error);
      }
    }
    
  };

  const { custname, email, address, city, phone } = values;
  
  const {t} = useTranslation();
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader={t('The information can be edited')} title={t('Add Customer')} />
        <br />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Specify your company or customer name"
                  label={t('Customer name')}
                  name="custname"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('Select City')}
                  name="city"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.city}
                >
                  {cities.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label={t('Email Address')} name="email" onChange={handleChange} required />
                <div className="error" style={{ color: 'red', marginTop: 0 }}>{emailError}</div>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label={t('Mobile Number')} name="phone" onChange={handleChange} type="number" required />
                <div className="error" style={{ color: 'red', marginTop: 0 }}>{mobileError}</div>
              </Grid>
              <Grid xs={12} md={12}>
                <TextField fullWidth label={t('Address')} name="address" onChange={handleChange} required />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" disabled={!custname || !phone || !city || !address} onClick={() => SendDataToBackEnd()}>
            {t('Save Details')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
