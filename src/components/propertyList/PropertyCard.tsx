import {
  Property,
  PropertyCommuteScore,
  PropertyScore,
  UserProfile,
} from "../../types/types";
import { useMediaSize } from "../../common/useMediaSize";
import { PropertyCardScoreDisplay } from "./PropertyCardScoreDisplay";
import { PropertyCardInfoFields } from "./PropertyCardInfoFields";
import { MyCard } from "../styled/styled";
import { FlexRow, MySpacer } from "../styled/layout";
import { PropertyCardFieldsDisplay } from "./PropertyCardFieldsDisplay";
import { PropertyCardEditButtons } from "./PropertyCardEditButtons";
import { PropertyCardLikes } from "./PropertyCardLikes";
import { CalendarOutlined, AimOutlined } from "@ant-design/icons";
import { currencyFormat } from "../../common/utils";
import dayjs from "dayjs";
import { MyTheme } from "../styled/theme";
import styled from "@emotion/styled";

interface PropertyCardProps {
  property: Property;
  propertyScore: PropertyScore;
  propertyCommuteScore?: PropertyCommuteScore;
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  handleRequestNoteUpdate: (p: Property) => void;
  likes: UserProfile[];
  handleAddPropertyLike: (pId: number) => void;
  handleRemovePropertyLike: (pId: number) => void;
  handleOpenCommuteAnalysis: (p: Property) => void;
  noteCount: number;
  authedUserId: string;
}

export function PropertyCard({
  property,
  propertyScore,
  propertyCommuteScore,
  openUpdateProperty,
  handleRequestDeleteProperty,
  handleRequestNoteUpdate,
  likes,
  handleAddPropertyLike,
  handleRemovePropertyLike,
  handleOpenCommuteAnalysis,
  noteCount,
  authedUserId,
}: PropertyCardProps) {
  const deviceSize = useMediaSize();

  const buildPropertyCardHeader = () => {
    return (
      <FlexRow style={{ padding: "2px" }}>
        {property.view_date && (
          <OfferViewingContainer
            style={{
              background: MyTheme.colors.background,
            }}
          >
            <CalendarOutlined style={{ paddingRight: "4px" }} />
            <div style={{ fontWeight: "bold" }}>
              {dayjs(property.view_date).format("h:mm A DD/MM/YY")}
            </div>
          </OfferViewingContainer>
        )}
        {property.view_date && <MySpacer width={10} />}
        {property.offered && (
          <OfferViewingContainer
            style={{ background: MyTheme.colors.background }}
          >
            <AimOutlined style={{ paddingRight: "4px" }} />
            <div style={{ fontWeight: "bold" }}>
              {currencyFormat(property.offered)}
            </div>
          </OfferViewingContainer>
        )}
      </FlexRow>
    );
  };

  const buildPropertyCardFooter = () => {
    return (
      <FlexRow
        style={{ padding: "10px 8px 0 8px" }}
        justifyContent="space-between"
      >
        <PropertyCardLikes
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
          handleOpenCommuteAnalysis={() => handleOpenCommuteAnalysis(property)}
          noteCount={noteCount}
        />
      </FlexRow>
    );
  };

  /// Begin JSX Render ///
  return deviceSize === "small" ? (
    <MyCard>
      {buildPropertyCardHeader()}
      <PropertyCardInfoFields property={property} deviceSize={deviceSize} />
      <PropertyCardScoreDisplay
        propertyScore={propertyScore}
        deviceSize={deviceSize}
        propertyCommuteScore={propertyCommuteScore}
      />
      <PropertyCardFieldsDisplay property={property} />
      {buildPropertyCardFooter()}
    </MyCard>
  ) : (
    <MyCard>
      {buildPropertyCardHeader()}
      <FlexRow
        justifyContent="space-between"
        style={{ padding: "0 2px 6px 2px" }}
      >
        <PropertyCardInfoFields property={property} deviceSize={deviceSize} />
        <PropertyCardScoreDisplay
          propertyScore={propertyScore}
          deviceSize={deviceSize}
          propertyCommuteScore={propertyCommuteScore}
        />
      </FlexRow>
      <PropertyCardFieldsDisplay property={property} />
      {buildPropertyCardFooter()}
    </MyCard>
  );
}

const OfferViewingContainer = styled.div`
  display: flex;
  background: ${MyTheme.colors.background};
  border-radius: 8px;
  font-weight: bold;
  padding: 3px 8px;
  * {
    font-size: 0.8em;
  }
`;
