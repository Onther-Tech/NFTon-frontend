import styled from "styled-components";
import {Link, useLocation} from "react-router-dom";
import {useMemo} from "react";
import GradientTop from "./GradientTop";
import {breakLine} from "../../utils";
import qs from "query-string";

const Wrapper = styled.div`
  width: 100%;
`;

const Tab = styled.div`
  width: 100%;
  padding: 24px 0;
  margin-bottom: -10px;
  text-align: center;

  > * {
    display: inline-block;
    margin-right: 29px;
    margin-bottom: 10px;
  }
`;

const TabItem = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  border-radius: 40px;
  padding: 10px 30px;
  color: #929292;
  background-color: rgba(249, 249, 249, 0.6);
  user-select: none;

  ${p => p.selected && `
    color: #151515;
    background-color: #ffffff;
  `};
`;

const TabTitle = styled.div`
  padding-top: 36px;
  padding-bottom: 54px;
  text-align: center;

  .title {
    font-size: 64px;
    line-height: 74px;
    font-weight: 700;
    color: #151515;
    margin-bottom: 10px;
  }

  .description {
    font-size: 18px;
    line-height: 28px;
    color: #535353;
  }
`;

const Content = styled(TabTitle)`
  padding-top: 80px;
  padding-bottom: 60px;

  ${p => p.left && `
    text-align: left;
  `};
`;

const PageHeader = ({tabItems, color, title, description, activeKey}) => {
  const {pathname, search} = useLocation();

  const currentTabItem = useMemo(() => {
    return Array.isArray(tabItems) && tabItems.find(x => {
      if (activeKey) {
        const currentSearch = qs.parse(search);
        const targetSearch = qs.parse(x.search);

        return currentSearch[activeKey] === targetSearch[activeKey];
      }
    }) || {};
  }, [tabItems, search, activeKey]);

  const {titleText, descriptionText} = useMemo(() => {
    if (title) {
      return {
        titleText: title,
        descriptionText: description || ''
      };
    }

    return {
      titleText: currentTabItem?.label,
      descriptionText: currentTabItem?.description
    }
  }, [title, description, currentTabItem]);

  return (
    <Wrapper>
      <GradientTop color={color}/>
      {
        tabItems && (
          <Tab>
            {
              tabItems.map((x, i) => (
                <Link key={i} to={{pathname, search: x.search}}>
                  <TabItem selected={currentTabItem[activeKey] === x[activeKey]}>{x.label}</TabItem>
                </Link>
              ))
            }
          </Tab>
        )
      }
      {
        tabItems ? (
          <TabTitle>
            <div className="title">{breakLine(titleText)}</div>
            <div className="description">{descriptionText}</div>
          </TabTitle>
        ) : (
          <Content left={!descriptionText}>
            <div className="title">{breakLine(titleText)}</div>
            <div className="description">{descriptionText}</div>
          </Content>
        )
      }
    </Wrapper>
  )
};

export default PageHeader;
