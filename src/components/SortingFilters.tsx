import React from "react";
import { Input, Radio, Select } from "antd";
import styled from "@emotion/styled";
import { MyTheme } from "./styled/theme";
import { MySpacer } from "./styled/layout";

export type SortByEnum =
  | "recentlyAdded"
  | "highestScore"
  | "lowestCost"
  | "highestPoints"
  | "sqrMtrCost";

export type ShowTypeEnum = "all" | "completed" | "awaitingInfo";

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
  return (
    <SortingFiltersContainer>
      <div>
        <Radio.Group
          onChange={(e) => setShowType(e.target.value)}
          defaultValue={showType}
          value={showType}
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
          <Radio.Button value="awaitingInfo">Awaiting Info</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ display: "flex" }}>
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

        <MySpacer width={20} />

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

const SortingFiltersContainer = styled.div`
  padding: 8px;
  margin: 12px;
  background: ${MyTheme.colors.secondary};
  border-radius: 30em;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  display: flex;
  justify-content: space-between;
  width: 90vw;
`;

export default SortingFilters;
