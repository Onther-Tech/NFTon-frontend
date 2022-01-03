import styled from "styled-components";
import Round8Dropdown from "../Widgets/Round8Dropdown";
import {activityEventTypes} from "../../constants/dropdown";
import {useCallback, useMemo, useState} from "react";
import SelectedFilter from "../SelectedFilter";
import produce from "immer";
import StatTable from "../Stats/StatTable";
import {activityList} from "../../dummy/stats";

const Wrapper = styled.div`

`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const SelectedFilterWrapper = styled.div`
  margin-left: 20px;
`;

const Activity = () => {
  const [selected, setSelected] = useState([]);

  const selectableList = useMemo(() => {
    return activityEventTypes.filter(x => !selected.includes(x));
  }, [selected]);

  const handleChangeEventType = useCallback((value, i) => {
    setSelected(produce(d => {
      if (d.findIndex(x => x.value === value) === -1) {
        d.push(selectableList[i]);
      }
    }));
  }, [selectableList]);

  const handleRemoveEventType = useCallback((value) => {
    setSelected(produce(d => {
      const idx = d.findIndex(x => x.value === value);
      d.splice(idx, 1);
    }));
  }, []);

  return (
    <Wrapper>
      <Filter>
        <Round8Dropdown key={selectableList.length} items={selectableList} defaultLabel={"Event type"}
                        onChange={handleChangeEventType}/>
        <SelectedFilterWrapper>
          {
            selected.map(x => (
              <SelectedFilter key={x.value} onClick={() => handleRemoveEventType(x.value)}>{x.label}</SelectedFilter>
            ))
          }
        </SelectedFilterWrapper>
      </Filter>
      <StatTable menu={'activity'} rows={activityList} hideHead/>
    </Wrapper>
  )
};

export default Activity;
