import styled from "styled-components";
import FeeInfo from "../Widgets/FeeInfo";
import FlexBox from "../FlexBox";
import PriceInput from "../Widgets/PriceInput";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import {useTranslation} from "react-i18next";

const StyledFeeInfo = styled(FeeInfo)`
  position: initial;
  margin-top: 16px;
`;

const Price = ({priceFieldName, onChange, onChangeUnit}) => {
  const {t} = useTranslation();

  return (
    <Section num>
      <SectionTitle>{t('PRICE') + ' *'}</SectionTitle>
      <FlexBox centerHorizontal>
        <PriceInput priceName={priceFieldName} onChangePrice={onChange} onChangeUnit={onChangeUnit}/>
      </FlexBox>
      <FlexBox centerHorizontal>
        <StyledFeeInfo fee={2.5}/>
      </FlexBox>
    </Section>
  )
};

export default Price;
