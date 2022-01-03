import styled, {css} from "styled-components";
import {Fragment} from "react";
import TextFieldLabel from "./TextFieldLabel";
import {dismissEvent} from "../../utils";

const Wrapper = styled.div`
  position: relative;
`;

const inputStyle = css`
  width: 100%;
  font-size: 14px;
  line-height: 24px;
  border: 1px solid #C7C7CC;
  border-radius: 5px;
  padding: 12px 20px;
  outline: none;
  background-color: transparent;

  &:focus {
    border: 1px solid #CED6FF;
    background-color: #FAFAFA;
  }

  &::placeholder {
    color: #C4C4C4;
  }
`;

const Input = styled.input`
  ${inputStyle};
  ${p => p.disabled && `
    color: #AEAEB2;
  `};
`;

const TextArea = styled.textarea`
  ${inputStyle};
  resize: vertical;
  ${p => p.disabled && `
    color: #AEAEB2;
  `};
  
  &::placeholder {
    color: #8E8E93;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  bottom: 13px;
  right: 12px;
  object-fit: contain;
;
`;

const TextField = ({label, multiLine, valid, error, disabled, className, tooltip,...p}) => {
  return (
    <Wrapper className={className}>
      {
        label && (
          <TextFieldLabel tooltip={tooltip}>
            {label}
          </TextFieldLabel>
        )
      }
      {
        multiLine ? (
          <TextArea disabled={disabled} {...p}/>
        ) : (
          <Input disabled={disabled} onWheel={dismissEvent} {...p} />
        )
      }
      {
        valid && (
          <Icon src={"/img/ic_textfield_valid.svg"} />
        )
      }
      {
        error && (
          <Icon src={"/img/ic_textfield_error.svg"} />
        )
      }
      {
        disabled && (
          <Icon src={"/img/ic_textfield_disabled.svg"} />
        )
      }
    </Wrapper>
  );
};

export default TextField;
