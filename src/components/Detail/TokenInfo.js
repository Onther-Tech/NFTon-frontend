import styled from "styled-components";
import {useMemo} from "react";

const Wrapper = styled.div`
  padding: 15px 20px;
`;

const Row = styled.div`
  display: flex;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  label {
    width: 120px;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 21px;
    color: #535353;
    white-space: nowrap;
  }

  span {
    flex: 1;
    font-size: 14px;
    line-height: 21px;
    color: #535353;
    text-align: right;

    a {
      color: #6D84FF;
    }
  }
`;

const TokenInfo = ({contractAddress, tokenId, tokenStandard, blockchain}) => {
  const scanLink = useMemo(() => {
    let link = 'https://'

    if(blockchain === 'ethereum') {
      if(process.env.REACT_APP_CHAIN_ID == 4) {
        link += 'rinkeby.';
      }

      link += 'etherscan.io/address/' + contractAddress
    }

    return link;
  }, [contractAddress]);

  const platform = useMemo(() => {
    if(typeof blockchain === 'string') {
      return blockchain.substr(0, 1).toUpperCase() + blockchain.substr(1);
    } else {
      return 'Unknown';
    }
  }, [blockchain]);

  return (
    <Wrapper>
      <Row>
        <label>Contract Address</label>
        <span><a target="_blank" href={scanLink}>{contractAddress}</a></span>
      </Row>
      <Row>
        <label>Token ID</label>
        <span>#{tokenId}</span>
      </Row>
      <Row>
        <label>Token Standard</label>
        <span>{tokenStandard}</span>
      </Row>
      <Row>
        <label>Blockchain</label>
        <span>{platform}</span>
      </Row>
    </Wrapper>
  )
};

export default TokenInfo;
