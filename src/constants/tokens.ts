import ERC20 from "../contracts/erc20"

// export const tokenAddresses = [{
//     address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
//     token: 'SAND'
//   }, {
//     address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
//     token: 'Axie Infinity'
//   }, {
//     address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
//     token: 'Matic'
//   }, {
//     address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
//     token: 'Tether'
//   }, {
//     address: '0x111111111117dC0aa78b770fA6A738034120C302',
//     token: '1INCH'
//   }, {
//     address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
//     token: 'HEX'
//   }, {
//     address: '0x3d658390460295fb963f54dc0899cfb1c30776df',
//     token: 'COVAL'
//   }, {
//     address: '0x6b175474e89094c44da98b954eedeac495271d0f',
//     token: 'DAI'
//   }]


export const tokens: { [key: string]: ERC20 } = {
  "KDAI": new ERC20("KDAI", "0x5c74070fdea071359b86082bd9f9b3deaafbe32b", 18, ""),
  // "Tether": new ERC20("Tether", "0xdAC17F958D2ee523a2206206994597C13D831ec7", 6, ""),
  // "KUSDT": new ERC20("KUSDT", "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167",6,""),
  // "oUSDT": new ERC20("oUSDT","0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167",6,""),
}