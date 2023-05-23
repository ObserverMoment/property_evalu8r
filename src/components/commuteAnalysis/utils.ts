import { ProjectCommuteSetting, PropertyCommuteScore } from "../../types/types";

/// In project_commute_setting and property_commute_score these are the keys that represent the 8 destinations selected by the user.
export const commuteAnalysisDestinationKeys = [
  "destination_1",
  "destination_2",
  "destination_3",
  "destination_4",
  "destination_5",
  "destination_6",
  "destination_7",
  "destination_8",
];

// Converts into minutes (raw data is in seconds)
export const totalCommuteTimeToAllDestinations = (
  propertyCommuteScore: PropertyCommuteScore,
  projectCommuteSetting: ProjectCommuteSetting
) => {
  return Math.round(
    commuteAnalysisDestinationKeys
      .filter((k) => projectCommuteSetting[k])
      .reduce((acum, key) => (acum += propertyCommuteScore[key]), 0) / 60
  );
};
