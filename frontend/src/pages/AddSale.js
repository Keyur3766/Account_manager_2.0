import { useCallback, useState,useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Alert,
  Snackbar,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomerListSidebar from '../sections/@dashboard/sales/CustomerListSidebar';
import ItemListSidebar from '../sections/@dashboard/sales/ItemListSidebar';

import UserServices from '../services/UserServices';


// import label from 'src/components/label';



export default function AddSalesPage() {
  const [values, setValues] = useState({
    customer_id: '',
    item_id: '',
    quantity: '',
  });

  // For alert messages
  const [alertopen, setAlertOpen] = useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const handleAlertClick = () => {
    setAlertOpen(true);
  };

  // Alert close


  // For Customer sidebar
  const [Customeropen, setOpenCustomer] = useState(false);
  

  const handleOpenCustomer = () => {
    setOpenCustomer(true);
  };

  const handleCloseCustomer = () => {
    setOpenCustomer(false);
  };
  // sidebar end

  // For Item sidebar
  const [Itemopen, setOpenItem] = useState(false);

  const handleOpenItem = () => {
    setOpenItem(true);
  };

  const handleCloseItem = () => {
    setOpenItem(false);
  };
  // sidebar end

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleFormChange = (index, event) => {
    const temp = [...inputFields];
    temp[index][event.target.name] = event.target.value;
    setInputFields(temp);
 }

 const addFields = () => {
  setItemIndex(index+1);
  const newfield = { item_id: '', quantity: '' }
  setInputFields([...inputFields, newfield])
}

  const [customerdata, setcustomerData] = useState("");

  const getCustomerData = async() => {
    UserServices.FetchCustomer().then((res)=>{
      setcustomerData(res.data);
    });
  };

  const CUSTOMERDATA = Array.from(customerdata);
    
  


  // Getting items from Backend
  const [itemdata, setItemData] = useState('');
  const getItemsData = async() => {
    UserServices.FetchItems().then((res)=>{
      setItemData(res.data);
    });
  };
  
  const PRODUCTDATA = Array.from(itemdata);

  useEffect(()=>{
    getCustomerData();
    getItemsData();

  },[]);

  

  
  
  const saveAndDownloadInvoices = async() => {
    console.warn('clicked');
    try{
        const response = await UserServices.SaveAndDownloadInvoice(customer_id, inputFields).then((res)=>{
            console.log('success');
            return res;
        });

        console.warn(response);
        handleAlertClick();
        setItemIndex(0);
        setCustomerId('');
        setInputFields([{ item_id: '', quantity: '' }]);
        setCustomerName(null);

        setTimeout(() => {window.location.reload(false)}, 2000);
        
    }
    catch(error){
      console.log(error);
    }
    
  };


  const { custname, email, address, city, phone } = values;

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  const [customer_id,setCustomerId] = useState('');
  const [selected_item,setItemId] = useState(0);
  const [index,setItemIndex] = useState(0);
  const [inputFields, setInputFields] = useState([{ item_id: '', quantity: '' }]);


  const [selected_itemname,setItemNameParent] = useState('');
  const [selected_itemprice,setItemPriceParent] = useState('');
  const [customerName,setCustomerName] = useState(null);
  const {t} = useTranslation();

  // console.warn(inputFields);
  useEffect(()=>{
      setInputFields(prevState => {
        const updatedFields = [...prevState];
        updatedFields[index] = {
          ...updatedFields[index],
          item_id: selected_item,

        };
        return updatedFields;
      });
    // setInputFields({...inputFields, item_id: selected_item})
    
  },[selected_item]);

  
  return (
    <>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader={date} title={t('Add Sale')} />
          <br />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <CustomerListSidebar
                    openFilter={Customeropen}
                    onOpenFilter={handleOpenCustomer}
                    onCloseFilter={handleCloseCustomer}
                    customerData = {CUSTOMERDATA}
                    setCustomerId = {setCustomerId}
                    setCustomerName={setCustomerName}
                    customerName={customerName}
                  />
                </Grid>
              </Grid>

              {inputFields.map((input,index) => {
              
              return (
              <Grid key={index} container spacing={3}>
                <Grid xs={12} md={5}>
                  <ItemListSidebar
                    openFilter={Itemopen}
                    onOpenFilter={handleOpenItem}
                    onCloseFilter={handleCloseItem}
                    productData = {PRODUCTDATA}
                    setItemId = {setItemId}
                    setItemPriceParent = {setItemPriceParent}
                    setItemNameParent = {setItemNameParent}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField fullWidth label="Quantity" name="quantity" type="number" value={input.quantity} onChange={event => handleFormChange(index, event)}/>
                </Grid>
                <Grid xs={12} md={5}>
                  {/* <TextField fullWidth label="Quantity" name="quantity" onChange={handleChange} type="number" /> */}
                </Grid>
              </Grid>
              )
              })}
            </Box>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={addFields} disabled={!inputFields[index].quantity || !inputFields[index].item_id}>
              {t('Add More')} 
            </Button>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }} >
          {/* <Button variant="outlined" color="primary" onClick={()=>{downloadChallan()}}>
            Download Invoice
          </Button> */}
            <Button variant="contained" onClick={()=>{saveAndDownloadInvoices()}}>
              {t('Save & Get Invoice')}
            </Button>
          </CardActions>
        </Card>
      </form>

      <Snackbar open={alertopen} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{vertical:'bottom',horizontal:'right'}}>
            <Alert
              onClose={handleAlertClose}
              severity="success"
              sx={{ width: "200%" }}
            >
              Invoice saved successfully
            </Alert>
          </Snackbar>
    </>
  );
}
