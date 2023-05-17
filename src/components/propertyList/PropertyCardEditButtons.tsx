import { Property } from "../../types/types";
import { FlexRow } from "../styled/layout";
import { DeleteOutlined } from "@ant-design/icons";
import { SecondaryButton } from "../styled/styled";
import styled from "@emotion/styled";
import { MyTheme } from "../styled/theme";

interface PropertyCardEditButtonsProps {
  property: Property;
  authedUserId: string;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  handleRequestNoteUpdate: () => void;
  noteCount: number;
}

export const PropertyCardEditButtons = ({
  property: { user_id },
  authedUserId,
  handleRequestUpdate,
  handleRequestDelete,
  handleRequestNoteUpdate,
  noteCount,
}: PropertyCardEditButtonsProps) => {
  return (
    <FlexRow gap="8px" style={{ alignItems: "center" }}>
      {authedUserId === user_id && (
        <div style={{ fontSize: "0.6em" }}>Added by You</div>
      )}

      <SecondaryButton
        style={{ position: "relative" }}
        size="micro"
        onClick={handleRequestNoteUpdate}
      >
        Notes
        {noteCount > 0 && <NoteCountBadge>{noteCount}</NoteCountBadge>}
      </SecondaryButton>

      {authedUserId === user_id && (
        <SecondaryButton size="micro" onClick={handleRequestUpdate}>
          Edit
        </SecondaryButton>
      )}

      {authedUserId === user_id && (
        <DeleteOutlined
          key="delete"
          style={{ fontSize: "20px", color: "#744040" }}
          twoToneColor="#822929"
          onClick={handleRequestDelete}
        />
      )}
    </FlexRow>
  );
};

const NoteCountBadge = styled.span`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${MyTheme.colors.linkText};
  top: -7px;
  left: -4px;
  padding: 5px;
  text-align: center;
  border-radius: 50%;
  font-size: 0.85em;
  height: 15px;
  color: ${MyTheme.colors.primary};
`;
