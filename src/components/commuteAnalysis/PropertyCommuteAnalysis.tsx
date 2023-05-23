import { DistanceMatrixService, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { defaultArrivalTime } from "../../common/commuteAnalysisDestinations";
import { Spin } from "antd";
import {
  ProjectCommuteSetting,
  Property,
  PropertyCommuteScore,
} from "../../types/types";
import { MyCard, PrimaryButton, SecondaryButton } from "../styled/styled";
import Title from "antd/es/typography/Title";
import { FlexRow } from "../styled/layout";
import { useProjectDataStore } from "../../common/stores/projectDataStore";
import { secondsToMinutes } from "../../common/utils";
import { MyTheme } from "../styled/theme";
import {
  commuteAnalysisDestinationKeys,
  totalCommuteTimeToAllDestinations,
} from "./utils";

interface GenerateCommuteAnalysisProps {
  property: Property;
  propertyCommuteScore?: PropertyCommuteScore;
  projectCommuteSetting: ProjectCommuteSetting | null;
}

export const PropertyCommuteAnalysis = ({
  property,
  propertyCommuteScore,
  projectCommuteSetting,
}: GenerateCommuteAnalysisProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });
  /// Mount DistanceMatrixService to run analysis, unmount once completed.
  const [runAnalysis, setRunAnalysis] = useState<boolean>(false);
  const [scoresResponse, setScoresResponse] =
    useState<PropertyCommuteScore | null>(null);
  const [savedToDB, setSavedToDB] = useState<boolean>(false);
  const [savingToDB, setSavingToDB] = useState<boolean>(false);

  const { api } = useProjectDataStore();

  const handleAPIResponse = (
    apiResponse: google.maps.DistanceMatrixResponse | null
  ) => {
    if (apiResponse) {
      const formattedResponse =
        apiResponse.destinationAddresses.reduce<PropertyCommuteScore>(
          (acum, _, i) => {
            acum[`destination_${i + 1}`] =
              apiResponse.rows.at(0)?.elements[i].duration.value; // value = travel time in seconds
            return acum;
          },
          {} as PropertyCommuteScore
        );

      setScoresResponse(formattedResponse);
      setRunAnalysis(false);
    }
  };

  const handleSavetoDB = async () => {
    if (scoresResponse) {
      setSavingToDB(true);
      // If already exists, run update, otherwise create
      let error;
      if (propertyCommuteScore) {
        error = await api.updatePropertyCommuteScore(property.id, {
          ...scoresResponse,
          id: propertyCommuteScore.id,
        });
      } else {
        error = await api.createPropertyCommuteScore(
          property.id,
          scoresResponse
        );
      }
      if (!error) {
        setSavedToDB(true);
      }
      setSavingToDB(false);
    }
  };

  if (!projectCommuteSetting) {
    return (
      <MyCard>
        Sorry, could not load the commute analysis settings for your current
        project. Please try refreshing the page.
      </MyCard>
    );
  }

  if (!isLoaded) {
    return <Spin size="small" />;
  }

  if (!property.listing_title) {
    return (
      <MyCard>
        The listing title must exist and include location information for this
        to work...
      </MyCard>
    );
  }

  const mostRecentScores = scoresResponse || propertyCommuteScore;

  const totalTimeToAllDestinations = mostRecentScores
    ? totalCommuteTimeToAllDestinations(mostRecentScores, projectCommuteSetting)
    : null;

  return (
    <div>
      <Title level={5}>Commute Analysis</Title>
      <div>
        For <span style={{ fontWeight: "bold" }}>{property.listing_title}</span>
      </div>

      <div
        style={{
          height: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {savedToDB ? (
          <div>Saved to Database!</div>
        ) : runAnalysis || savingToDB ? (
          <Spin size="small" />
        ) : scoresResponse ? (
          <PrimaryButton onClick={handleSavetoDB}>
            Save to Database
          </PrimaryButton>
        ) : (
          <SecondaryButton onClick={() => setRunAnalysis(true)}>
            Run Analysis
          </SecondaryButton>
        )}
      </div>

      {isLoaded && runAnalysis && (
        <DistanceMatrixService
          options={{
            destinations: commuteAnalysisDestinationKeys
              .map((k) => projectCommuteSetting[k])
              .filter((x) => x) as string[],
            transitOptions: {
              arrivalTime: defaultArrivalTime(),
            },
            origins: [property.listing_title],
            travelMode: google.maps.TravelMode.TRANSIT,
          }}
          callback={handleAPIResponse}
        />
      )}

      <div style={{ padding: "6px 0", color: MyTheme.colors.secondary }}>
        Travel Time via Public transit to:
      </div>

      {commuteAnalysisDestinationKeys
        .filter((k) => projectCommuteSetting[k])
        .map((k, i) => (
          <FlexRow
            key={projectCommuteSetting[k]}
            justifyContent="space-between"
          >
            <div>
              {projectCommuteSetting[k]!.substring(
                0,
                projectCommuteSetting[k]!.indexOf(",")
              )}
            </div>
            <div>
              {mostRecentScores
                ? `${secondsToMinutes(mostRecentScores![k])} mins`
                : "Not analysed"}
            </div>
          </FlexRow>
        ))}
      {totalTimeToAllDestinations && (
        <div style={{ padding: "8px 0", fontWeight: "bold" }}>
          Total: {totalTimeToAllDestinations} mins
        </div>
      )}
    </div>
  );
};
