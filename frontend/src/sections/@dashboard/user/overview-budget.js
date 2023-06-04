import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography,Checkbox, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const OverviewBudget = (props) => {
  const { difference, positive = false, sx, value, saveAndDownloadInvoices, isChecked, handleCheckboxChange } = props;
  const {t} = useTranslation();
  return (
    
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {t('Pending Challans')}
            </Typography>
            <Typography variant="h4">&#x20B9; {value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography color={positive ? 'success.main' : 'error.main'} variant="body2">
                {difference}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              {t('Pending Challans')}
            </Typography>
          </Stack>
        )}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox color="success" checked={isChecked}
          onChange={handleCheckboxChange} />
          <Typography>{t('Do you want to mark it as Paid?')}</Typography>
        </Stack>

        <Button variant="outlined" onClick={saveAndDownloadInvoices}>{t('Get Invoice')}</Button>
      </CardContent>
    </Card>
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
