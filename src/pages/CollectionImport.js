import PageWrapper from "../components/Layouts/PageWrapper";
import PageHeader from "../components/Layouts/PageHeader";
import SettingNavigation from "../components/Widgets/SettingNavigation";
import TextField from "../components/Widgets/TextField";
import useWalletRequired from "../hooks/useWalletRequired";
import {useDispatch} from "react-redux";
import {useCallback, useMemo, useState} from "react";
import GradientButton from "../components/Widgets/GradientButton";
import styled from "styled-components";
import {isAddress} from "web3-utils";
import {linkContract} from "../reducers/collection";
import {getCollectionInfo, hasERC721Interface} from "../utils/nft";
import {useAlert} from "react-alert";
import {useTranslation} from 'react-i18next';
import {checkValidAccessToken} from "../utils/user";
import {useHistory} from "react-router-dom";

const ImportButton = styled(GradientButton)`
  margin-top: 60px;
  margin-left: auto;
`;

const CollectionImport = ({}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  useWalletRequired(true);
  const {t} = useTranslation(['common', 'alert']);

  const [contractAddress, setContractAddress] = useState('');
  const disabled = useMemo(() => !isAddress(contractAddress), [contractAddress]);

  const handleChange = useCallback((e) => {
    setContractAddress(e.target.value.replace(/ /g, ''));
  }, []);

  const handleImport = useCallback(() => {
    checkValidAccessToken(history, dispatch, () => {
      hasERC721Interface(contractAddress).then((flag) => {
        if (!flag) {
          alert.error("This contract is not ERC721 standard.");
          return;
        }

        getCollectionInfo(contractAddress).then(async ({name}) => {
          const {payload, error} = await dispatch(linkContract({
            chainId: process.env.REACT_APP_CHAIN_ID,
            platform: process.env.REACT_APP_CHAIN_PLATFORM,
            contract: contractAddress,
            name: name
          }));

          if (error) {
            alert.error(t('COLLECTION_CANT_ADDED'));
            throw error;
          }

          if (payload.success) {
            alert.show(t('COLLECTION_ADDED'));
          } else if (payload.message === 'already existed') {
            alert.error(t('COLLECTION_ALREADY_ADDED'));
          }

          setContractAddress('');
        }).catch(e => {
          alert.error(e.message);
        })
      });
    });
  }, [contractAddress]);

  return (
    <PageWrapper hasTopNav leftMargin={'200px'}>
      <SettingNavigation/>
      <PageHeader title={"Import your NFTs"} color={"#AF86D9"}/>
      <div>
        <TextField label={"Contract Address"} placeholder={t('CONTRACT_ADDRESS_PLACEHOLDER')}
                   onChange={handleChange}/>
        <ImportButton disabled={disabled} onClick={handleImport}>Import</ImportButton>
      </div>
    </PageWrapper>
  )
};

export default CollectionImport;
