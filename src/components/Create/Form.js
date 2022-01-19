import styled from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import GradientButton from "../Widgets/GradientButton";
import Switch from "../Widgets/Switch";
import FlexBox from "../FlexBox";
import CollectionDropdown from "../Widgets/CollectionDropdown";
import PriceInput from "./PriceInput";
import {SIZE_BIG} from "../../constants/dropdown";
import TextField from "../Widgets/TextField";
import TextFieldLabel from "../Widgets/TextFieldLabel";
import FeeInfo from "../Widgets/FeeInfo";
import {useDispatch, useSelector} from "react-redux";
import produce from "immer";
import MarketTypeButton from "./MarketTypeButton";
import {approveTransferProxy, makeOrder, mint} from "../../utils/nft";
import {mintActions, mints, mintState} from "../../reducers/mint";
import {useHistory} from "react-router-dom";
import {registerOrder} from "../../reducers/order";
import {ORDER_FIXED_PRICE, ORDER_TYPE_CHECKOUT} from "../../constants/sale";
import {commonCollection, TOKEN_BASE_URI} from "../../constants/contract";
import {collectionState, fetchMyCollections} from "../../reducers/collection";
import {userState} from "../../reducers/user";
import {useAlert} from "react-alert";
import {useTranslation} from 'react-i18next';
import ContentPreview from "../Widgets/ContentPreview";
import {checkValidAccessToken} from "../../utils/user";

const Wrapper = styled.div`
  width: 752px;
  margin: 0 auto;
  padding-bottom: 80px;
`;

const Section = styled.section`
  &:not(:first-child) {
    padding-top: 30px;
  }

  input {
    &:not(:nth-of-type(1)) {
      margin-left: 24px;
    }
  }
`;

const SectionTitle = styled.div`
  display: flex;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: #000000;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const UploadSection = styled(Section)`
  display: flex;
  gap: 28px;
