import { currencyFormat, numberFormat } from "../../common/utils";
import { MyTheme } from "../styled/theme";
import { Badge } from "@chakra-ui/react";
import { FlexRow } from "../styled/layout";
import { DeviceSize, PropertyScore } from "../../types/types";

export const PropertyCardScoreDisplay = ({
  propertyScore: { cost, points, score, sqMtrCost },
  deviceSize,
}: {
  propertyScore: PropertyScore;
  deviceSize: DeviceSize;
}) => (
  <FlexRow
    gap={deviceSize === "small" ? "6px" : "12px"}
    style={{
      padding: deviceSize === "large" ? 0 : "4px 2px",
    }}
    justifyContent={deviceSize === "small" ? "space-between" : "start"}
  >
    {sqMtrCost && (
      <div>
        <BadgeBuilder label="£/sqmtr" />
        {currencyFormat(sqMtrCost)}
      </div>
    )}

    <div>
      <BadgeBuilder label="30 Yr Cost" />
      {currencyFormat(cost)}
    </div>

    <div>
      <BadgeBuilder label="Points" />
      {numberFormat(points)}
    </div>
    <div
      style={{
        color: MyTheme.colors.primary,
        background: MyTheme.colors.secondary,
        borderRadius: "2px",
        padding: "0px 3px 0px 8px",
      }}
    >
      <BadgeBuilder label=" Points / cost" />
      {numberFormat(score, 3)}
    </div>
  </FlexRow>
);

const BadgeBuilder = ({ label }: { label: string }) => (
  <Badge position="relative" bottom={0.7} left={-1} fontSize="0.5em">
    {label}
  </Badge>
);
