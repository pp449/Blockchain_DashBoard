import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { useWeb3Context } from '../hooks';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppAmount,
} from '../sections/@dashboard/app';
import { tokens } from '../constants';
import { getBalanceABI } from '../abi';
import { ReactComponent as DAI } from '../coin_icon/DAI.svg';
import { ReactComponent as KDAI } from '../coin_icon/KDAI.svg';
import { ReactComponent as KETH } from '../coin_icon/KETH.svg';
import { ReactComponent as KLAY } from '../coin_icon/KLAY.svg';
import { ReactComponent as KORC } from '../coin_icon/KORC.svg';
import { ReactComponent as KSP } from '../coin_icon/KSP.svg';
import { ReactComponent as KUSDC } from '../coin_icon/KUSDC.svg';
import { ReactComponent as KUSDT } from '../coin_icon/KUSDT.svg';
import { ReactComponent as KXRP } from '../coin_icon/KXRP.svg';

// ----------------------------------------------------------------------

const mockAddress1 = '0x1938A448d105D26c40A52a1Bfe99B8Ca7a745aD0'; 
const mockAddress2 = '0x191915D2370693ECa0bc7BB0d14bAA3A12E8e96B'; 
const mockAddress3 = '0xbEF22A7b62bdAc0faE9bB7584c26b5eebC58C5Ee';

export default function DashboardApp() {
  const { connect,disconnect,hasCachedProvider, provider, connected, address, web3Modal, providerChainID } = useWeb3Context();
  const [amount, setAmount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [slicedToken, setSlicedToken] = useState([]);
  const [etherPrice, setEtherPrice] = useState();

  useEffect(() => {
    if (hasCachedProvider()) {
      connect();
    }
    getBalances();
  }, []);

  const getTokenInfo = async (token) => {
    const result = {
      symbol: "",
      balance: 0,
      price: 0
    };

    if (token.balance !== '0' && token.contract_name !== null) {
      try {
        const response1 = await axios({
          method: 'get',
          url: `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${token.contract_address}/?&key=ckey_e858c1b66f7047a18daf240e3de`
        });
        const response2 = await axios({
          method: 'get',
          url: `https://api.covalenthq.com/v1/pricing/historical/USD/${token.contract_ticker_symbol}/?quote-currency=USD&format=JSON&key=ckey_e858c1b66f7047a18daf240e3de`
        })
        const response3 = await axios({ //for ethereum price
          method: 'get',
          url: `https://api.covalenthq.com/v1/pricing/historical/USD/WETH/?quote-currency=USD&format=JSON&key=ckey_e858c1b66f7047a18daf240e3de`
        })
        
        setEtherPrice(response3.data.data.prices[0].price)

        const bal = response1.data.data[0].prices[0].price < response2.data.data.prices[0].price ? response1.data.data[0].prices[0].price : response2.data.data.prices[0].price;
        result.symbol = token.contract_ticker_symbol;
        result.balance = token.balance / 10 ** token.contract_decimals;
        result.price = result.balance * bal;
        // result.price = result.balance * response.data.data.prices[0].price;
      } catch(e) {
      }
    }    
    return result;
  };

  const getBalances = async () => {
    console.log("address: ", address);
    let currentTotalPrice = 0;

    const health = await axios.post(`https://wkzkh0240l.execute-api.ap-northeast-2.amazonaws.com/dev/userHealth`, {
            address: address,
    })
    if(health.data.deciCollarteral > 0){
      const mockData = [{
        symbol: "담보",
        price: health.data.deciCollarteral,
      },
      {
        symbol: "부채",
        price: health.data.deciDept,
      },
      {
        symbol: "대출가능금액",
        price: health.data.deciBorrowAvailable,
      },
      {
        symbol: "청산 위험도",
        price: health.data.deciHealthFactor,
      }
      ];
      setLoanData(mockData);
      setLoanAmount(mockData[1].price);
      currentTotalPrice += mockData[0].price + mockData[1].price;
    }

    const balance = await axios({
      method: 'get',
      url: `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_e858c1b66f7047a18daf240e3de`,
    });
    const promises = []; 

    const items = balance.data.data.items;

    for(let index = 0; index < items.length; index += 1) {
      promises.push(getTokenInfo(items[index]));
    }

    const results = await Promise.all(promises);
    const tokens = [];

    for(let index=0; index < results.length; index +=1) {
      if(results[index].price > 1) {
        tokens.push(results[index]);
      }
    }
    tokens.sort((a, b) => b.balance - a.balance);
    setSlicedToken(tokens.slice(0,4));

    tokens.sort((a,b) => b.price - a.price);
    setTokenBalances(tokens);


    tokens.forEach(result => {
      currentTotalPrice += result.price;
    })
    setAmount(Math.floor(currentTotalPrice));
  };
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          코인 포트폴리오
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <AppAmount title="보유 잔액" amount={amount} loanAmount={loanAmount}/>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="대출현황"
              subheader="단위 $"
              chartData={loanData}
              color="f00"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="코인 보유량"
              chartData={slicedToken}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="코인잔액"
              chartData={tokenBalances}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
