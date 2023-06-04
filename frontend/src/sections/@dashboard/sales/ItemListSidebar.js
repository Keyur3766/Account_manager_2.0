import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  TextField,
  Card,
  Link,
  CardHeader,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import { ColorMultiPicker } from '../../../components/color-utils';


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

ItemList.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};



export default function ItemList({ openFilter, onOpenFilter, onCloseFilter, productData, setItemId, setItemPriceParent, setItemNameParent}) {
  
  const handleButtonClick = (itemname,id,selling_price) => {
    setItemId(id);
    setItemNameParent(itemname);
    setItemPriceParent(selling_price);
    setItemName(itemname);
    onCloseFilter();
  }
  const [itemName,setItemName] = useState(null);
  const {t} = useTranslation();
  return (
    <>
      <TextField fullWidth label={t('Item name')} name="itemname" value={itemName || ""} onClick={onOpenFilter} required />
      {/* <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button> */}

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 400, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {t('Items')}
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />
        {/* Item Section */}
        <Card>
          {/* <Scrollbar> */}
          
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              {/* Start list from here */}
              {productData.map((row)=>{

                return(
              
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  component="img"
                  alt="title"
                  src={`data:${row.imageType};base64,${row.imageData}`}
                  sx={{ width: 48, height: 48, borderRadius: 1.5}}
                />

                <Box sx={{ minWidth: 170}}>
                  <Link color="inherit" variant="body1" underline="hover" noWrap>
                    {row.Name}
                  </Link>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    Sale price: &#x20B9;{row.selling_price}
                  </Typography>

                </Box>
                <Box>
                <Button variant="outlined" name="item_id" onClick={()=>{handleButtonClick(row.Name,row.id,row.selling_price);}}>
                    {t('Add Item')}
                </Button>
                </Box>
              </Stack>
                )
            })}
              {/* End list from here */}
            </Stack>
          {/* </Scrollbar> */}
        </Card>

        {/* <Scrollbar>
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: 320,
              gap: 2,
              '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
          >
            <AspectRatio ratio="1" sx={{ width: 90 }}>
              <img
                src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
                srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
            <div>
              <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
                Item Name
              </Typography>
              <Typography fontSize="sm" aria-describedby="card-description" mb={0}>
                <Link overlay underline="none" href="#interactive-card" sx={{ color: 'text.tertiary' }}>
                  Stock available
                </Link>
              </Typography>
              <Typography fontSize="sm" aria-describedby="card-description" mb={1}>
                Stock available
              </Typography>
            </div>
          </Card>
        </Scrollbar> */}
      </Drawer>
    </>
  );
}
