import styled from "@emotion/styled";
import { MyTheme } from "../styled/theme";
import { FlexRow, MySpacer } from "../styled/layout";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";

interface PropertyListHeaderButtonsProps {
  setOpenAddPanel: (v: boolean) => void;
  setOpenCalendarPanel: (v: boolean) => void;
}
/// Add Property and Open Viewing Calendar Buttons
export const PropertyListHeaderButtons = ({
  setOpenAddPanel,
  setOpenCalendarPanel,
}: PropertyListHeaderButtonsProps) => {
  return (
    <FlexRow>
      <AddPropertyButton setOpenAddPanel={setOpenAddPanel} />
      <MySpacer width={8} />
      <OpenCalendarButton setOpenCalendarPanel={setOpenCalendarPanel} />
    </FlexRow>
  );
};

const AddPropertyButtonContainer = styled.button`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: ${MyTheme.colors.primary};
  color: ${MyTheme.colors.secondary};
  font-weight: bold;
  text-align: center;
  font-size: 0.9em;
  text-decoration: none;
  outline: none;
  border: none;
  transition: all 350ms ease;
  :hover {
    cursor: pointer;
    background-color: ${MyTheme.colors.linkText};
    color: ${MyTheme.colors.primary};
  }
  :disabled {
    opacity: 0.1;
  }
`;

const AddPropertyButton = ({
  setOpenAddPanel,
}: {
  setOpenAddPanel: (v: boolean) => void;
}) => (
  <AddPropertyButtonContainer onClick={() => setOpenAddPanel(true)}>
    <PlusOutlined />
    <MySpacer width={4} />
    Add Property
  </AddPropertyButtonContainer>
);

const OpenCalendarButton = ({
  setOpenCalendarPanel,
}: {
  setOpenCalendarPanel: (v: boolean) => void;
}) => (
  <AddPropertyButtonContainer onClick={() => setOpenCalendarPanel(true)}>
    <CalendarOutlined />
    <MySpacer width={4} />
    Viewings
  </AddPropertyButtonContainer>
);
