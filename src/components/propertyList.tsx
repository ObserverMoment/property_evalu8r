import React from "react";
import styled from "@emotion/styled";
import { Card, Space, Typography } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Property } from "../types/types";
import { convertToTitleCase } from "../common/utils";
import {
  calculatePropertyScore,
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

const { Text, Link } = Typography;

const PropertyListContainer = styled.div`
  padding: 8px 20px;
`;

interface PropertyListProps {
  properties: Property[];
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  authedUserId: string;
}

export function PropertyList({
  properties,
  openUpdateProperty,
  handleRequestDeleteProperty,
  authedUserId,
}: PropertyListProps) {
  return (
    <PropertyListContainer>
      {properties.map((p) => (
        <div key={p.id} style={{ marginBottom: "8px" }}>
          <PropertyCard
            key={p.id}
            property={p}
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
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  authedUserId: string;
}

export function PropertyCard({
  property,
  openUpdateProperty,
  handleRequestDeleteProperty,
  authedUserId,
}: PropertyCardProps) {
  const propertCardStyle = { border: "1px solid grey", borderRadius: "6px" };
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
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  authedUserId: string;
}

/// Includes the score calculation and display.
const PropertyCardExtra = ({
  property,
  handleRequestUpdate,
  handleRequestDelete,
  authedUserId,
}: PropertyCardExtraProps) => (
  <Space size={30}>
    <PropertyCardScoreDispplay
      costAndScore={calculatePropertyScore(property)}
    />
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
  costAndScore: { cost, score },
}: {
  costAndScore: { cost: number; score: number };
}) => (
  <Space size={30}>
    <div>30 Yr Cost: £{Math.abs(cost)}</div>
    <div>Score: {score}</div>
    <div
      style={{
        color: MyTheme.colors.primary,
        fontSize: "1.7em",
        fontWeight: "bold",
      }}
    >
      {score + cost}
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
