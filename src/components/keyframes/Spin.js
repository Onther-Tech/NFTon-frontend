import {keyframes} from "styled-components";

const Spin = keyframes`
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export default Spin;
