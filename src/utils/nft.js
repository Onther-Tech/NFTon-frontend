import {abi as erc20ABI} from '../abi/TestERC20.json';
import {abi as erc721ABI} from '../abi/TestERC721.json';
import {abi as factoryABI} from '../abi/CollectionFactory.json';
import {abi as exchangeABI} from '../abi/Exchange.json';
import {abi as brandCollectionABI} from '../abi/ERC721Collection.json';
import {abi as commonCollectionABI} from '../abi/ERC721Public.json';

import {ethers} from 'ethers';
import {dec, enc, ERC20, ERC721, ETH, id, ORDER_DATA_V1} from "./assets";
import {
  assets,
  assetsByAddress,
  COLLECTION_FACTORY,
  commonCollection,
  decimals,
  ERC20_TRANSFER_PROXY,
  EXCHANGE,
  FEE_DECIMAL,
  TOKEN_BASE_URI,
  TRANSFER_PROXY,
  ZERO_ADDRESS
} from "../constants/contract";
import {parseEther, parseUnits} from "ethers/lib/utils";
import numeral from "numeral";
import axios from "axios";
import {isNull} from "./index";

let provider;

if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  console.log('set provider: window.ethereum');
} else {
  provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_HTTP_RPC, "any");
  console.log('set provider: http rpc');
}

function AssetType(assetClass, data) {
  return {assetClass, data}
}

function Asset(assetClass, assetData, value) {
  return {assetType: AssetType(assetClass, assetData), value};
}

function Order(maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data) {
  return {maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data};
}

const signOrder = async (order, account, verifyingContract) => {
  const name = "Exchange";
  const version = "2";

  const rawSignature = await account._signTypedData(
    {
      chainId: 4,
      name,
      version,
      verifyingContract,
    },
    {
      Order: [
        {name: 'maker', type: 'address'},
        {name: 'makeAsset', type: 'Asset'},
        {name: 'taker', type: 'address'},
        {name: 'takeAsset', type: 'Asset'},
        {name: 'salt', type: 'uint256'},
        {name: 'start', type: 'uint256'},
        {name: 'end', type: 'uint256'},
        {name: 'dataType', type: 'bytes4'},
        {name: 'data', type: 'bytes'},
      ],
      AssetType: [
        {name: 'assetClass', type: 'bytes4'},
        {name: 'data', type: 'bytes'}
      ],
      Asset: [
        {name: 'assetType', type: 'AssetType'},
        {name: 'value', type: 'uint256'}
      ],
    },
    order
  );

  return rawSignature;
};

function generateSalt() {
  let randomStr = Date.now() + '' + Math.round(Math.random() * 1000);
  return randomStr;
}

export const mint = async (collectionAddress, assetURI) => {
  let tx;

  if (collectionAddress === commonCollection.contract) {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(collectionAddress, commonCollectionABI, provider);

    tx = await contract.connect(signer)['mint(string)'](assetURI);

  } else {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(collectionAddress, brandCollectionABI, provider);

    tx = await contract.connect(signer)['mint(address,string)'](address, assetURI);
  }

  const receipt = await tx.wait();
  const transferEvent = receipt.events.find(x => x.event === 'Transfer');
  const tokenId = ethers.BigNumber.from(transferEvent.args['tokenId']).toNumber();

  return {
    contractAddress: collectionAddress,
    transactionHash: receipt.transactionHash,
    tokenId: tokenId
  };
}

export const approveTransferProxy = async (collectionAddress) => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const contract = new ethers.Contract(collectionAddress, commonCollectionABI, provider);

  const isApprovedForAll = await contract.isApprovedForAll(address, TRANSFER_PROXY);

  if (isApprovedForAll !== false) {
    return;
  }

  const tx = await contract.connect(signer).setApprovalForAll(TRANSFER_PROXY, true);
  await tx.wait();

  return tx.hash;
}

export const encodeRoyaltyData = (data) => {
  return ethers.utils.defaultAbiCoder.encode(
    ["tuple(tuple(address,uint96)[], tuple(address,uint96)[])"],
    [data]
  );
}

export const decodeRoyaltyData = (data) => {
  return ethers.utils.defaultAbiCoder.decode(
    ["tuple(tuple(address,uint96)[], tuple(address,uint96)[])"],
    data
  );
}

export const getRoyaltyInfo = (data) => {
  const decoded = decodeRoyaltyData(data);
  if(decoded && decoded.length > 0) {
    const [address, ratio] = decoded[0][1][0];

    return {
      address: address,
      ratio: ethers.utils.formatUnits(ratio.toString(), FEE_DECIMAL) * 100
    }
  }
}

export const isValidMetadata = (metadata) => {
  return (
    metadata.hasOwnProperty('attributes') &&
    metadata.hasOwnProperty('creator') &&
    metadata.hasOwnProperty('description') &&
    metadata.hasOwnProperty('image') &&
    metadata.hasOwnProperty('name') &&
    metadata.hasOwnProperty('type')
  );
}

