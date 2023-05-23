import React from "react";
import { Input, Select } from "antd";
import styled from "@emotion/styled";
import { useMediaSize } from "../../common/useMediaSize";
import { DeviceSize, SelectInputOption } from "../../types/types";

export type SortByEnum =
  | "recentlyAdded"
  | "highestScore"
  | "lowestCost"
  | "highestPoints"
  | "sqrMtrCost"
  | "commuteAnalysis";

interface SortingFiltersProps {
  searchText: string;
  setSearchText: (s: string) => void;
  showTypeOptions: SelectInputOption[];
  showType: string;
  setShowType: (t: string) => void;
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
  showTypeOptions,
}: SortingFiltersProps) {
  const deviceSize = useMediaSize();

  return (
    <SortingFiltersContainer deviceSize={deviceSize}>
      <Select
        defaultValue={showType}
        style={{ width: 180 }}
        onChange={setShowType}
        value={showType}
        options={showTypeOptions}
      />
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
          { value: "commuteAnalysis", label: "Best for Commuting" },
        ]}
      />
      <Input
        placeholder="Search listing title"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        style={{ width: 180 }}
        allowClear
      />
    </SortingFiltersContainer>
  );
}

const SortingFiltersContainer = styled.div<{ deviceSize: DeviceSize }>`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  row-gap: 12px;
  column-gap: 12px;
`;

export default SortingFilters;
