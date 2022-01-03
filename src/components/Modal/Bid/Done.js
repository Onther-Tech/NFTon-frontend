import styled from "styled-components";
import {ButtonList, Button} from "./ModalButton";
import {useHistory} from "react-router-dom";

const Done = ({content}) => {
    const history = useHistory();
    
    const DoneSubTitle = styled.h3`
        font-size: 22px;
        margin: 0;
    `;
    const DoneWrapper = styled.div`
        text-align: center;
        .done-image {
            width: 80px;
            margin: 60px 0 70px 0;
        }
    `;
    const linkTo = (link) => {
        history.push(link);
    }

    return (
        <>
            <DoneWrapper>
                <DoneSubTitle>{content.subTitle}</DoneSubTitle>
                <img className="done-image" src="/img/ic_modal_complete.gif" />
                <ButtonList>
                    {content.buttons.map((data, index) => (
                        <Button onClick={() =>linkTo(data.link)}>{data.title}</Button>
                    ))}
                </ButtonList>
            </DoneWrapper>
        </>
    );
}
export default Done;