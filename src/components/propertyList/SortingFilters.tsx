import React from "react";
import { Input, Select } from "antd";
import styled from "@emotion/styled";
import { MySpacer } from "../styled/layout";
import { useMediaSize } from "../../common/useMediaSize";
import { DeviceSize } from "../../types/types";

export type SortByEnum =
  | "recentlyAdded"
  | "highestScore"
  | "lowestCost"
  | "highestPoints"
  | "sqrMtrCost";

export type ShowTypeEnum = "all" | "completed" | "awaitingInfo" | "likes";

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
    ["likes", "Your Likes"],
  ];

  const buildTextSeactInput = () => (
    <Input
      placeholder="Search listing title"
      onChange={(e) => setSearchText(e.target.value)}
      value={searchText}
      style={{ width: 240 }}
      allowClear
    />
  );

  const buildSortSelect = () => (
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
  );

  const buildshowTypeSelect = () => {
    return (
      <Select
        defaultValue={showType}
        style={{ width: 180 }}
        onChange={setShowType}
        value={showType}
        options={radioInputs.map((i) => ({
          value: i[0],
          label: i[1],
        }))}
      />
    );
  };

  return (
    <SortingFiltersContainer deviceSize={deviceSize}>
      <div>
        {deviceSize === "small" ? buildTextSeactInput() : buildshowTypeSelect()}
      </div>
      <MySpacer width={12} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {deviceSize === "small" ? buildshowTypeSelect() : buildSortSelect()}
        <MySpacer width={12} />
        {deviceSize === "small" ? buildSortSelect() : buildTextSeactInput()}
      </div>
    </SortingFiltersContainer>
  );
}

const SortingFiltersContainer = styled.div<{ deviceSize: DeviceSize }>`
  padding: 0 8px 8px 8px;
  margin: 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  flex-direction: ${(p) => (p.deviceSize === "large" ? "row" : "column")};
  row-gap: 8px;
`;

export default SortingFilters;
