import styled from "styled-components";
import TextField from "../Widgets/TextField";

const Wrapper = styled.div`
  margin-bottom: -1px;
  position: relative;

  &::before {
    content: ' ';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 14px;
    top: calc(50% - 10px);
    background-image: url('${p => p.icon}');
    background-size: contain;
    z-index: 1;
  }

  input {
    padding-left: 46px;
  }
`;

const SocialLink = ({icon, name, defaultValue, onChange, ...p}) => {
  return (
    <Wrapper icon={icon} {...p}>
      <TextField type={"url"} name={name} defaultValue={defaultValue} onChange={onChange}/>
    </Wrapper>
  )
}

export default SocialLink;
