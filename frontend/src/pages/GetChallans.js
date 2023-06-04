import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useLocation } from 'react-router-dom';
import UserServices from '../services/UserServices';
import { OverviewBudget } from '../sections/@dashboard/user/overview-budget';

const TAX_RATE = 0.18;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function GetChallans(props) {
  const {t} = useTranslation();

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const location = useLocation();
  const { id } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState();
  const groupedData = {};

  const groupedInvoiceData = {};
  const subtotalData = {};
  const [filteredData, setfilteredData] = useState(null);
  const [filteredsubtotal, setfilteredsubtotal] = useState(null);
  const [filteredmasterSubtotal, setfilteredmastersubtotal] = useState(null);
  const [filteredInvoiceData, setfilteredInvoiceData] = useState(null);

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
  
  const saveAndDownloadInvoices = async() => {
    // console.warn('clicked');
    try{
        if(isChecked){
          const updateDone = await UserServices.Update_ChallanStatusById(id).then((res)=> {
            console.warn('Challan status changed');
            console.log(res.data);
          });
        }  

        const response = await UserServices.SaveAndDownloadInvoice(id, filteredInvoiceData).then((res)=>{
            console.log('success');
            return res;
        });

        console.warn(response);
    }
    catch(error){
      console.log(error);
    }
  };



  let masterTotal = 0;

  const GetChallanData = (my_id) => {
    try {
      UserServices.Get_ChallanDetailsById(my_id).then((res) => {
        const resdata = res.data;
        // console.warn(resdata);
        setData(resdata);
        resdata.forEach((item) => {
          if (!groupedData[item.issue_date]) {
            groupedData[item.issue_date] = [];
            subtotalData[item.issue_date] = 0;
          }
          groupedData[item.issue_date].push(item);
          groupedInvoiceData[item.item.id] = (groupedInvoiceData[item.item.id] || 0) + Number(item.totalQuantity);
          subtotalData[item.issue_date] += (item.totalQuantity * item.item.selling_price);
          masterTotal+=item.totalQuantity * item.item.selling_price;
        });

        const output = Object.entries(groupedInvoiceData).map(([item_id, quantity]) => ({ item_id, quantity: Number(quantity).toString() }));

        

        // console.warn(subtotalData);
        // console.warn(groupedInvoiceData);
        // console.warn(output);
        setfilteredInvoiceData(output);
        setfilteredData(groupedData);
        setfilteredsubtotal(subtotalData);
        setfilteredmastersubtotal(masterTotal);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetChallanData(id);
  }, []);

  if (filteredData == null) {
    // console.log('runnig');
    return <div>loading....</div>;
  }
  if(Object.keys(filteredData).length===0){
    return <div>No data found</div>
  }
  
  


  console.warn(filteredData);
  console.log(filteredsubtotal);

  const subtotal = 0;
  return (
    <>
    <div>
    <OverviewBudget
          difference={Object.keys(filteredData).length}
          negative
          sx={{ height: '6.5%', mb: 3, width:'40%' }}
          value={1.18 * filteredmasterSubtotal}
          saveAndDownloadInvoices = {saveAndDownloadInvoices}
          isChecked = {isChecked}
          setIsChecked = {setIsChecked}
          handleCheckboxChange = {handleCheckboxChange}
        />
    </div>
      
      {Object.entries(filteredData).map(([key, value]) => (
        <>
          <Typography key={key} variant="h4" component="h2" sx={{ ml: 6 }}>
            {t('Date')}: {formatDate(key)}
          </Typography>

          <br />
          <TableContainer sx={{ width: 900, mx: 'auto' }} component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    {t('Details')}
                  </TableCell>
                  <TableCell align="right">{t('Price')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Desc')}</TableCell>
                  <TableCell align="right">{t('Quantity')}.</TableCell>
                  <TableCell align="right">{t('Unit')}</TableCell>
                  <TableCell align="right">{t('Sum')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {value.map((row) => (
                  <TableRow key={row.challan_id}>
                    <TableCell>{row.item.Name}</TableCell>
                    <TableCell align="right">{row.totalQuantity}</TableCell>
                    <TableCell align="right">{row.item.selling_price}</TableCell>
                    <TableCell align="right">&#x20B9; {ccyFormat(row.totalQuantity*row.item.selling_price)}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>{t('Subtotal')}</TableCell>
                  <TableCell align="right">&#x20B9; {ccyFormat(Number(filteredsubtotal[key]))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Tax')}</TableCell>
                  <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                  <TableCell align="right">&#x20B9; {ccyFormat(Number(filteredsubtotal[key]*0.18))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>{t('Total')}</TableCell>
                  <TableCell align="right">&#x20B9; {ccyFormat(Number(filteredsubtotal[key]*1.18))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <br />
          <br />
          </>
      ))}
      </>
  );
}
