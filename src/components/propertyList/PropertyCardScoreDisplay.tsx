import { currencyFormat, numberFormat } from "../../common/utils";
import { MyTheme } from "../styled/theme";
import { FlexRow } from "../styled/layout";
import {
  DeviceSize,
  PropertyCommuteScore,
  PropertyScore,
} from "../../types/types";
import styled from "@emotion/styled";
import { useProjectDataStore } from "../../common/stores/projectDataStore";
import {
  commuteAnalysisDestinationKeys,
  totalCommuteTimeToAllDestinations,
} from "../commuteAnalysis/utils";

interface PropertyCardScoreDisplayProps {
  propertyScore: PropertyScore;
  deviceSize: DeviceSize;
  propertyCommuteScore?: PropertyCommuteScore;
}

export const PropertyCardScoreDisplay = ({
  propertyScore: { cost, points, score, sqMtrCost },
  propertyCommuteScore,
  deviceSize,
}: PropertyCardScoreDisplayProps) => {
  const { projectCommuteSetting } = useProjectDataStore();

  const renderCommuteScoreBadges = () => {
    if (propertyCommuteScore && projectCommuteSetting) {
      const numDestinations = projectCommuteSetting
        ? commuteAnalysisDestinationKeys.filter((k) => projectCommuteSetting[k])
            .length
        : 0;

      const totalCommuteTime = totalCommuteTimeToAllDestinations(
        propertyCommuteScore,
        projectCommuteSetting
      );

      return [
        <ScoreContainer>
          <BadgeBuilder label={`Avg / Destination`} />
          <span>{Math.round(totalCommuteTime / numDestinations)} mins</span>
        </ScoreContainer>,
        <ScoreContainer>
          <BadgeBuilder label={`To ${numDestinations} Destinations`} />
          <span>
            {totalCommuteTimeToAllDestinations(
              propertyCommuteScore,
              projectCommuteSetting
            )}{" "}
            mins
          </span>
        </ScoreContainer>,
      ];
    }
  };

  return (
    <FlexRow
      gap={deviceSize === "small" ? "4px" : "8px"}
      style={{
        padding: deviceSize === "large" ? 0 : "4px 2px",
      }}
    >
      {renderCommuteScoreBadges()}

      {sqMtrCost && (
        <ScoreContainer>
          <BadgeBuilder label="£/sqmtr" />
          {currencyFormat(sqMtrCost)}
        </ScoreContainer>
      )}

      <ScoreContainer>
        <BadgeBuilder label="30 Yr Cost" />
        {currencyFormat(cost)}
      </ScoreContainer>

      <ScoreContainer>
        <BadgeBuilder label="Points" />
        {numberFormat(points)}
      </ScoreContainer>
      <ScoreContainer>
        <BadgeBuilder label="Points / cost" />
        {numberFormat(score, 3)}
      </ScoreContainer>
    </FlexRow>
  );
};

const ScoreContainer = styled.div`
  background: ${MyTheme.colors.background};
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.9em;
  span {
    font-size: 1em;
  }
`;

const ScoreBadge = styled.div`
  background: ${MyTheme.colors.cardBackground};
  font-size: 0.5em;
  border-radius: 4px;
  padding: 1px 2px;
`;

const BadgeBuilder = ({ label }: { label: string }) => (
  <ScoreBadge>{label}</ScoreBadge>
);
