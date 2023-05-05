import React from "react";
import styled from "@emotion/styled";
import { Card, Space, Typography } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  LineChartOutlined,
} from "@ant-design/icons";
import { FlexRow, Spacer } from "../common/styled";
import { Property } from "../types/types";
import { convertToTitleCase } from "../common/utils";
import {
  calculatePropertyScore,
  propertyFieldDefs,
} from "../common/propertyUtils";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import Moment from "react-moment";

const { Text, Link } = Typography;

const PropertyListContainer = styled.div`
  padding: 8px 20px;
`;

interface PropertyListProps {
  properties: Property[];
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
}

export function PropertyList({
  properties,
  openUpdateProperty,
  handleRequestDeleteProperty,
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
}

export function PropertyCard({
  property,
  openUpdateProperty,
  handleRequestDeleteProperty,
}: PropertyCardProps) {
  return (
    <Card
      title={
        <PropertyCardHeader
          dateAdded={new Date(property.created_at)}
          urlLink={property.url_link}
          agentWebsite={property.agent_website}
          agentEmail={property.agent_email}
          agentPhone={property.agent_phone}
        />
      }
      extra={
        <PropertyCardExtra
          property={property}
          handleRequestUpdate={() => openUpdateProperty(property)}
          handleRequestDelete={() => handleRequestDeleteProperty(property)}
        />
      }
      size="small"
    >
      <FlexRow>
        <Space>
          {propertyFieldDefs.numberFields.map((k) => (
            <Card key={k} size="small">
              <Text style={{ fontSize: "0.75em" }}>
                {convertToTitleCase(k)}
              </Text>
              <div style={{ fontSize: "1.1em" }}>
                {property[k] ? property[k].toString() : "..."}
              </div>
            </Card>
          ))}

          {propertyFieldDefs.qualityEnumFields.map((k) => (
            <Card key={k} size="small">
              <Text style={{ fontSize: "0.75em" }}>
                {convertToTitleCase(k)}
              </Text>
              <div style={{ fontSize: "1.1em" }}>{property[k]}</div>
            </Card>
          ))}

          {propertyFieldDefs.boolFields.map((k) => (
            <Card key={k} size="small">
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
  dateAdded: Date;
  urlLink: string | null | undefined;
  agentWebsite: string | null | undefined;
  agentPhone: string | null | undefined;
  agentEmail: string | null | undefined;
}

const PropertyCardHeader = ({
  dateAdded,
  urlLink,
  agentWebsite,
  agentPhone,
  agentEmail,
}: PropertyCardHeaderProps) => (
  <FlexRow>
    <Space size={30} style={{ fontSize: "1.2em" }}>
      <Moment style={{ fontSize: "0.7em" }} format="DD/MM/YYYY">
        {dateAdded}
      </Moment>
      {urlLink && (
        <Link style={{ fontSize: "0.75em" }} href={urlLink} target="_blank">
          {urlLink}
        </Link>
      )}
      {agentWebsite && (
        <Link
          style={{ fontSize: "0.75em" }}
          href={agentWebsite}
          target="_blank"
        >
          {agentWebsite}
        </Link>
      )}
      {agentPhone && <Text style={{ fontSize: "0.75em" }}>{agentPhone}</Text>}
      {agentEmail && <Text style={{ fontSize: "0.75em" }}>{agentEmail}</Text>}
    </Space>
  </FlexRow>
);

interface PropertyCardExtraProps {
  property: Property;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
}

/// Includes the score calculation and display.
const PropertyCardExtra = ({
  property,
  handleRequestUpdate,
  handleRequestDelete,
}: PropertyCardExtraProps) => (
  <Space
    size={30}
    style={{ fontSize: "1.3em", fontWeight: "bold", color: "#e10bc8" }}
  >
    <FlexRow>
      <LineChartOutlined />
      <Spacer width={8} />
      <div>{calculatePropertyScore(property)}</div>
    </FlexRow>
    <EditTwoTone
      key="edit"
      style={{ fontSize: "20px" }}
      twoToneColor="#0042bc"
      onClick={handleRequestUpdate}
    />
    <DeleteTwoTone
      key="delete"
      style={{ fontSize: "20px" }}
      twoToneColor="#d00c0c"
      onClick={handleRequestDelete}
    />
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