`;

const DragFileArea = styled.div`
  width: 461px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  > div {
    line-height: 38px;

    &:nth-child(1) {
      font-size: 24px;
      font-weight: 700;
      color: #000000;
    }

    &:nth-child(2) {
      font-size: 18px;
      color: #6D84FF;
    }
  }
  
  .preview {
    * {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  > input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadDescription = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    color: #000000;
    margin-bottom: 86px;
    white-space: nowrap;
  }

  .attributes {
    font-size: 12px;
    line-height: 28px;
    color: #000000;

    &:not(:last-child) {
      margin-bottom: 14px;
    }

    .type {
      font-weight: 700;
    }
  }
`;

const PutMarketSection = styled(Section)`
  padding-top: 47px;
  padding-bottom: 30px;
`;

const PriceSection = styled(Section)`
  padding-bottom: 20px;
  position: relative;
`;

const MultipleInputWrapper = styled(FlexBox)`
  gap: 24px;
  margin-bottom: 10px;

  > * {
    flex: 1;
  }
`;

const LevelValues = styled.div`
  display: flex;

  > .of {
    width: 50px;
    height: 50px;
    background-color: #C4C4C4;
    font-size: 14px;
    color: #FAFAFA;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > :not(.of) {
    flex: 1;
  }

  div {
    &:first-child > input {
      border-radius: 5px 0 0 5px;
    }

    &:last-child > input {
      border-radius: 0 5px 5px 0;
    }
  }
`;


const CreateButton = styled(GradientButton)`
  margin-top: 60px;
  margin-left: auto;
`

const Fee = styled.div`

`;

const UnderlineInput = styled(TextField)`
  width: 100%;
  max-width: 557px;
  margin-top: 14px;

  input {
    &:not(:focus) {
      border: 1px solid transparent;
      border-bottom-color: #929292;
      border-radius: 0;
    }
  }

  &:focus {
    border-radius: 5px;
  }
`;

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

const AddFormButton = styled.div`
  width: 100%;
  border: 1px solid #C7C7CC;
  border-radius: 5px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8E8E93;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;

  img {
    margin-right: 8px;
  }

  &:hover {
    border-color: #6D84FF;
    background: #FAFAFA;
    color: #6D84FF;

    img {
      filter: invert(55%) sepia(87%) saturate(2824%) hue-rotate(209deg) brightness(99%) contrast(105%);
    }
  }
`;

const StyledFeeInfo = styled(FeeInfo)`
  position: initial;
  margin-top: 16px;
`;

const BASE_SPEC_ENTITY = {
  key: undefined,
  value: undefined
};

const BASE_LEVEL_ENTITY = {
  name: undefined,
  level: undefined,
  max: undefined
};

const CHAIN_PLATFORM = process.env.REACT_APP_CHAIN_PLATFORM;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const ACCEPT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/web'
];
const ACCEPT_MAX_SIZE_MB = 40;

const Form = ({bundle}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const {t} = useTranslation(['common', 'alert']);

  const {address} = useSelector(userState);
  const {loading} = useSelector(mintState);
  const {collections} = useSelector(collectionState);

  const [isPutOnMarket, setPutOnMarket] = useState(true);
  const [marketType, setMarketType] = useState(ORDER_FIXED_PRICE);
  const [isUnlockContent, setUnlockContent] = useState(false);

  const [collectionsForDropdown, setCollectionsForDropdown] = useState([]);

  const [params, setParams] = useState({
    chainId: CHAIN_ID,
    platform: CHAIN_PLATFORM,
  });

  const [preview, setPreview] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [specs, setSpecs] = useState([BASE_SPEC_ENTITY]);
  const [levels, setLevels] = useState([BASE_LEVEL_ENTITY]);

  const disableCreate = useMemo(() => {
    if (isPutOnMarket) {
      if (!params.price || !params.royalty_ratio || !params.royalty_to) {
        return true;
      }
    }

    if (!params.chainId || !params.platform) {
      return true;
    }

    if (!params.name || !params.attachment || !params.description || !params.collection) {
      return true;
    }
  }, [params, isPutOnMarket]);

  const handleAddSpec = useCallback(() => {
    setSpecs(specs => [...specs, BASE_SPEC_ENTITY]);
  }, []);

  const handleAddLevel = useCallback(() => {
    setLevels(levels => [...levels, BASE_LEVEL_ENTITY]);
  }, []);

  const handleChangeFile = useCallback((e) => {
    const file = e.target.files[0];

    if (!file) {
      setParams(params => ({...params, attachment: null}));
      return;
    }

    if (!ACCEPT_TYPES.includes(file.type)) {
      alert.error(t('NOT_ALLOWED_FILE_TYPE'));
      return;
    }

    if (file.size / 1024 / 1024 > ACCEPT_MAX_SIZE_MB) {
      alert.error(t('NOT_ALLOWED_FILE_SIZE_40MB'));
      return;
    }

    setParams(params => ({...params, attachment: file}));

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
        setPreviewType(file.type);
      };
    }
  }, []);

  useEffect(() => {
    if (address) {
      dispatch(fetchMyCollections({address}));
    }

    // set default royalty receiver address
    setParams(produce(d => {
      if (!d.royalty_to) {
        d.royalty_to = address;
      }
    }));
  }, [address]);

  // 컬렉션 목록 가공
  useEffect(() => {
    setCollectionsForDropdown([
      {
        label: commonCollection.name,
        value: JSON.stringify(commonCollection)
      },
      ...collections.map(x => ({
        label: x.name,
        image: x.symbol_link,
        value: JSON.stringify({
          name: x.name,
          symbol: x.symbol.toUpperCase(),
          contract: x.contract,
          categoryIdcategories: x.categoryIdcategories
        })
      }))
    ]);
  }, [collections]);

  // specs, levels 를 attributes 로 변환
  useEffect(() => {
    const attributes = [];

    for (let spec of specs) {
      if (!spec.key || typeof spec.value === "undefined") {
        continue;
      }

      attributes.push({
        trait_type: spec.key,
        value: spec.value.toString()
      });
    }

    if (levels.length > 0 && !!levels[0].name) {
      for (let level of levels) {
        if (!level.name || Number.isNaN(level.level) || Number.isNaN(level.max)) {
          continue;
        }

        attributes.push({
          trait_type: level.name,
          value: Number(level.level),
          max_value: Number(level.max)
        });
      }
    }

    setParams(params => ({...params, attributes: JSON.stringify(attributes)}));
  }, [specs, levels]);

  const handleChange = useCallback((e) => {
    const key = e.target.name;
    const value = e.target.value;

    setParams(params => ({...params, [key]: value}));
  }, []);

  const handleChangeUnit = useCallback((value) => {
    setParams(params => ({...params, unit: value}));
  }, []);

  const handleChangeCollection = useCallback((value) => {
    setParams(params => ({...params, collection: value}));
  }, [handleChange]);

  const handleChangeSpec = useCallback((i, k, v) => {
    setSpecs(produce(d => {
      d[i][k] = v;
    }));
  }, []);

  const handleChangeLevel = useCallback((i, k, v) => {
    setLevels(produce(d => {
      d[i][k] = v;
    }));
  }, []);

  const handleCreate = useCallback(() => {
    checkValidAccessToken(history, dispatch, () => {
      if (!params.name) {
        return alert.error(t('ENTER_NAME'));
      }
      if (params.name < 4) {
        return alert.error(t('ENTER_NAME_MORE_4'));
      }
      if (!params.description) {
        return alert.error(t('ENTER_DESCRIPTION'));
      }
      if (!params.collection) {
        return alert.error(t('SELECT_COLLECTION'));
      }

      if (isPutOnMarket && marketType === ORDER_FIXED_PRICE) {
        if (marketType === ORDER_FIXED_PRICE) {
          if (!params.price) {
            return alert.error(t('PRICE_NEEDED'));
          }
        }

        if(params.royalty_ratio) {
          if(!params.royalty_to) {
            return alert.error(t('ROYALTY_NO_RECEIVER'));
          }
          if (params.royalty_ratio < 0 || params.royalty_ratio > 100) {
            return alert.error(t('ROYALTIY_VALUE_NOT_RIGHT'));
          }
        }
      }

      const loadingAlert = alert.show({
        title: "Please wait a bit...",
        loading: true,
        disableBackdropClick: true
      });

      dispatch(mintActions.setLoading(true));
      dispatch(mints(params)).then(async ({payload, error}) => {
        if (error) {
          throw error;
        } else if (!payload.success) {
          throw new Error(payload.message);
        }

        const mintData = payload.data;

        if (!mintData.asset_uri) {
          return;
        }

        const collection = mintData.collection;
        const cid = mintData.asset_uri.replace(TOKEN_BASE_URI, '');
        const {tokenId} = await mint(mintData.collection.contract, cid);

        const metadata = mintData.asset_data;
        let order;

        if (isPutOnMarket) {
          await approveTransferProxy(collection.contract);

          if (marketType === ORDER_FIXED_PRICE) {
            const jsonBody = await makeOrder(collection, tokenId, metadata, marketType, params.price, params.unit, params.royalty_ratio, params.royalty_to);
            const {payload, error} = await dispatch(registerOrder(jsonBody));

            if (error) {
              throw error;
            } else if (!payload.success) {
              return;
            } else if (Array.isArray(payload.data)) {
              order = payload.data[0];
            }
          }
        }

        dispatch(mintActions.setLoading(false));

        history.replace("/created", {
          metadata: metadata,
          order: order,
          collection: collection,
          tokenId: tokenId
        });
      }).catch(e => {
        alert.error(e.message);
        dispatch(mintActions.setLoading(false));
      }).finally(() => {
        loadingAlert.close();
      });
    });

  }, [alert, params, isPutOnMarket, marketType]);

  return (
    <Wrapper>
      <UploadSection>
        <DragFileArea>
          <div>Drag or drop file</div>
          <div>or browse</div>
          {
            preview && (
              <div className={"preview"}>
                <ContentPreview type={previewType} src={preview} />
              </div>
            )
          }
          <input type="file" accept={ACCEPT_TYPES.join(',')}
                 onChange={handleChangeFile}/>
        </DragFileArea>
        <UploadDescription>
          <div className="title">Image, Video, Audio or 3D Model *</div>
          <div className="attributes">
            <div className="type">File type</div>
            <div className="value">JPG, PNG, GIF, SVG, MP4, WEBM</div>
          </div>
          <div className="attributes">
            <div className="type">Max Size</div>
            <div className="value">{ACCEPT_MAX_SIZE_MB}MB</div>
          </div>
        </UploadDescription>
      </UploadSection>
      <PutMarketSection>
        <SectionTitle>
          Put on marketplace
          <Switch checked={isPutOnMarket} onChange={setPutOnMarket}/>
        </SectionTitle>
        {
          isPutOnMarket && (
            <FlexBox centerHorizontal>
              <MarketTypeButton type={ORDER_FIXED_PRICE} current={marketType}
                                onClick={() => setMarketType(ORDER_FIXED_PRICE)}/>
              {/*
              {
                !bundle && (
                  <MarketTypeButton type={ORDER_TIMED_AUCTION} current={marketType}
                                    onClick={() => setMarketType(ORDER_TIMED_AUCTION)}/>
                )
              }
              <MarketTypeButton type={ORDER_OPEN_BID} current={marketType}
                                onClick={() => setMarketType(ORDER_OPEN_BID)}/>
              */}
            </FlexBox>
          )
        }
      </PutMarketSection>
      {
        bundle && (
          <PriceSection>
            <SectionTitle>{t('COUNT_BUNDLE')}</SectionTitle>
            <FlexBox centerHorizontal>
              <UnderlineInput type="number" placeholder="숫자를 입력해 주세요"/>
            </FlexBox>
          </PriceSection>
        )
      }
      {
        (isPutOnMarket && marketType === ORDER_FIXED_PRICE) && (
          <PriceSection>
            <SectionTitle>{t('PRICE') + ' *'}</SectionTitle>
            <FlexBox centerHorizontal>
              <PriceInput priceName={"price"} onChangePrice={handleChange} onChangeUnit={handleChangeUnit}/>
            </FlexBox>
            <FlexBox centerHorizontal>
              <StyledFeeInfo fee={2.5}/>
            </FlexBox>
          </PriceSection>
        )
      }
      {
        isPutOnMarket && (
          <PriceSection>
            <SectionTitle>{t('ROYALTIES') + ' *'}</SectionTitle>
            <FlexBox centerHorizontal>
              <UnderlineInput type="number" placeholder={t('ENTER_1_100')} name="royalty_ratio"
                              onChange={handleChange}/>
              <TaxPercent>%</TaxPercent>
            </FlexBox>
            <FlexBox centerHorizontal>
              <WalletAddressButton>
                <input placeholder={t('WALLET_ADDRESS') + ' *'} name="royalty_to" defaultValue={address}
                       onChange={handleChange}/>
              </WalletAddressButton>
            </FlexBox>
          </PriceSection>
        )
      }
      <Section>
        <TextField label={t('NAME') + ' *'} name="name" onChange={handleChange}/>
      </Section>
      <Section>
        <TextField label={t('DESCRIPTION') + ' *'} name="description" onChange={handleChange}/>
      </Section>
      <Section>
        <TextField label={t('EXTERNAL_LINK')} type={"url"} name="external_link" onChange={handleChange}/>
      </Section>
      <Section>
        <SectionTitle>{t('COLLECTION') + ' *'}</SectionTitle>
        <CollectionDropdown
          size={SIZE_BIG}
          items={collectionsForDropdown}
          defaultLabel={"Select collection"}
          value={params.collection}
          onChange={handleChangeCollection}
        />
      </Section>
      <Section>
        <TextFieldLabel>{t('PROPERTY')}</TextFieldLabel>
        {
          specs.map((x, i) => (
            <MultipleInputWrapper key={i}>
              <TextField placeholder={"e.g. Size"}
                         onChange={(e) => handleChangeSpec(i, 'key', e.target.value)}/>
              <TextField placeholder={"e.g. M"}
                         onChange={(e) => handleChangeSpec(i, 'value', e.target.value)}/>
            </MultipleInputWrapper>
          ))
        }
        <AddFormButton onClick={handleAddSpec}><img src={"/img/ic_create_add_form.svg"}/>{t('ADD_PROPERTY')}
        </AddFormButton>
      </Section>
      <Section>
        <TextFieldLabel>{t('LEVEL')}</TextFieldLabel>
        <MultipleInputWrapper>
          <div>Name</div>
          <div>Value</div>
        </MultipleInputWrapper>
        {
          levels.map((x, i) => (
            <MultipleInputWrapper key={i}>
              <TextField placeholder={t('SPEED')}
                         onChange={(e) => handleChangeLevel(i, 'name', e.target.value)}/>
              <LevelValues>
                <TextField placeholder={"3"}
                           type={"number"}
                           onChange={(e) => handleChangeLevel(i, 'level', e.target.value)}/>
                <div className="of">of</div>
                <TextField placeholder={"5"}
                           type={"number"}
                           onChange={(e) => handleChangeLevel(i, 'max', e.target.value)}/>
              </LevelValues>
            </MultipleInputWrapper>
          ))
        }
        <AddFormButton onClick={handleAddLevel}><img src={"/img/ic_create_add_form.svg"}/>{t('ADD_LEVEL')}
        </AddFormButton>
      </Section>
      <Section>
        {/*
        <SectionTitle>
          {t('UNLOCK_CONTENT_AFTER_BUY')}
          <Switch checked={isUnlockContent} onChange={setUnlockContent}/>
        </SectionTitle>
        */}
        {
          isUnlockContent && (
            <TextField
              multiLine
              placeholder={t('UNLOCK_CONTENT_AFTER_BUY_DESCRIPTION')}
            />
          )
        }
      </Section>
      <CreateButton disabled={disableCreate || loading} onClick={handleCreate}>Create</CreateButton>
    </Wrapper>
  )
};

export default Form;
