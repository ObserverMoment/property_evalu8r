import { FlexRow } from "../styled/layout";
import { DeviceSize, Property } from "../../types/types";
import styled from "@emotion/styled";
import { MyTheme } from "../styled/theme";
import { Popover } from "antd";

interface PropertyCardInfoFieldsProps {
  property: Property;
  authedUserId: string;
  deviceSize: DeviceSize;
}

export const PropertyCardInfoFields = ({
  property: {
    url_link,
    listing_title,
    agent_email,
    agent_phone,
    agent_website,
  },
  deviceSize,
}: PropertyCardInfoFieldsProps) => (
  <FlexRow
    gap="10px"
    alignItems="center"
    style={{
      padding: deviceSize === "large" ? 0 : "4px 2px",
    }}
  >
    {listing_title && (
      <InfoFieldText
        style={{
          fontWeight: "bold",
        }}
      >
        {listing_title}
      </InfoFieldText>
    )}

    {url_link && (
      <PropertyCardUrlLink href={url_link} rel="noreferrer" target="_blank">
        Property Link
      </PropertyCardUrlLink>
    )}

    <Popover
      content={
        <ContactDetailsPopoverContent
          agent_email={agent_email}
          agent_phone={agent_phone}
          agent_website={agent_website}
        />
      }
      trigger="click"
    >
      <PropertyCardContactInfo>Contact Info</PropertyCardContactInfo>
    </Popover>
  </FlexRow>
);

interface ContactDetailsPopoverContentProps {
  agent_website?: string | null;
  agent_phone?: string | null;
  agent_email?: string | null;
}

const ContactDetailsPopoverContent = ({
  agent_website,
  agent_phone,
  agent_email,
}: ContactDetailsPopoverContentProps) => (
  <div style={{ fontSize: "0.75em" }}>
    {agent_website ? (
      <PropertyCardUrlLink
        href={agent_website}
        rel="noreferrer"
        target="_blank"
      >
        {agent_website}
      </PropertyCardUrlLink>
    ) : (
      <div>Agent website: Not added</div>
    )}

    {agent_phone ? <div>{agent_phone}</div> : <div>Agent phone: Not added</div>}

    {agent_email ? <div>{agent_email}</div> : <div>Agent email: Not added</div>}
  </div>
);

const PropertyCardUrlLink = styled.a`
  color: ${MyTheme.colors.linkText};
  font-weight: bold;
  font-size: 0.8em;
`;

const PropertyCardContactInfo = styled.div`
  color: ${MyTheme.colors.linkText};
  font-size: 0.8em;
  font-weight: bold;
  :hover {
    cursor: pointer;
  }
`;

const InfoFieldText = styled.div`
  font-size: 0.8em;
`;
