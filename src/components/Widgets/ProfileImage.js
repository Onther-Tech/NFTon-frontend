import styled from "styled-components";

const Picture = styled.picture`
  > * {
    width: 100%;
    height: 100%;
    background-color: #E5E5EA;
    border-radius: 50%;
  }
`;

const ProfileImage = ({src, ...p}) => {
  return (
    <Picture {...p}>
      <source src={src} />
      <img src={'/img/ic_profile_big.svg'}/>
    </Picture>
  )
};

export default ProfileImage;
