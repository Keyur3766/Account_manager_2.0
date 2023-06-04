import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Popover, MenuItem, IconButton, Button, Dialog, FormHelperText,DialogActions, DialogTitle, DialogContent, DialogContentText,TextField, InputAdornment, FilledInput, OutlinedInput, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import Iconify from '../../../components/iconify';
import UserServices from '../../../services/UserServices';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product, callback }) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(null);

  const { Name, selling_price, purchase_price, item_color, total_stocks, imageType, imageData, imageName } = product;
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const [dialogopenstockIn, setdialogOpenstockIn] = useState(false);
  const [stockInQuant, setstockInQuant] = useState(0);
  const handleDialogOpenStockIn = () => {
    setdialogOpenstockIn(true);
  };

  const handleDialogCloseStockIn = () => {
    setdialogOpenstockIn(false);
  };

  // Dialog open stock out
  const [dialogopenstockOut, setdialogOpenstockOut] = useState(false);
  const [stockOutQuant, setstockOutQuant] = useState(0);
  const handleDialogOpenStockOut = () => {
    setdialogOpenstockOut(true);
  };

  const handleDialogCloseStockOut = () => {
    setdialogOpenstockOut(false);
  };
  // *****
  const handleDelete = () => {
    try {
      UserServices.Item_Delete(product.id).then((res) => {
        console.log("Item Deleted successfully");
        callback();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStockInrequest = () => {
    try{
      UserServices.UpdateStockIN(product.id, stockInQuant).then((res)=> {
        if(res.status===200){
          console.log("Stock added....");
          setdialogOpenstockIn(false);
          window.location.reload();
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleStockoutrequest = () => {
    try{
      UserServices.UpdateStockOUT(product.id, stockOutQuant).then((res)=> {
        if(res.status===200){
          console.log("Stock removed....");
          setdialogOpenstockOut(false);
          window.location.reload();
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {/* {(
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            
          </Label>
        )} */}

          <StyledProductImg alt={Name} src={`data:${imageType};base64,${imageData}`} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link color="inherit" underline="hover">
            <Typography variant="subtitle2" noWrap>
              {Name}
            </Typography>
          </Link>

          <Typography component="span" variant="body1">
            Purchase Price: &nbsp; &#x20B9;{purchase_price}
          </Typography>

          <Typography variant="subtitle1">
            Sale Price: &nbsp;
            &#x20B9;{selling_price}
          </Typography>

          <Typography variant="subtitle2">
            Available: &nbsp;
            {total_stocks}
            &nbsp;
          </Typography>
        </Stack>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Button
            onClick={handleDialogOpenStockIn}
            variant="outlined"
            color="success"
            sx={{ color: '#006400', borderColor: '#006400' }}
          >
            + {t('STOCK IN')}
          </Button>
          <Button onClick={handleDialogOpenStockOut} variant="outlined" color="error">
            - {t('STOCK OUT')}
          </Button>
        </Stack>
        {/* Dialog box component for stock In starts */}
        <Dialog open={dialogopenstockIn} onClose={handleDialogCloseStockIn}>
          <DialogTitle>{t('Stock In')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('Enter quantity of purchased or manufactured items')}</DialogContentText>

            <Grid spacing={3}>
              <Grid xs={12} md={12}>
                <FilledInput
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Add Stock in pieces"
                  type="number"
                  value={stockInQuant}
                  onChange={(e) => setstockInQuant(e.target.value)}
                  fullWidth
                  variant="standard"
                  endAdornment={<InputAdornment position="end">{t('Pieces')}</InputAdornment>}
                />
              </Grid>
            </Grid>
            <br />
            <Grid spacing={3} style={{ display: "flex", flexDirection: "row",justifyContent:"space-between" }}>
              <Grid xs={12} md={5.7}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  value={total_stocks}
                  aria-describedby="outlined-weight-helper-text"
                  label="Add Stock in pieces"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  disabled
                />
                <FormHelperText id="outlined-weight-helper-text">{t('Available stock')}</FormHelperText>
              </Grid>

              <Grid xs={12} md={5.7}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  label="Add sale price for pieces"
                  value={purchase_price}
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  disabled
                />
                <FormHelperText id="outlined-weight-helper-text">{t('Purchase Price')}</FormHelperText>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCloseStockIn}>{t('Cancel')}</Button>
            <Button onClick={handleStockInrequest}>{t('Stock IN')}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialogue component for stock in ends */}



        {/* Dialogue for stock out starts */}
        <Dialog open={dialogopenstockOut} onClose={handleDialogCloseStockOut}>
          <DialogTitle>{t('Stock OUT')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('Enter quantity of sold items')}</DialogContentText>

            <Grid spacing={3}>
              <Grid xs={12} md={12}>
                <FilledInput
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Stock out pieces"
                  type="number"
                  value={stockOutQuant}
                  onChange={(e) => setstockOutQuant(e.target.value)}
                  fullWidth
                  variant="standard"
                  endAdornment={<InputAdornment position="end">{t('Pieces')}</InputAdornment>}
                />
              </Grid>
            </Grid>
            <br />
            <Grid spacing={3} style={{ display: "flex", flexDirection: "row",justifyContent:"space-between" }}>
              <Grid xs={12} md={5.7}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  value={total_stocks}
                  aria-describedby="outlined-weight-helper-text"
                  label="Add Stock in pieces"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  disabled
                />
                <FormHelperText id="outlined-weight-helper-text">{t('Available stock')}</FormHelperText>
              </Grid>

              <Grid xs={12} md={5.7}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  label="Add sale price for pieces"
                  value={selling_price}
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  disabled
                />
                <FormHelperText id="outlined-weight-helper-text">{t('Sale Price')}</FormHelperText>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCloseStockOut}>{t('Cancel')}</Button>
            <Button onClick={handleStockoutrequest}>{t('Stock OUT')}</Button>
          </DialogActions>
        </Dialog>

        {/* Dialogue for stock out ends */}
        <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      </Card>
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
        

        <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete()}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
