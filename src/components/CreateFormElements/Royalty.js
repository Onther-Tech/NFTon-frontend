import styled from "styled-components";
import FlexBox from "../FlexBox";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import {useTranslation} from "react-i18next";
import UnderlineInput from "./UnderlineInput";
import {useSelector} from "react-redux";
import {userState} from "../../reducers/user";
import {useEffect, useRef} from "react";

const TaxPercent = styled.div`
  position: absolute;
  width: 100%;
  max-width: 557px;
  text-align: right;
  padding-right: 12px;
  margin-top: 14px;
  pointer-events: none;
  color: #8E8E93;
  font-weight: 500;
  font-size: 16px;
`;

const WalletAddressButton = styled.div`
  width: 100%;
  max-width: 443px;
  padding: 10px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  background: #FAFAFA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 31px;
  margin-top: 12px;
  text-align: center;
  cursor: pointer;

  input {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    padding: 0;
    text-align: center;
    outline: none;
    border: none;
    color: #8E8E93;
    background-color: transparent;
    width: 100%;
    height: 100%;
  }
`;

const Royalty = ({ratioFieldName, toFieldName, onChange}) => {
  const {t} = useTranslation();
  const {address} = useSelector(userState);

  const addressRef = useRef(null);

  useEffect(() => {
    const value = addressRef.current?.value;

    if (!value || value === address) {
      onChange && onChange({target: {name: toFieldName, value: value}});
    }
  }, [address, onChange]);

  return (
    <Section num>
      <SectionTitle>{t('ROYALTIES') + ' *'}</SectionTitle>
      <FlexBox centerHorizontal>
        <UnderlineInput type="number" placeholder={t('ENTER_1_100')} name={ratioFieldName}
                        onChange={onChange}/>
        <TaxPercent>%</TaxPercent>
      </FlexBox>
      <FlexBox centerHorizontal>
        <WalletAddressButton>
          <input ref={addressRef} placeholder={t('WALLET_ADDRESS') + ' *'} name={toFieldName} defaultValue={address}
                 onChange={onChange}/>
        </WalletAddressButton>
      </FlexBox>
    </Section>
  )
};

export default Royalty;
