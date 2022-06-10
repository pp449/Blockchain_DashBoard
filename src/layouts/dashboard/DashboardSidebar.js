import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, SvgIcon, MenuItem } from '@mui/material';
// mock
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';
import { ReactComponent as metamaskIcon } from '../../coin_icon/METAMASK.svg';
import { useWeb3Context } from '../../hooks';
import MenuPopover from "../../components/MenuPopover";
import account from "../../_mock/account";
import errorModal from "../../modal/errorModal";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

const AccountStyle2 = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2, 2.5),
  alignItems: 'center',
  color:'black',
}));
// ---------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};



export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  // const { account, setAccount } = useState();
  const [openMetamask,setOpenMetamask] = useState(false);
  const { connect,disconnect,hasCachedProvider, provider, connected, address, web3Modal, providerChainID } = useWeb3Context();
  const anchorRef = useRef(null);

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (hasCachedProvider()) {
      connect();
    }
  }, []);

  const handleOpenMetamask = () => {
    setOpenMetamask(true);
  };

  const handleCloseMetamask = () => {
    setOpenMetamask(false);
  };

  const sliceAddress = () => {
    let add = address.slice(0,5);
    add += '...';
    add += address.slice(-4);
    return add;
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {account.displayName ? account.displayName : 
                <RouterLink to="/login" variant="text">계정가입을 해주세요</RouterLink>
                }
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
        {address ? (
          <Link underline="none" component="button" onClick={handleOpenMetamask}>
            <AccountStyle2 sx={{ border: 1, borderColor: '#dee3eb', width:1, borderRadius: 1.5 }} ref={anchorRef}>
              <SvgIcon sx={{ mr:2 }} component={metamaskIcon} inheritViewBox />
              {sliceAddress()}
            </AccountStyle2> 
          </Link>
          ) : 
          <Link underline="none" component="button" onClick={connect}>
            <AccountStyle2>
              <SvgIcon sx={{ mr:2 }} component={metamaskIcon} inheritViewBox />
              메타마스크 연결
            </AccountStyle2>
          </Link>
          }
      </Box>

      <MenuPopover
        open={openMetamask}
        onClose={handleCloseMetamask}
        anchorEl={anchorRef.current}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          <MenuItem key="account" >
            지갑 주소
          </MenuItem>
          <MenuItem key="disconnect" onClick={disconnect}>
            연결 끊기
          </MenuItem>
        </Stack>
      </MenuPopover>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
