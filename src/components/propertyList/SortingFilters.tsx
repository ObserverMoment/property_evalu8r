import React from "react";
import { Input, Radio, Select } from "antd";
import styled from "@emotion/styled";
import { MySpacer } from "../styled/layout";
import { useMediaSize } from "../../common/useMediaSize";
import { DeviceSize } from "../../types/types";
import { MyTheme } from "../styled/theme";

export type SortByEnum =
  | "recentlyAdded"
  | "highestScore"
  | "lowestCost"
  | "highestPoints"
  | "sqrMtrCost";

export type ShowTypeEnum = "all" | "completed" | "awaitingInfo" | "favourites";

interface SortingFiltersProps {
  searchText: string;
  setSearchText: (s: string) => void;
  showType: ShowTypeEnum;
  setShowType: (t: ShowTypeEnum) => void;
  sortBy: SortByEnum;
  setSortBy: (t: SortByEnum) => void;
}

function SortingFilters({
  searchText,
  setSearchText,
  showType,
  setShowType,
  sortBy,
  setSortBy,
}: SortingFiltersProps) {
  const deviceSize = useMediaSize();

  const radioInputs = [
    ["all", "All"],
    ["completed", "Completed"],
    ["awaitingInfo", "Awaiting Info"],
    ["favourites", "Favourites"],
  ];

  return (
    <SortingFiltersContainer deviceSize={deviceSize}>
      <div>
        <Radio.Group
          onChange={(e) => setShowType(e.target.value)}
          defaultValue={showType}
          value={showType}
        >
          {radioInputs.map(([value, display]) => (
            <StyledRadioButton
              key={value}
              active={showType === value ? 1 : null}
              value={value}
            >
              {display}
            </StyledRadioButton>
          ))}
          {/* <StyledRadioButton
            isActive={showType === "all" ? 1 : null}
            value="all"
          >
            All
          </StyledRadioButton>
          <StyledRadioButton
            isActive={showType === "completed" ? 1 : null}
            value="completed"
          >
            Completed
          </StyledRadioButton>
          <StyledRadioButton
            isActive={showType === "awaitingInfo" ? 1 : null}
            value="awaitingInfo"
          >
            Awaiting Info
          </StyledRadioButton>
          <StyledRadioButton
            isActive={showType === "favourites" ? 1 : null}
            value="favourites"
          >
            Favourites
          </StyledRadioButton> */}
        </Radio.Group>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Select
          defaultValue={sortBy}
          style={{ width: 180 }}
          onChange={setSortBy}
          value={sortBy}
          options={[
            { value: "recentlyAdded", label: "Recently Added" },
            { value: "highestScore", label: "Highest Score" },
            { value: "highestPoints", label: "Highest Points" },
            { value: "lowestCost", label: "Lowest Cost" },
            { value: "sqrMtrCost", label: "£ / Square Mtr" },
          ]}
        />

        <MySpacer width={12} />

        <Input
          placeholder="Search listing title"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          style={{ width: 240 }}
          allowClear
        />
      </div>
    </SortingFiltersContainer>
  );
}

const SortingFiltersContainer = styled.div<{ deviceSize: DeviceSize }>`
  padding: 8px;
  margin: 12px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  display: flex;
  justify-content: space-between;
  width: 90vw;
  flex-direction: ${(p) => (p.deviceSize === "large" ? "row" : "column")};
  row-gap: 8px;
`;

// https://styled-components.com/docs/api#transient-props
interface StyledRadioButtonProps {
  active: number | null;
}

const StyledRadioButton = styled(Radio.Button)<StyledRadioButtonProps>`
  background: ${(p) =>
    p.active ? MyTheme.colors.primary : "rgba(263,203,164,0.85)"};
  transition: all 200ms ease;
`;

export default SortingFilters;
