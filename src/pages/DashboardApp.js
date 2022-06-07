import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
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

const mockAddress = '0x1938A448d105D26c40A52a1Bfe99B8Ca7a745aD0'; // etherscan mock address
const mockAddress2 = '0x3436100674492BCe353C6709ec11DEd32b1A797a'; // klaytnscope mock address

export default function DashboardApp() {
  const [amount, setAmount] = useState("");
  const [tokenBalances, setTokenBalances] = useState([]);
  const [slicedToken, setSlicedToken] = useState([]);

  useEffect(() => {
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
          url: `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${token.contract_address}/?&key=ckey_2e63764c1c1047eb852e6342bc4`
        });
        const response2 = await axios({
          method: 'get',
          url: `https://api.covalenthq.com/v1/pricing/historical/USD/${token.contract_ticker_symbol}/?quote-currency=USD&format=JSON&key=ckey_2e63764c1c1047eb852e6342bc4`
        })
        const bal = response1.data.data[0].prices[0].price < response2.data.data.prices[0].price ? response1.data.data[0].prices[0].price : response2.data.data.prices[0].price;
        result.symbol = token.contract_ticker_symbol;
        console.log(result.symbol,": ", bal);
        result.balance = token.balance / 10 ** token.contract_decimals;
        result.price = result.balance * bal;
        // result.price = result.balance * response.data.data.prices[0].price;
      } catch(e) {
        console.log("scam");
      }
    }    
    return result;
  };

  const getBalances = async () => {
    const balance = await axios({
      method: 'get',
      url: `https://api.covalenthq.com/v1/1/address/${mockAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_2e63764c1c1047eb852e6342bc4`,
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

    let currentTotalPrice = 0;

    tokens.forEach(result => {
      currentTotalPrice += result.price;
    })
    setAmount(Math.floor(currentTotalPrice));
  };

  const getCoinchartHours = () => {
    const today = new Date();
    const hours = today.getHours();
    const arr = [];
    for (let i = hours - 10; i <= hours; i += 1) {
      let j = i;
      if (j < 1) {
        j = 24 - j;
      }
      arr.push(j);
    }
    return arr;
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
            <AppAmount title="보유 잔액" amount={amount} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="코인 대출가격 추이"
              subheader="(+31%) than last year"
              chartLabels={getCoinchartHours()}
              chartData={[
                {
                  name: 'DAI',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'XRP',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'AVAX',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
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
