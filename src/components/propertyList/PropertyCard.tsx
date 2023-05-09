import { Property } from "../../types/types";
import { PropertyScore } from "../../common/propertyUtils";
import { useMediaSize } from "../../common/useMediaSize";
import { PropertyCardScoreDisplay } from "./PropertyCardScoreDisplay";
import { PropertyCardInfoFields } from "./PropertyCardInfoFields";
import { MyCard } from "../styled/styled";
import { FlexRow } from "../styled/layout";
import { PropertyCardFieldsDisplay } from "./PropertyCardFieldsDisplay";
import { PropertyCardEditIcons } from "./PropertyCardEditIcons";

interface PropertyCardProps {
  property: Property;
  propertyScore: PropertyScore;
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  handleRequestNoteUpdate: (p: Property) => void;
  isFavourite: boolean;
  handleAddFavourite: (pId: number) => void;
  handleRemoveFavourite: (pId: number) => void;
  authedUserId: string;
}

export function PropertyCard({
  property,
  propertyScore,
  openUpdateProperty,
  handleRequestDeleteProperty,
  handleRequestNoteUpdate,
  isFavourite,
  handleAddFavourite,
  handleRemoveFavourite,
  authedUserId,
}: PropertyCardProps) {
  const deviceSize = useMediaSize();

  const buildPropertyCardInfoFields = () => (
    <PropertyCardInfoFields
      property={property}
      authedUserId={authedUserId}
      deviceSize={deviceSize}
    />
  );

  const buildPropertyCardEditIcons = () => (
    <FlexRow style={{ padding: "10px 16px 0 8px" }} justifyContent="end">
      <PropertyCardEditIcons
        property={property}
        authedUserId={authedUserId}
        handleRequestUpdate={() => openUpdateProperty(property)}
        handleRequestDelete={() => handleRequestDeleteProperty(property)}
        handleRequestNoteUpdate={() => handleRequestNoteUpdate(property)}
        isFavourite={isFavourite}
        handleAddFavourite={handleAddFavourite}
        handleRemoveFavourite={handleRemoveFavourite}
      />
    </FlexRow>
  );

  const buildPropertyCardScoreDisplay = () => (
    <PropertyCardScoreDisplay
      propertyScore={propertyScore}
      deviceSize={deviceSize}
    />
  );
  const buildPropertyCardFieldsDisplay = () => (
    <PropertyCardFieldsDisplay property={property} />
  );

  return deviceSize === "large" ? (
    <MyCard>
      <FlexRow
        justifyContent="space-between"
        style={{ padding: "0 2px 6px 2px" }}
      >
        {buildPropertyCardInfoFields()}
        {buildPropertyCardScoreDisplay()}
      </FlexRow>
      {buildPropertyCardFieldsDisplay()}
      {buildPropertyCardEditIcons()}
    </MyCard>
  ) : (
    <MyCard>
      {buildPropertyCardInfoFields()}
      {buildPropertyCardScoreDisplay()}
      {buildPropertyCardFieldsDisplay()}
      {buildPropertyCardEditIcons()}
    </MyCard>
  );
}
