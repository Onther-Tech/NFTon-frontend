import CollectionForm from "../components/Profile/CollectionForm";
import {useLocation} from "react-router-dom";

const CollectionModify = ({}) => {
  const {state} = useLocation();

  return (
    <CollectionForm collection={state?.collection}/>
  )
};

export default CollectionModify;
