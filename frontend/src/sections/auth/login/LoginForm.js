import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Button, CardActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

import UserServices from '../../../services/UserServices';

// ----------------------------------------------------------------------

export default function LoginForm() {
  console.log(process.env.REACT_APP_API_URL);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const sendDataForValidation = async() => {
    // e.preventDefault();

    // Clear previous error messages
    setEmailError('');
    setPasswordError('');

    setEmailError('');
    setPasswordError('');
    setServerError('');

    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if(isValid){

      UserServices.GenerateLoginToken(email, password).then((res)=>{
        if(res.status===200){
          console.warn("success");
          navigate('/dashboard', { replace: true });
        }
        console.log(res);
        if(res.response && res.response.status===400){
          console.warn("UserName or password is incorrect");
          setServerError('Invalid credentials');
        }
      })
      .catch((error)=>{
          console.warn(error);
          navigate('/login');
      })
      
      
    }
   
  }

  const handleSignInGuest = async() => {
    UserServices.GenerateLoginToken("kcode@gmail.com", "1234").then((res)=>{
      if(res.status===200){
        console.warn("success");
        navigate('/dashboard', { replace: true });
      }
      console.log(res);
      if(res.response && res.response.status===400){
        console.warn("UserName or password is incorrect");
        setServerError('Invalid credentials');
      }
    })
    .catch((error)=>{
        console.warn(error);
        navigate('/login');
    })
  }

  return (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        {serverError && (
          <div className="error" style={{ color: 'red' }}>
            {serverError}
          </div>
        )}

        <TextField name="email" onChange={(e) => setEmail(e.target.value)} value={email} label="Email address" />
        <div className="error" style={{ color: 'red', marginTop: 0 }}>
          {emailError}
        </div>
        <TextField
          name="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className="error" style={{ color: 'red', marginTop: 0 }}>
          {passwordError}
        </div>
      </Stack>

      {/* <CardActions style={}> */}
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={sendDataForValidation}>
          Login
        </LoadingButton>

        <Button variant="outlined" sx={{mt:2}} onClick={handleSignInGuest}>Signin as a Guest</Button>
      {/* </CardActions> */}
    </>
  );
}
