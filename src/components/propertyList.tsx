import React from "react";
import styled from "@emotion/styled";
import { Card, Space, Typography } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Property } from "../types/types";
import { convertToTitleCase } from "../common/utils";
import {
  PropertyScore,
  calculateAllPropertyScores,
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../common/propertyUtils";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import Moment from "react-moment";
import { FlexRow } from "./styled/layout";
import { MyTheme } from "./styled/theme";
import moment from "moment";
import { Badge } from "@chakra-ui/react";

const { Text, Link } = Typography;

const PropertyListContainer = styled.div`
  padding: 8px 20px;
`;

export type SortByEnum =
  | "dateAdded"
  | "highestScore"
  | "lowestCost"
  | "highestPoints ";

interface PropertyListProps {
  properties: Property[];
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  authedUserId: string;
  sortBy: SortByEnum;
}

export function PropertyList({
  properties,
  openUpdateProperty,
  handleRequestDeleteProperty,
  authedUserId,
  sortBy,
}: PropertyListProps) {
  const propertyScores = calculateAllPropertyScores(properties);

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === "highestScore") {
      return propertyScores[b.id].score - propertyScores[a.id].score;
    } else if (sortBy === "lowestCost") {
      return propertyScores[b.id].cost - propertyScores[a.id].cost;
    } else {
      const da = moment(a.created_at.toString());
      const db = moment(b.created_at.toString());
      return da.diff(db);
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
            authedUserId={authedUserId}
          />
        </div>
      ))}
    </PropertyListContainer>
  );
}

interface PropertyCardProps {
  property: Property;
  propertyScore: PropertyScore;
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  authedUserId: string;
}

export function PropertyCard({
  property,
  propertyScore,
  openUpdateProperty,
  handleRequestDeleteProperty,
  authedUserId,
}: PropertyCardProps) {
  const propertCardStyle = {
    borderRadius: "6px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 3px",
  };
  return (
    <Card
      bordered={false}
      style={{ borderRadius: "8px" }}
      title={
        <PropertyCardHeader property={property} authedUserId={authedUserId} />
      }
      extra={
        <PropertyCardExtra
          property={property}
          propertyScore={propertyScore}
          handleRequestUpdate={() => openUpdateProperty(property)}
          handleRequestDelete={() => handleRequestDeleteProperty(property)}
          authedUserId={authedUserId}
        />
      }
      size="small"
    >
      <FlexRow>
        <Space wrap>
          {propertyFieldDefs.numberFields.map((k) => (
            <Card
              bordered={false}
              style={propertCardStyle}
              key={k}
              size="small"
            >
              <Text style={{ fontSize: "0.75em" }}>
                {convertToTitleCase(k)}
              </Text>

              <div>
                {propertyNumberInputConfig[k].prefix && (
                  <Text style={{ paddingRight: "2px" }}>
                    {propertyNumberInputConfig[k].prefix}
                  </Text>
                )}

                <Text>{property[k] ? property[k].toString() : "..."}</Text>
                {propertyNumberInputConfig[k].suffix && (
                  <Text
                    style={{
                      paddingLeft: "2px",
                      fontSize: "0.6em",
                    }}
                  >
                    {propertyNumberInputConfig[k].suffix}
                  </Text>
                )}
              </div>
            </Card>
          ))}

          {propertyFieldDefs.qualityEnumFields.map((k) => (
            <Card
              key={k}
              size="small"
              bordered={false}
              style={propertCardStyle}
            >
              <Text style={{ fontSize: "0.75em" }}>
                {convertToTitleCase(k)}
              </Text>
              <div style={{ fontSize: "1.1em" }}>{property[k]}</div>
            </Card>
          ))}

          {propertyFieldDefs.boolFields.map((k) => (
            <Card
              key={k}
              size="small"
              bordered={false}
              style={propertCardStyle}
            >
              <Text style={{ fontSize: "0.75em" }}>
                {convertToTitleCase(k)}
              </Text>
              <div style={{ fontSize: "1.1em" }}>
                <BooleanValueDisplay input={property[k]} />
              </div>
            </Card>
          ))}
        </Space>
      </FlexRow>
    </Card>
  );
}

interface PropertyCardHeaderProps {
  property: Property;
  authedUserId: string;
}

const PropertyCardHeader = ({
  property: {
    user_id,
    created_at,
    url_link,
    agent_email,
    agent_phone,
    agent_website,
  },
  authedUserId,
}: PropertyCardHeaderProps) => (
  <FlexRow style={{ fontSize: "1.1em" }}>
    <Space size={20}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {authedUserId === user_id && (
          <Text style={{ fontSize: "0.5em" }}>Added by You on</Text>
        )}
        <Moment style={{ fontSize: "0.6em" }} format="DD/MM/YYYY">
          {new Date(created_at)}
        </Moment>
      </div>

      {url_link && (
        <Link style={{ fontSize: "0.7em" }} href={url_link} target="_blank">
          {url_link}
        </Link>
      )}
      {agent_website && (
        <Link
          style={{ fontSize: "0.7em" }}
          href={agent_website}
          target="_blank"
        >
          {agent_website}
        </Link>
      )}
      {agent_phone && <Text style={{ fontSize: "0.7em" }}>{agent_phone}</Text>}
      {agent_email && <Text style={{ fontSize: "0.7em" }}>{agent_email}</Text>}
    </Space>
  </FlexRow>
);

interface PropertyCardExtraProps {
  property: Property;
  propertyScore: PropertyScore;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  authedUserId: string;
}

/// Includes the score calculation and display.
const PropertyCardExtra = ({
  property,
  propertyScore,
  handleRequestUpdate,
  handleRequestDelete,
  authedUserId,
}: PropertyCardExtraProps) => (
  <Space size={30}>
    <PropertyCardScoreDispplay propertyScore={propertyScore} />
    {authedUserId === property.user_id && (
      <EditTwoTone
        key="edit"
        style={{ fontSize: "20px" }}
        twoToneColor="#0042bc"
        onClick={handleRequestUpdate}
      />
    )}

    {authedUserId === property.user_id && (
      <DeleteTwoTone
        key="delete"
        style={{ fontSize: "20px" }}
        twoToneColor="#d00c0c"
        onClick={handleRequestDelete}
      />
    )}
  </Space>
);

const PropertyCardScoreDispplay = ({
  propertyScore: { cost, points, score },
}: {
  propertyScore: PropertyScore;
}) => (
  <Space size={20}>
    <div style={{ fontWeight: "bold" }}>30 Yr Cost: £{Math.abs(cost)}</div>
    <div style={{ fontWeight: "bold" }}>Points: {points}</div>
    <div
      style={{
        color: MyTheme.colors.primary,
        fontSize: "1.2em",
        fontWeight: "bold",
        background: MyTheme.colors.secondary,
        borderRadius: "20px",
        paddingLeft: "6px",
        paddingRight: "10px",
      }}
    >
      {score}
      <Badge position="relative" bottom={0.5} right={-0.5} fontSize="0.3em">
        Points - cost
      </Badge>
    </div>
  </Space>
);

const BooleanValueDisplay = ({ input }: { input: boolean | null }) => {
  return input === true ? (
    <CheckCircleTwoTone twoToneColor="#06c582" />
  ) : input === false ? (
    <CloseCircleTwoTone twoToneColor="#d90832" />
  ) : (
    <QuestionCircleTwoTone twoToneColor="#ababab" />
  );
};
