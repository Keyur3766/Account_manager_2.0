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
  const { _id } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState();
  const [totalPendingAmount, setPendingAmount] = useState(0);
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
          const updateDone = await UserServices.Update_ChallanStatusById(_id).then((res)=> {
            console.warn('Challan status changed');
            console.log(res.data);
          });
        }  

        const response = await UserServices.SaveAndDownloadInvoice(_id, filteredInvoiceData).then((res)=>{
            console.log('success');
            return res;
        });

        console.warn(response);
    }
    catch(error){
      console.log(error);
    }
  };


  const GetChallanData = (my_id) => {
    try {
      UserServices.Get_ChallanDetailsById(my_id).then((res) => {
        const resdata = res.data;
        setData(resdata);
        console.warn(resdata);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const GetTotalPendingAmount = (id) => {
    try {
      UserServices.GetPendingAmount(id).then((res) => {
        const pendingAmount = Number(res.data[0].totalAmount);
        setPendingAmount(pendingAmount);
      });
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    GetChallanData(_id);
    GetTotalPendingAmount(_id);
  }, []);

  if (loading) {
    return <div>loading....</div>
  }
  if(!loading && data.length===0){
    return <div>No data found</div>
  }
  
  return (
    <>
    <div>
    <OverviewBudget
          difference={Object.keys(data).length}
          negative
          sx={{ height: '6.5%', mb: 3, width:'40%' }}
          value={1.18 * totalPendingAmount}
          saveAndDownloadInvoices = {saveAndDownloadInvoices}
          isChecked = {isChecked}
          setIsChecked = {setIsChecked}
          handleCheckboxChange = {handleCheckboxChange}
        />
    </div>
      
      {data.map((dayWiseData) => (
        <>
          <Typography key={dayWiseData._id} variant="h4" component="h2" sx={{ ml: 6 }}>
            {t('Date')}: {formatDate(dayWiseData._id)}
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
                {dayWiseData.itemList.map((row, index) => (
                  <TableRow>
                    <TableCell>{row.item_Name}</TableCell>
                    <TableCell align="right">{row.totalQuantity}</TableCell>
                    <TableCell align="right">{row.item_selling_price}</TableCell>
                    <TableCell align="right">&#x20B9; {ccyFormat(row.subtotal)}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>{t('Subtotal')}</TableCell>
                  <TableCell align="right">&#x20B9; {ccyFormat(Number(dayWiseData.totalSales))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Tax')}</TableCell>
                  <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                  <TableCell align="right">&#x20B9; {ccyFormat(Number(dayWiseData.totalSales*0.18))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>{t('Total')}</TableCell>
                  <TableCell align="right">&#x20B9; {ccyFormat(Number(dayWiseData.totalSales*1.18))}</TableCell>
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
