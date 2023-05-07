import React from "react";
import styled from "@emotion/styled";
import { Property } from "../../types/types";
import { calculateAllPropertyScores } from "../../common/propertyUtils";
import moment from "moment";
import { PropertyCard } from "./PropertyCard";

const PropertyListContainer = styled.div`
  padding: 8px 20px;
`;

export type SortByEnum =
  | "dateAdded"
  | "highestScore"
  | "lowestCost"
  | "highestPoints";

interface PropertyListProps {
  properties: Property[];
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  handleRequestNoteUpdate: (p: Property) => void;
  authedUserId: string;
  sortBy: SortByEnum;
}

export function PropertyList({
  properties,
  openUpdateProperty,
  handleRequestDeleteProperty,
  handleRequestNoteUpdate,
  authedUserId,
  sortBy,
}: PropertyListProps) {
  const propertyScores = calculateAllPropertyScores(properties);

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === "highestScore") {
      return propertyScores[b.id].score - propertyScores[a.id].score;
    } else if (sortBy === "lowestCost") {
      return propertyScores[a.id].cost - propertyScores[b.id].cost;
    } else if (sortBy === "highestPoints") {
      return propertyScores[b.id].points - propertyScores[a.id].points;
    } else {
      const da = moment(a.created_at.toString());
      const db = moment(b.created_at.toString());
      return db.diff(da);
    }
  });

  return (
    <PropertyListContainer>
      {sortedProperties.map((p) => (
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
      ))}
    </PropertyListContainer>
  );
}
