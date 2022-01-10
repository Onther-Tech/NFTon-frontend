import {useMemo} from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  > * {
    width: 100%;
    height: 100%;
  }
`;

const ContentPreview = ({type, src, controls}) => {
  const fileType = useMemo(() => {
    const mimePrefix = typeof type === 'string' && type.split('/')[0];

    switch (mimePrefix) {
      case 'image':
      case 'video':
      case 'audio':
        return mimePrefix;
      default:
        return 'image';
    }
  }, [type]);

  return (
    <Wrapper>
      {
        fileType === 'image' && (
          <img src={src} onError={(e) => e.target.src = '/img/ic_card_nopicture.svg'}/>
        )
      }
      {
        fileType === 'audio' && (
          <audio src={src}/>
        )
      }
      {
        fileType === 'video' && (
          <video src={src} autoPlay muted controls={controls} controlsList="nodownload"/>
        )
      }
    </Wrapper>
  );
};

export default ContentPreview;
