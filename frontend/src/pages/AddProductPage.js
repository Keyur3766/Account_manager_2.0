import { useCallback, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useTranslation } from 'react-i18next';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  OutlinedInput,
  Unstable_Grid2 as Grid,
  Stack,
  Alert,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserServices from '../services/UserServices';

// import label from 'src/components/label';


export default function AddProductPage() {
  const [values, setValues] = useState("");
  const [fileState,setFiles] = useState("");
  const [ErrorMessage,setErrorMessage] = useState("");
  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleFileChange = useCallback((event)=>{
    setFiles({itemImage: event.target.files[0]})    
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);
  const navigate = useNavigate();

  const {t} = useTranslation();
  const SendDataToBackEnd = async () => {
    
    
    try {
      UserServices.Add_Item(product_name,purchase_price,selling_price,item_color,stock_available,fileState.itemImage).then((res) => {
        console.log('success');
        
        // console.warn(res.response.data.message);
        if(res.status === 200){
          navigate('/dashboard/products');
        }
        else{
          alert(res.response.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }

    
  };
  // console.log(fileState.itemImage);
  const { product_name, purchase_price, selling_price, item_color, stock_available } = values;

  return (

    
    <form autoComplete="off" noValidate onSubmit={handleSubmit} encType="multipart/form-data">
      
      <Card>
        <CardHeader subheader={t('The information can be edited')} title={t('Add Item')} />
        <br />
        
        <Button sx={{ mx: 2 }} onChange={handleFileChange} variant="contained" component="label">
          {t('Upload')}
          <input hidden accept="image/*" multiple type="file" name="file" required />
        </Button>
        {
          fileState.itemImage ? (<Typography sx={{ mx: 2 ,mt: 0.5, color: 'text.disabled'}} variant="subtitle2">
          {fileState.itemImage.name}
        </Typography> ): ""
        }

        <CardContent sx={{ m: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('Product Name')}
                  name="product_name"
                  onChange={handleChange}
                  required
                />
              </Grid> 
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('Product Color (optional)')} 
                  name="item_color"
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid xs={12} md={6}>
                <FormControl fullWidth sx={{ m: 0 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">{t('Purchase Price')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">&#x20B9;</InputAdornment>}
                    onChange={handleChange}
                    label={t('Purchase Price')}
                    name="purchase_price"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl fullWidth sx={{ m: 0 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">{t('Selling Price')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">&#x20B9;</InputAdornment>}
                    onChange={handleChange}
                    label={t('Selling Price')}
                    name="selling_price"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label={t('Total stocks available')} name="stock_available" onChange={handleChange} type="number" required />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={!product_name || !purchase_price || !selling_price || !stock_available || !fileState}
            onClick={() => SendDataToBackEnd()}
          >
            {t('Save Details')}
          </Button>
        </CardActions>
      </Card>

      {parseInt(selling_price,10) < parseInt(purchase_price,10) && (
        <Alert variant="filled" severity="warning">
          Purchase Rate can't be less than Sales Rate
        </Alert>
      )}
    </form>
  );
}
