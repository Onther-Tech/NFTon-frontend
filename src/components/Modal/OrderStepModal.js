import styled from "styled-components";
import BidOrCheckout from "./Bid/BidOrCheckout";
import Progress from "./Bid/Progress";
import Done from "./Bid/Done";
import {useEffect, useRef} from "react";


const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  overflow: auto;
  outline: 0;
`

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
`

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #FAFAFA;
  border-radius: 10px;
  width: 558px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 35px 40px;

  .title {
    font-size: 64px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 80px;
  }
`

const ModalHead = styled.div`
  display: flex;
  user-select: none;

  h1 {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ModalCloseButton = styled.div`
  width: 24px;
  height: 24px;
  background-image: url('/img/ic_modal_close.svg');
  cursor: pointer;
`;

const OrderStepModal = ({title, type, content, visible, onClose, onConfirm}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // document.body.style.cssText = `overflow: hidden; top: -${window.scrollY}px`;
      return () => {
        const scrollY = document.body.style.top;
        // document.body.style.cssText = `position: ""; top: "";`
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [visible]);

  return (
    <ModalWrapper tabIndex="-1" visible={visible}>
      <ModalOverlay visible={visible} />
      <ModalInner tabIndex="0" className="modal-inner" ref={wrapperRef}>
        <ModalHead>
          <h1 className="title">{title}</h1>
          <ModalCloseButton onClick={onClose}/>
        </ModalHead>
        {type === "bid" && <BidOrCheckout content={content} onClose={onClose} onConfirm={onConfirm}/>}
        {type === "checkout" && <BidOrCheckout checkout content={content} onClose={onClose} onConfirm={onConfirm}/>}
        {type === "progress" && <Progress content={content} onClose={onClose} onConfirm={onConfirm}/>}
        {type === "done" && <Done content={content}/>}
      </ModalInner>
    </ModalWrapper>
  )
}
export default OrderStepModal;
