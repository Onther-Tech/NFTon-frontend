const ethUtil = require('ethereumjs-util');
const web3 = require('web3')

function id(str) {
  return `0x${ethUtil.keccak256(Buffer.from(str)).toString("hex").substring(0, 8)}`;
}

function enc(token, tokenId) {
  const eth = new web3().eth;

  if (!!tokenId || tokenId === 0) {
    return eth.abi.encodeParameters(["address", "uint256"], [token, tokenId]);
  } else {
    return eth.abi.encodeParameter("address", token);
  }
}

function dec(types, data) {
  const eth = new web3().eth;

  return eth.abi.decodeParameters(types, data);
}

const ETH = id("ETH");
const ERC20 = id("ERC20");
const ERC721 = id("ERC721");
const ERC721_LAZY = id("ERC721_LAZY");
const ERC1155 = id("ERC1155");
const ERC1155_LAZY = id("ERC1155_LAZY");
const COLLECTION = id("COLLECTION");
const CRYPTO_PUNK = id("CRYPTO_PUNK");
const ORDER_DATA_V1 = id("V1");
const ORDER_DATA_V2 = id("V2");
const TO_MAKER = id("TO_MAKER");
const TO_TAKER = id("TO_TAKER");
const PROTOCOL = id("PROTOCOL");
const ROYALTY = id("ROYALTY");
const ORIGIN = id("ORIGIN");
const PAYOUT = id("PAYOUT");

module.exports = { id, dec, ETH, ERC20, ERC721, ERC721_LAZY, ERC1155, ERC1155_LAZY, ORDER_DATA_V1, ORDER_DATA_V2, TO_MAKER, TO_TAKER, PROTOCOL, ROYALTY, ORIGIN, PAYOUT, CRYPTO_PUNK, COLLECTION, enc }
