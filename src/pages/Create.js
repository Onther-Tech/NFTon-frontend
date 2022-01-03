import PageWrapper from "../components/Layouts/PageWrapper";
import {useMemo} from "react";
import PageHeader from "../components/Layouts/PageHeader";
import ChooseType, {CREATE_TYPE_BUNDLE, CREATE_TYPE_SINGLE} from "../components/Create/ChooseType";
import Form from "../components/Create/Form";
import {useRouteMatch} from "react-router-dom";
import useWallet from "../hooks/useWallet";
import { useTranslation } from 'react-i18next';

const Create = () => {
  const {params} = useRouteMatch();

  const { t }  = useTranslation(['common']);

  const createType = useMemo(() => params?.createType, [params]);

  const titleText = useMemo(() => {
    switch (createType) {
      case CREATE_TYPE_SINGLE:
        return t('SINGLE_NFT');
      // case CREATE_TYPE_BUNDLE:
      //   return t('BUNDLE_NFT');
      default:
        return t('CREATE_NFT');
    }
  }, [createType]);

  useWallet(true);

  return (
    <PageWrapper hasTopNav>
      <PageHeader color={"#009B76"} title={titleText} description={!createType ? "Create NFT" : ""}/>
      {
        !createType ? (
          <ChooseType/>
        ) : (
          <Form bundle={false && createType === CREATE_TYPE_BUNDLE}/>
        )
      }
    </PageWrapper>
  )
};

export default Create;