export const makeOrder = async (collection, tokenId, asset, marketType, price, unit, royaltyRatio, royaltyTo, start, end) => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const salt = generateSalt();

  const makeInfo = {
    contractId: "ERC721",
    contractAddress: collection.contract,
    collectionName: collection.name,
    tokenId: ethers.BigNumber.from(tokenId).toNumber(),
    asset: {
      attributes: asset.attributes,
      creator: asset.creator,
      description: asset.description,
      image: asset.image,
      name: asset.name,
      type: asset.type,
    },
    value: 1,
  };

  const takeInfo = {};

  const makeAsset = Asset(id(makeInfo.contractId), enc(makeInfo.contractAddress, makeInfo.tokenId), makeInfo.value);
  let takeAsset;

  if (unit === 'ETH') {
    takeAsset = Asset(ETH, enc('0x0000000000000000000000000000000000000000'), parseEther(price).toString());
  } else {
    takeAsset = Asset(ERC20, enc(assets[unit]), parseUnits(price, decimals[unit]).toString());
  }

  const dataType = ORDER_DATA_V1;
  const payouts = [];
  const origins = [[royaltyTo, (royaltyRatio / 100) * 10 ** FEE_DECIMAL]];
  const encodedData = encodeRoyaltyData([payouts, origins])

  const order = Order(
    address.toLowerCase(),
    makeAsset,
    ZERO_ADDRESS,
    takeAsset,
    salt,
    start || 0,
    end || 0,
    dataType,
    encodedData
  );

  const sign = await signOrder(order, signer, EXCHANGE);

  order.takeAsset.value = order.takeAsset.value.toString();

  const payload = {
    chainId: process.env.REACT_APP_CHAIN_ID,
    platform: process.env.REACT_APP_CHAIN_PLATFORM,
    type: marketType,
    exchangeAddress: EXCHANGE,
    transferProxy: TRANSFER_PROXY,
    erc20TransferProxy: ERC20_TRANSFER_PROXY,
    sign: sign,
    categoryIdcategories: 5,
    ...order,
    makeInfo: makeInfo,
    takeInfo: takeInfo
  };

  return payload;
}

export const createCollection = async (name, symbol) => {
  const signer = provider.getSigner();
  const admin = await signer.getAddress();
  const factory = new ethers.Contract(COLLECTION_FACTORY, factoryABI, provider);
  const salt = generateSalt();

  const tx = await factory.connect(signer).create(
    name,
    symbol,
    admin.toLowerCase(),
    salt,
    TRANSFER_PROXY,
    TOKEN_BASE_URI
  );

  const receipt = await tx.wait();
  const createdEvent = receipt.events.find(x => x.event === 'CreatedCollection');
  const createdAddress = createdEvent.args['collection'];

  return createdAddress;
}

export const getProtocolFee = async () => {
  const exchange = new ethers.Contract(EXCHANGE, exchangeABI, provider);
  const fee = await exchange.protocolFee();

  return fee.toNumber() / 10 ** FEE_DECIMAL;
}

export const checkApproved = async (order) => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const exchange = new ethers.Contract(EXCHANGE, exchangeABI, provider);
  const fee = await exchange.protocolFee();

  const assetData = order.takeAsset.assetType.data;
  const erc20Address = dec(['address'], assetData)[0];
  const erc20Contract = new ethers.Contract(erc20Address, erc20ABI, provider);

  const allowance = await erc20Contract.allowance(address, order.erc20TransferProxy);

  const value = ethers.BigNumber.from(order.takeAsset.value);
  const feeAmount = value.mul(fee).div(ethers.BigNumber.from(10 ** FEE_DECIMAL));
  const approveAmount = value.add(feeAmount);

  return approveAmount.lte(allowance);
}

export const approveMax = async (order) => {
  const signer = provider.getSigner();

  const assetData = order.takeAsset.assetType.data;
  const erc20Address = dec(['address'], assetData)[0];
  const erc20Contract = new ethers.Contract(erc20Address, erc20ABI, provider);

  const tx = await erc20Contract.connect(signer).approve(order.erc20TransferProxy, ethers.constants.MaxUint256);

  const receipt = await tx.wait();
  const approvalEvent = receipt.events.find(x => x.event === 'Approval');

  return !isNull(approvalEvent);
}

export const matchOrders = async (order) => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const exchange = new ethers.Contract(EXCHANGE, exchangeABI, provider);
  const protocolFee = await exchange.protocolFee();

  const makeOrder = Order(
    order.maker,
    order.makeAsset,
    ZERO_ADDRESS,
    order.takeAsset,
    order.salt,
    order.start,
    order.end,
    order.dataType,
    order.data,
  );

  const takeOrder = Order(
    address,
    order.takeAsset,
    ZERO_ADDRESS,
    order.makeAsset,
    order.salt,
    order.start,
    order.end,
    "0xffffffff",
    "0x"
  );

  let value = 0;
  if (takeOrder.makeAsset.assetType.assetClass === ETH) {
    const eth = ethers.BigNumber.from(takeOrder.makeAsset.value);
    const feeAmount = eth.mul(protocolFee).div(ethers.BigNumber.from(10 ** FEE_DECIMAL));

    value = eth.add(feeAmount).toString();
  }

  const tx = await exchange.connect(signer).matchOrders(
    makeOrder,
    order.sign,
    takeOrder,
    '0x',
    {value: value}
  );

  const receipt = await tx.wait();
  const matchEvent = receipt.events.find(x => x.event === 'Match');

  return {
    executed: !isNull(matchEvent),
    tx: tx.hash,
    idorders: order.idorders,
    taker: address,
    takeAsset: order.takeAsset,
  };
}

