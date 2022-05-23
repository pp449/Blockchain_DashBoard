import { useState, useEffect } from 'react';
import axios from "axios";
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

const mockAddress = "0x1938A448d105D26c40A52a1Bfe99B8Ca7a745aD0";   // etherscan mock address
const mockAddress2 = "0xa312373faa18649689959cb5b8a2be95d63452bf";  // klaytnscope mock address

export default function DashboardApp() {
  const [tokenBalances, setTokenBalances] = useState([]);

  const arr = [];
  useEffect(()=> {
    // getBalanceOfToken();
    getTokenInformation();
  },[]) 

  const getTokenInformation = () => {
    axios({
      method: 'get',
      url: `https://api.covalenthq.com/v1/1/address/${mockAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_2e63764c1c1047eb852e6342bc4`
    })
    .then((response) => {
      response.data.data.items.map((item) => {
        if(item.balance !== "0" && item.contract_name !== null){
          item.balance *= 1;
          arr.push(item);
        }
        return 0;
      })
      setTokenBalances(arr);
    })
  }

  // const getBalanceOfToken = async() => {
  //   // eslint-disable-next-line no-restricted-syntax
  //   for (const [key, token] of Object.entries(tokens)) {
  //     let tmp;
  //     token.balanceOf(mockAddress)
  //     .then(res=> {
  //       arr.push(res);
  //     }).catch(err => {
  //       console.log(err);
  //     })
  //   }
  //   Promise.all(arr);
  //   console.log("arr: ", arr);
  //   // if(result!=='0'){
  //   //   console.log(token.name);
  //   //   const newExistToken = {
  //   //     "tokenName": token.name,
  //   //     result,
  //   //   };
  //   //   arr.push(newExistToken)
  //     // setTokenBalances(arr);
  //   // }
  // }

  const getCoinchartHours = () => {
    const today = new Date();
    const hours = today.getHours();
    const arr=[];
    for(let i=hours-10;i<=hours; i+=1){
      let j = i;
      if(j<1){
        j = 24-j;
      }
      arr.push(j);
    }
    return arr;
  }

  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          코인 포트폴리오
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <AppAmount 
              title="보유 잔액"
            />
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
          {console.log(tokenBalances)}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="코인 보유량"
              chartData={tokenBalances}
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
              chartData={[
                { label: '트론', value: 31 },
                { label: '알고랜드', value: 20 },
                { label: '1인치네트워크', value: 14 },
                { label: '저스트', value: 10 },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
