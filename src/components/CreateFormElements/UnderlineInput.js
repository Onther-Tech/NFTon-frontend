import styled from "styled-components";
import TextField from "../Widgets/TextField";

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

export default UnderlineInput;