export const parseErc20AssetData = (data) => {
  const decoded = dec(["address"], data);
  return decoded[0];
}

export const parseErc721AssetData = (data) => {
  const decoded = dec(["address", "uint256"], data);
  return [decoded[0], decoded[1]];
}

export const getTokenURI = async (contractAddress, tokenId) => {
  const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

  const tokenURI = await contract.tokenURI(tokenId);
  return tokenURI;
}

export const hasERC721Interface = async (contractAddress) => {
  const contract = new ethers.Contract(contractAddress, brandCollectionABI, provider);
  return await contract.supportsInterface('0x80ac58cd');
}

export const getCollectionInfo = async (contractAddress) => {
  const collection = {};

  const collectionContract = new ethers.Contract(contractAddress, brandCollectionABI, provider);

  collection.contract = contractAddress;
  collection.name = await collectionContract.name();
  collection.symbol = await collectionContract.symbol();

  return collection;
}

export const getOwnerOf = async (contractAddress, tokenId) => {
  const collectionContract = new ethers.Contract(contractAddress, brandCollectionABI, provider);
  const address = await collectionContract.ownerOf(tokenId);

  return address;
}

export const getTokenInfo = async (contractAddress, tokenId) => {
  const returnValues = {
    metadata: {},
    collection: {},
    owner: null,
  }

  let tokenURI = await getTokenURI(contractAddress, tokenId);
  if (tokenURI.match(new RegExp(TOKEN_BASE_URI, 'g')).length === 2) {
    tokenURI = tokenURI.replace(TOKEN_BASE_URI, '');
  }

  returnValues.metadata = await axios.get(tokenURI, {}).then(res => res.data);

  const collectionContract = new ethers.Contract(contractAddress, brandCollectionABI, provider);
  returnValues.collection.contract = contractAddress;
  returnValues.collection.name = await collectionContract.name();
  returnValues.collection.symbol = await collectionContract.symbol();

  return returnValues;
}

export const getOwnedTokensOfCollection = async (collectionAddress, owner) => {
  const contract = new ethers.Contract(collectionAddress.replace(/ /g, ''), brandCollectionABI, provider);
  const tokens = [];

  let balanceOf;
  try {
    balanceOf = await contract.balanceOf(owner);
  } catch (e) {
    console.error(`fail to get balance of ${owner} (collection: ${collectionAddress})`, e.message);
  }

  for (let i = 0; i < balanceOf; i++) {
    try {
      const tokenId = await contract.tokenOfOwnerByIndex(owner, i);
      tokens.push(tokenId.toNumber());
    } catch (e) {
      console.error(`fail to get owned token info (${owner}'s ${collectionAddress}:${i})`, e.message);
    }
  }


  return tokens;
}

export const getTokensOfCollection = async (collectionAddress) => {
  const contract = new ethers.Contract(collectionAddress.replace(/ /g, ''), brandCollectionABI, provider);

  const tokens = [];

  let i = 0;
  while (true) {
    try {
      const tokenId = await contract.tokenByIndex(i++);
      tokens.push(tokenId.toNumber());
    } catch (e) {
      break;
    }
  }

  return tokens;
}

export const getTotalSupplyOfCollection = async (collectionAddress) => {
  const contract = new ethers.Contract(collectionAddress.replace(/ /g, ''), brandCollectionABI, provider);

  const totalSupply = await contract.totalSupply();

  return totalSupply.toNumber();
}

export const parsePrice = (takeAsset) => {
  if (!takeAsset) {
    return {};
  }

  const data = takeAsset.assetType?.data;

  let price, unit;

  if (data === '0x' || data === enc('0x0000000000000000000000000000000000000000')) {
    price = ethers.utils.formatEther(takeAsset.value);
    unit = 'ETH';
  } else {
    const contract = parseErc20AssetData(data);
    price = ethers.utils.formatEther(takeAsset.value);
    unit = assetsByAddress[contract.toLowerCase()];
  }

  return {
    price: numeral(price).format('0[.][00000000]'),
    unit: unit
  }
}

export const getBalance = async (unit) => {
  const signer = provider.getSigner();

  if (unit === 'ETH') {
    const balance = await signer.getBalance();
    return ethers.utils.formatEther(balance).toString();
  } else {
    const address = signer.getAddress();
    const contractAddress = assets[unit];

    if (!contractAddress) {
      throw 'no registered asset: ' + unit;
    }

    const erc20 = new ethers.Contract(contractAddress, erc20ABI, provider);
    const balance = await erc20.balanceOf(address);
    return ethers.utils.formatUnits(balance, decimals[unit]);
  }
}
