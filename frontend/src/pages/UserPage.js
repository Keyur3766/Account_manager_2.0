import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { NavLink as RouterLink, json,Link, Route,Routes, useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import Cookie from 'js-cookie';

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Backdrop,
  CircularProgress
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import GetChallan from './GetChallans'
import UserServices from '../services/UserServices';


// SELECT customer_id,issue_date,COUNT(*) FROM challans WHERE payment_status='false' and customer_id=4 GROUP BY customer_id,issue_date;
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Mobile Number', alignRight: false },
  { id: 'Email', label: 'Email Address', alignRight: false },
  { id: 'City', label: 'City', alignRight: false },
  { id: 'pending', label: 'Pending Challans', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  // console.warn(b[orderBy]);
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('Name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);
  const [currId, setcurId] = useState("");

  const [selectedCustomer, setSelectedCustomer] =  useState('');
  const [pendingchallans, setPendingChallans] = useState([]);

  const getCustomerData = async() => {
    
    
    await UserServices.FetchCustomer().then((res)=>{
      setData(res.data);
      
      res.data.map(d => {
        return (
          
          UserServices.Get_ChallanCountById(d.id).then((res) => {

            const resdata = res.data;
            setPendingChallans([
              ...pendingchallans,
              {id: d.id, pending: resdata}
            ])
    
            console.log(resdata); 
          
          })
        );
      });
    });
  };
  // const PENDINGCHALLANDATA = Array.from(pendingchallans);

  const CUSTOMERDATA = Array.from(data);  

  

  const mergeStates = () => {
    const mergedState = data.map(obj1 => {
      const obj2 = pendingchallans.find(obj2 => obj2.id === obj1.id);
      return obj2 ?{ ...obj1, ...obj2 }:obj1;
    });
    setData(mergedState);
  };

useEffect(() => {
  const fetchData = async () => {
    // const token = await Cookie.get('jwtToken');
    try{
      const res = await UserServices.FetchCustomer();
      

      console.warn(res);
      if(res.data===undefined){

        if(res.response.status===401){
          navigate('/login');
        }
        // throw new Error('Response data undefined');
      }
      setData(res.data)
  
      const promises = res.data.map((entry) => UserServices.Get_ChallanCountById(entry.id).then((res)=>{
        const newPendingChallan = { id: entry.id, pending: res.data };
        setPendingChallans((prevPendingChallans) => [...prevPendingChallans, newPendingChallan]);
  
      }));
      await Promise.all(promises); // wait for all promises to resolve
    }
    catch(error){
        navigate('/404');
    }
    
  };

  fetchData();
}, []);

useEffect(() => {
  mergeStates();
}, [pendingchallans]);




  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = CUSTOMERDATA.map((n) => n.Name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDelete = () => {
    try {
      UserServices.Customer_Delete(currId).then((res) => {
        console.log("Customer Deleted successfully");
        getCustomerData();
        handleCloseMenu();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePendingChallanCount = (my_id) => {  
    try{
      UserServices.Get_ChallanCountById(my_id).then((res) => {

        const resdata = res.data;
        setPendingChallans([
          ...pendingchallans,
          {id: my_id, pending: resdata}
        ])

        // console.log(resdata); 
      
      });
    }
    catch(error){
      console.log(error);
      // return null;
    }
  };



  const navigate = useNavigate();
  const handleclickChallanPage = (id) => {
    console.log(id);
    // setSelectedCustomer(id);
    navigate('/dashboard/GetChallan', { state: { id } });
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - CUSTOMERDATA.length) : 0;

  const filteredUsers = applySortFilter(CUSTOMERDATA, getComparator(order, orderBy), filterName);
  
  
  const isNotFound = !filteredUsers.length && !!filterName;

  const { t } = useTranslation();


  return (
    <>
      <Helmet>
        <title> Customers </title>
      </Helmet>
      {!CUSTOMERDATA || !pendingchallans? <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      > 
  <CircularProgress color="inherit" />
</Backdrop>: 
<>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('customer')}
          </Typography>
          <Button
            component={RouterLink}
            to="/dashboard/AddCustomer"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('New Customer')}
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={CUSTOMERDATA.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, Name, Email, Address, City, Mobile,pending } = row;
                    const selectedUser = selected.indexOf(Name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={Name} src="/assets/images/avatars/avatar_2.jpg" />
                            <Typography variant="subtitle2" noWrap>
                              {Name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{Mobile}</TableCell>

                        <TableCell align="left">{Email}</TableCell>

                        <TableCell align="left">{City}</TableCell>

                        <TableCell align="left">
                          {/* <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}

                          {/* {filteredPendingChallans.map((d, index) =>
                            d.id === id ? (
                              <button key={index} onClick={() => handleclickChallanPage(id)}>
                                   <Label color={'error'}>{d.pending}</Label>
                              </button>

                              // <Link key={index} to={{ pathname: '/dashboard/user/GetChallan', state: { id } }}>
                                // <Label color={'error'}>{d.pending}</Label>
                              //  </Link>
                            ) : (
                              ''
                            )
                          )} */}

                            <button onClick={() => handleclickChallanPage(id)}>
                                   <Label color={'error'}>{pending}</Label>
                              </button>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              setOpen(event.currentTarget);
                              setcurId(id);
                            }}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={CUSTOMERDATA.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete()}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      </>
}
    </>

    
  );
}
