import styled from "@emotion/styled";
import { UserProfile } from "../../types/types";
import { FlexRow } from "../styled/layout";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";

interface PropertyCardLikeDislikeProps {
  authedUserId: string;
  propertyLikes: UserProfile[];
  handleAddPropertyLike: () => void;
  handleRemovePropertyLike: () => void;
}

export const PropertyCardLikeDislike = ({
  authedUserId,
  propertyLikes,
  handleAddPropertyLike,
  handleRemovePropertyLike,
}: PropertyCardLikeDislikeProps) => {
  return (
    <FlexRow alignItems="center">
      {propertyLikes.some((u) => u.id === authedUserId) ? (
        <LikeFilled
          style={{ color: "#079cc5", fontSize: "20px" }}
          onClick={handleRemovePropertyLike}
        />
      ) : (
        <LikeOutlined
          style={{ color: "#1c91d0", fontSize: "20px" }}
          onClick={handleAddPropertyLike}
        />
      )}

      {propertyLikes.length > 0 && (
        <LikesDislikesCountDisplay>
          <div>
            {propertyLikes.length}
            {propertyLikes.length === 1 ? " like" : " likes"}
          </div>
          <FlexRow>
            {propertyLikes.map((u, i) => (
              <span key={u.id}>
                {u.username}
                {propertyLikes.length - 1 === i ? "" : ", "}
              </span>
            ))}
          </FlexRow>
        </LikesDislikesCountDisplay>
      )}
    </FlexRow>
  );
};

const LikesDislikesCountDisplay = styled.div`
  font-size: 10px;
  padding-left: 4px;
  * {
    font-size: 10px;
  }
`;
