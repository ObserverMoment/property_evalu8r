import React, { useState } from "react";
import styled from "@emotion/styled";
import { Property } from "../../types/types";
import {
  calculateAllPropertyScores,
  checkPropertyCompleteInfo,
} from "../../common/propertyUtils";
import moment from "moment";
import { PropertyCard } from "./PropertyCard";
import SortingFilters, { ShowTypeEnum, SortByEnum } from "../SortingFilters";
import { Empty } from "antd";

interface PropertyListProps {
  properties: Property[];
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  handleRequestNoteUpdate: (p: Property) => void;
  authedUserId: string;
}

export function PropertyList({
  properties,
  openUpdateProperty,
  handleRequestDeleteProperty,
  handleRequestNoteUpdate,
  authedUserId,
}: PropertyListProps) {
  // Sort, search and filter
  const [searchText, setSearchText] = useState<string>("");
  const [showType, setShowType] = useState<ShowTypeEnum>("all");
  const [sortBy, setSortBy] = useState<SortByEnum>("recentlyAdded");

  console.log(searchText);

  const propertyScores = calculateAllPropertyScores(properties);

  const sortProperties = (properties: Property[]) =>
    properties.sort((a, b) => {
      if (sortBy === "highestScore") {
        return propertyScores[b.id].score - propertyScores[a.id].score;
      } else if (sortBy === "lowestCost") {
        return propertyScores[a.id].cost - propertyScores[b.id].cost;
      } else if (sortBy === "highestPoints") {
        return propertyScores[b.id].points - propertyScores[a.id].points;
      } else if (sortBy === "sqrMtrCost") {
        // Abitrarily high number to ensure incomplete entries go to the bottom.
        const ac = propertyScores[a.id].sqMtrCost;
        const bc = propertyScores[b.id].sqMtrCost;
        return !bc ? -1 : !ac ? 1 : ac - bc;
      } else {
        const da = moment(a.created_at.toString());
        const db = moment(b.created_at.toString());
        return db.diff(da);
      }
    });

  const searchFiltered = [...properties].filter((p) =>
    p.listing_title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const typeFiltered =
    showType === "completed"
      ? checkPropertyCompleteInfo(searchFiltered).completed
      : showType === "awaitingInfo"
      ? checkPropertyCompleteInfo(searchFiltered).awaitingInfo
      : searchFiltered;

  const sortedProperties = sortProperties(typeFiltered);

  return (
    <PropertyListContainer>
      <SortingFilters
        searchText={searchText}
        setSearchText={setSearchText}
        showType={showType}
        setShowType={setShowType}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {sortedProperties.length > 0 ? (
        sortedProperties.map((p) => (
          <div key={p.id} style={{ marginBottom: "8px" }}>
            <PropertyCard
              key={p.id}
              property={p}
              propertyScore={propertyScores[p.id]}
              openUpdateProperty={openUpdateProperty}
              handleRequestDeleteProperty={handleRequestDeleteProperty}
              handleRequestNoteUpdate={handleRequestNoteUpdate}
              authedUserId={authedUserId}
            />
          </div>
        ))
      ) : (
        <Empty description="No properties to display..." />
      )}
    </PropertyListContainer>
  );
}

const PropertyListContainer = styled.div`
  padding: 8px 20px;
`;
