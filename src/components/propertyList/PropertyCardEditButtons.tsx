import { Property } from "../../types/types";
import { FlexRow } from "../styled/layout";
import { DeleteOutlined } from "@ant-design/icons";
import { SecondaryButton } from "../styled/styled";

interface PropertyCardEditButtonsProps {
  property: Property;
  authedUserId: string;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  handleRequestNoteUpdate: () => void;
}

export const PropertyCardEditButtons = ({
  property: { user_id },
  authedUserId,
  handleRequestUpdate,
  handleRequestDelete,
  handleRequestNoteUpdate,
}: PropertyCardEditButtonsProps) => {
  return (
    <FlexRow gap="20px" style={{ alignItems: "center" }}>
      {authedUserId === user_id && (
        <div style={{ fontSize: "0.6em" }}>Added by You</div>
      )}

      {authedUserId === user_id && (
        <SecondaryButton size="micro" onClick={handleRequestNoteUpdate}>
          Notes
        </SecondaryButton>
      )}

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
