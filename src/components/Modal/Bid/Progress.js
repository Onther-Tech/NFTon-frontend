import styled, {keyframes} from "styled-components";
import {Button, ButtonList} from "./ModalButton";
import Spin from "../../keyframes/Spin";

const ProgressList = styled.div`

`;

const ProgressHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0;

  img.spin {
    animation: ${Spin} 1s linear infinite;
  }
`;
const ProgressHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const ProgressHeaderTitle = styled.h3`
  height: 28px;
  margin: 0;
`;

const Progress = ({content, onConfirm, onClose}) => {

  return (
    <>
      <ProgressList>
        <ProgressHeaderWrapper>
          <ProgressHeader>
            <ProgressHeaderTitle>Approve</ProgressHeaderTitle>
            <span>This transaction is conducted only once per collection</span>
          </ProgressHeader>
          {
            content.approved ? (
              <img src="/img/ic_modal_complete.gif"/>
            ) : (
              <img className="spin" src="/img/ic_spinner.svg"/>
            )
          }
        </ProgressHeaderWrapper>
        {
          content.isCheckout ? (
            <ProgressHeaderWrapper>
              <ProgressHeader>
                <ProgressHeaderTitle>Purchase</ProgressHeaderTitle>
                <span>Send transaction to purchase asset</span>
              </ProgressHeader>
              {
                content.approved && (
                  content.signed ? (
                    <img src="/img/ic_modal_complete.gif"/>
                  ) : (
                    <img className="spin" src="/img/ic_modal_loading.gif"/>
                  )
                )
              }
            </ProgressHeaderWrapper>
          ) : (
            <ProgressHeaderWrapper>
              <ProgressHeader>
                <ProgressHeaderTitle>Sign the message</ProgressHeaderTitle>
                <span>Sign the message for the placing the bid</span>
              </ProgressHeader>
              {
                content.approved && (
                  content.signed ? (
                    <img src="/img/ic_modal_complete.gif"/>
                  ) : (
                    <img className="spin" src="/img/ic_spinner.svg"/>
                  )
                )
              }
            </ProgressHeaderWrapper>
          )
        }
      </ProgressList>
      <ButtonList>
        <Button onClick={onClose} >Cancel</Button>
      </ButtonList>
    </>
  );
}
export default Progress;
