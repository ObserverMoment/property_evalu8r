import { Card, Space, Typography } from "antd";
import { Property } from "../../types/types";
import {
  PropertyScore,
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../../common/propertyUtils";
import { FlexRow } from "../styled/layout";
import { convertToTitleCase, currencyFormat } from "../../common/utils";
import Moment from "react-moment";

import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
  FileAddTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { MyTheme } from "../styled/theme";
import { Badge } from "@chakra-ui/react";

const { Text, Link } = Typography;

interface PropertyCardProps {
  property: Property;
  propertyScore: PropertyScore;
  openUpdateProperty: (p: Property) => void;
  handleRequestDeleteProperty: (p: Property) => void;
  handleRequestNoteUpdate: (p: Property) => void;
  authedUserId: string;
}

export function PropertyCard({
  property,
  propertyScore,
  openUpdateProperty,
  handleRequestDeleteProperty,
  handleRequestNoteUpdate,
  authedUserId,
}: PropertyCardProps) {
  const propertyFieldCardStyle = {
    borderRadius: "6px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 3px",
    padding: "0px",
    margin: "3px",
  };

  return (
    <Card
      bordered={false}
      title={
        <PropertyCardHeader
          property={property}
          authedUserId={authedUserId}
          handleRequestNoteUpdate={() => handleRequestNoteUpdate(property)}
          handleRequestUpdate={() => openUpdateProperty(property)}
          handleRequestDelete={() => handleRequestDeleteProperty(property)}
        />
      }
      bodyStyle={{ padding: "0 10px 8px 10px" }}
      extra={<PropertyCardScoreDispplay propertyScore={propertyScore} />}
      size="small"
    >
      <div
        onClick={() => handleRequestNoteUpdate(property)}
        style={{
          padding: "0 4px 4px 4px",
          textAlign: "left",
          fontSize: "0.7em",
        }}
      >
        {property.notes}
      </div>
      <FlexRow>
        {propertyFieldDefs.numberFields.map((k) => (
          <Card
            bordered={false}
            style={propertyFieldCardStyle}
            key={k}
            size="small"
          >
            <Text style={{ fontSize: "0.75em" }}>{convertToTitleCase(k)}</Text>

            <div>
              <Text>
                {property[k]
                  ? propertyNumberInputConfig[k].displayFormat(property[k])
                  : "..."}
              </Text>

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
            style={propertyFieldCardStyle}
          >
            <Text style={{ fontSize: "0.75em" }}>{convertToTitleCase(k)}</Text>
            <div>{property[k]}</div>
          </Card>
        ))}

        {propertyFieldDefs.boolFields.map((k) => (
          <Card
            key={k}
            size="small"
            bordered={false}
            style={propertyFieldCardStyle}
          >
            <Text style={{ fontSize: "0.75em" }}>{convertToTitleCase(k)}</Text>
            <div style={{ fontSize: "1.2em" }}>
              <BooleanValueDisplay input={property[k]} />
            </div>
          </Card>
        ))}
      </FlexRow>
    </Card>
  );
}

interface PropertyCardHeaderProps {
  property: Property;
  authedUserId: string;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  handleRequestNoteUpdate: () => void;
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
  handleRequestUpdate,
  handleRequestDelete,
  handleRequestNoteUpdate,
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

      {authedUserId === user_id && (
        <FileAddTwoTone
          key="note"
          style={{ fontSize: "20px" }}
          twoToneColor="#0042bc"
          onClick={handleRequestNoteUpdate}
        />
      )}

      {authedUserId === user_id && (
        <EditTwoTone
          key="edit"
          style={{ fontSize: "20px" }}
          twoToneColor="#0042bc"
          onClick={handleRequestUpdate}
        />
      )}

      {authedUserId === user_id && (
        <DeleteTwoTone
          key="delete"
          style={{ fontSize: "20px" }}
          twoToneColor="#d00c0c"
          onClick={handleRequestDelete}
        />
      )}
    </Space>
  </FlexRow>
);

const PropertyCardScoreDispplay = ({
  propertyScore: { cost, points, score },
}: {
  propertyScore: PropertyScore;
}) => (
  <Space direction="horizontal" size={16}>
    <div>
      <BadgeBuilder label="30 Yr Cost" />
      {currencyFormat(Math.abs(cost))}
    </div>
    <div>
      <BadgeBuilder label="Points" />
      {points}
    </div>
    <div
      style={{
        color: MyTheme.colors.primary,
        background: MyTheme.colors.secondary,
        borderRadius: "6px",
        paddingLeft: "12px",
        paddingRight: "8px",
      }}
    >
      <BadgeBuilder label=" Points - cost" />
      {score}
    </div>
  </Space>
);

const BadgeBuilder = ({ label }: { label: string }) => (
  <Badge position="relative" bottom={0.7} left={-1} fontSize="0.5em">
    {label}
  </Badge>
);

const BooleanValueDisplay = ({ input }: { input: boolean | null }) => {
  return input === true ? (
    <CheckCircleTwoTone twoToneColor="#06c582" />
  ) : input === false ? (
    <CloseCircleTwoTone twoToneColor="#d90832" />
  ) : (
    <QuestionCircleTwoTone twoToneColor="#d4d4d4" />
  );
};
