import styled from "styled-components";
import GradientButton from "../../Widgets/GradientButton";

const ButtonList = styled.div`
    margin-top: 60px;
`;
const Button = styled(GradientButton)`
    margin-top: 15px;
    margin-left: auto;
    margin-right: auto;
    width: 300px;

    &.disabled {
        background: #AEAEB2;
    }
`;


export { ButtonList, Button };
