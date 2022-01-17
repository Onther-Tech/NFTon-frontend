export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const EXCHANGE = '0x411fEBE2831Ab727a031236Dd5C1b14419a31215';
export const TRANSFER_PROXY = '0xeE45c2A0b26Ac01179865ed8BbadAC5d246AeDC2';
export const ERC20_TRANSFER_PROXY = '0x71C0109cB7C941012B9a0DBb6E496D3dcc38ff2e';
export const COLLECTION_FACTORY = '0x69DF1A6e32f79cbF47c664e4e59c039e468d5eb5';
export const TOKEN_BASE_URI = 'https://gateway.ipfs.io/ipfs/';
export const FEE_DECIMAL = 4;

export const assets = {
  TOS: '0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd',
  TON: '0x44d4f5d89e9296337b8c48a332b3b2fb2c190cd0',
  WTON: '0x709bef48982bbfd6f2d4be24660832665f53406c',
  DOC: '0xb109f4c20bdb494a63e32aa035257fba0a4610a4'
};

export const decimals = {
  TOS: 18,
  TON: 18,
  WTON: 27,
  DOC: 18
};

export const assetsByAddress = Object.fromEntries(Object.entries(assets).map(a => a.reverse()))

export const commonCollection = {
  "contract": "0xb99e6d05eC45C98C04dB3F669aE0cf5d2279261A",
  "name": "NFTon Market",
  "symbol": "NOM"
};
