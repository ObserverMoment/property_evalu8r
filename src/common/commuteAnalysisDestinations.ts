import dayjs from "dayjs";
// https://github.com/dayjs/dayjs-website/blob/master/docs/plugin/weekday.md
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday);

/// Deprecated - now in DB.
export const destinations = {
  london_victoria_station: "Victoria Station, Victoria Street, London",
  london_waterloo_station: "Waterloo Station, Waterloo Road, London",
  london_bridge_station: "London Bridge, Station Approach Road, London",
  london_bank_station:
    "Bank Station, Underground Ltd, Bank/Monument Complex, Princes Street, London",
  london_oxford_circus_station: "Oxford Circus, Oxford Street, London",
  london_kings_cross_station:
    "Kings’s Cross Railway Station, Euston Road, London",
  london_liverpool_street:
    "Liverpool Street, Liverpool Street Station, Liverpool Street, London",
  london_canary_wharf_station:
    "Canary Wharf, Underground Ltd, Cabot Square, Heron Quays Road, London",
};

// Next Monday at 0900.
export const defaultArrivalTime = () =>
  dayjs().weekday(8).hour(9).minute(0).toDate();
