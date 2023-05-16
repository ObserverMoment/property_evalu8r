import { Property, UserProfile } from "../../types/types";
import { PropertyScore } from "../../common/propertyUtils";
import { useMediaSize } from "../../common/useMediaSize";
import { PropertyCardScoreDisplay } from "./PropertyCardScoreDisplay";
import { PropertyCardInfoFields } from "./PropertyCardInfoFields";
import { MyCard } from "../styled/styled";
import { FlexRow } from "../styled/layout";
import { PropertyCardFieldsDisplay } from "./PropertyCardFieldsDisplay";
import { PropertyCardEditButtons } from "./PropertyCardEditButtons";
import { PropertyCardLikeDislike } from "./PropertyCardLikeDislike";

interface PropertyCardProps {
  property: Property;
  propertyScore: PropertyScore;
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  handleRequestNoteUpdate: (p: Property) => void;
  likes: UserProfile[];
  handleAddPropertyLike: (pId: number) => void;
  handleRemovePropertyLike: (pId: number) => void;
  authedUserId: string;
}

export function PropertyCard({
  property,
  propertyScore,
  openUpdateProperty,
  handleRequestDeleteProperty,
  handleRequestNoteUpdate,
  likes,
  handleAddPropertyLike,
  handleRemovePropertyLike,
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

  const buildPropertyCardFooter = () => {
    return (
      <FlexRow
        style={{ padding: "10px 16px 0 8px" }}
        justifyContent="space-between"
      >
        <PropertyCardLikeDislike
          authedUserId={authedUserId}
          propertyLikes={likes}
          handleAddPropertyLike={() => handleAddPropertyLike(property.id)}
          handleRemovePropertyLike={() => handleRemovePropertyLike(property.id)}
        />
        <PropertyCardEditButtons
          property={property}
          authedUserId={authedUserId}
          handleRequestUpdate={() => openUpdateProperty(property)}
          handleRequestDelete={() => handleRequestDeleteProperty(property)}
          handleRequestNoteUpdate={() => handleRequestNoteUpdate(property)}
        />
      </FlexRow>
    );
  };

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
      {buildPropertyCardFooter()}
    </MyCard>
  ) : (
    <MyCard>
      {buildPropertyCardInfoFields()}
      {buildPropertyCardScoreDisplay()}
      {buildPropertyCardFieldsDisplay()}
      {buildPropertyCardFooter()}
    </MyCard>
  );
}
