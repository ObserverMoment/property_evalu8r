import { DistanceMatrixService, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { defaultArrivalTime } from "../../common/commuteAnalysisDestinations";
import { Spin } from "antd";

interface GenerateCommuteAnalysisProps {
  propertyAddress: string;
  propertyId: string;
}

export const GenerateCommuteAnalysis = ({
  propertyAddress,
  propertyId,
}: GenerateCommuteAnalysisProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });
  const [response, setResponse] =
    useState<google.maps.DistanceMatrixResponse | null>(null);

  if (!isLoaded) {
    return <Spin size="small" />;
  }

  return (
    <div>
      {isLoaded && (
        <DistanceMatrixService
          options={{
            destinations: ["London Victoria Station", "E35GG"],
            transitOptions: {
              arrivalTime: defaultArrivalTime(),
            },
            origins: ["E35GG"],
            travelMode: google.maps.TravelMode.TRANSIT,
          }}
          callback={(response) => {
            console.log(response);
            setResponse(response);
          }}
        />
      )}

      {response && (
        <div>
          {response.rows.at(0)?.elements.map((r) => (
            <div>{r.duration.text}</div>
          ))}
        </div>
      )}
      {response && <div>Save to Database</div>}
    </div>
  );
};
