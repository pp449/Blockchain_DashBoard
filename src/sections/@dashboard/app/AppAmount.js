import { Card, CardHeader, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { useEffect, useState } from 'react';

export default function AppAmount({title,subheader,amount, loanAmount, ...other}) {
    return(
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            <List sx={{ml:4, mt: 2}}>
                <Box component="div" sx={{ borderBottom: '1px dashed grey '}}>
                <ListItem disablePadding sx={{mb:4}}>
                    <ListItemIcon>
                    <AccountBalanceWalletIcon sx={{width: '3.5rem', height: '3.5rem'}}/>
                    </ListItemIcon>
                    <ListItemText sx={{ml:2}} primaryTypographyProps={{fontWeight: '300'}} primary="총 잔액" secondary={`$ ${amount.toLocaleString('en-US')}`}/>
                </ListItem>
                </Box>
                <ListItem disablePadding sx={{mt:4, mb:4}}>
                    <ListItemIcon>
                    <CreditScoreIcon sx={{width: '3.5rem', height: '3.5rem'}}/>
                    </ListItemIcon>
                    <ListItemText sx={{ml:2}} primaryTypographyProps={{fontWeight: '300'}} primary="대출액" secondary={`$ ${loanAmount.toLocaleString('en-US')}`}/>
                </ListItem>
            </List>
        </Card>
    )
}