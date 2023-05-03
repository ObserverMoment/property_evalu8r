import React from "react";
import styled from "@emotion/styled";
import { Card, Space } from "antd";
import { EditTwoTone, DeleteTwoTone, AimOutlined } from "@ant-design/icons";
import { FlexRow, Spacer } from "./common/styled";
import { Property } from "./types/types";

const PropertyListContainer = styled.div`
  padding: 8px 20px;
`;

export function PropertyList({ properties }: { properties: Property[] }) {
  return (
    <PropertyListContainer>
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </PropertyListContainer>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card
      title={property.url_link}
      extra={
        <PropertyCardExtra score={20} onEdit={() => {}} onDelete={() => {}} />
      }
      size="small"
    >
      <FlexRow>
        {Object.entries(property)
          .filter(([k, v]) => k !== "url_link")
          .map(([k, v]) => (
            <Card size="small">
              <div>{k}</div>
              <div>{v.toString()}</div>
            </Card>
          ))}
      </FlexRow>
    </Card>
  );
}

interface PropertyCardExtraProps {
  score: number;
  onEdit: () => void;
  onDelete: () => void;
}

const PropertyCardExtra = ({
  score,
  onEdit,
  onDelete,
}: PropertyCardExtraProps) => (
  <Space
    size={30}
    style={{ fontSize: "1.3em", fontWeight: "bold", color: "#e10bc8" }}
  >
    <FlexRow>
      <AimOutlined />
      <Spacer width={8} />
      <div>{score}</div>
    </FlexRow>
    <EditTwoTone
      key="edit"
      style={{ fontSize: "20px" }}
      twoToneColor="#097aca"
      onClick={onEdit}
    />
    <DeleteTwoTone
      key="delete"
      style={{ fontSize: "20px" }}
      twoToneColor="#c74f4f"
      onClick={onDelete}
    />
  </Space>
);
