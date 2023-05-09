import { Property } from "../../types/types";
import { FlexRow } from "../styled/layout";
import {
  FileAddTwoTone,
  EditTwoTone,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

interface PropertyCardEditIconsProps {
  property: Property;
  authedUserId: string;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  handleRequestNoteUpdate: () => void;
  isFavourite: boolean;
  handleAddFavourite: (pId: number) => void;
  handleRemoveFavourite: (pId: number) => void;
}

export const PropertyCardEditIcons = ({
  property: { id, user_id },
  authedUserId,
  handleRequestUpdate,
  handleRequestDelete,
  handleRequestNoteUpdate,
  isFavourite,
  handleAddFavourite,
  handleRemoveFavourite,
}: PropertyCardEditIconsProps) => {
  return (
    <FlexRow gap="20px">
      {isFavourite ? (
        <HeartFilled
          style={{ color: "#9e0e69", fontSize: "20px" }}
          onClick={() => handleRemoveFavourite(id)}
        />
      ) : (
        <HeartOutlined
          style={{ color: "#95517c", fontSize: "20px" }}
          onClick={() => handleAddFavourite(id)}
        />
      )}

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
