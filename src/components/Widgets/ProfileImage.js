import styled from "styled-components";
import {useMemo} from "react";

const Picture = styled.picture`
  > * {
    width: 100%;
    height: 100%;
    background-color: #E5E5EA;
    border-radius: 50%;
  }
`;

const ProfileImage = ({src, ...p}) => {
  const imageUrl = useMemo(() => {
    if(!src) {
      return '/img/ic_profile_big.svg';
    }

    return src += '?t=' + Date.now()
  }, [src]);

  return (
    <Picture {...p}>
      <source src={imageUrl} />
      <img src={imageUrl}/>
    </Picture>
  )
};

export default ProfileImage;
