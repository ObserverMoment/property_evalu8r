import { Database } from "../types/__database.types__";
import { PropertyScores, Property, PropertyScore } from "../types/types";
import { currencyFormat, roundToFixedDecimal } from "./utils";

export const propertyFieldDefs = {
  stringFields: [
    "listing_title",
    "url_link",
    "agent_website",
    "agent_email",
    "agent_phone",
  ],
  textAreaFields: ["notes"],
  numberFields: [
    "house_price",
    "sq_metres",
    "floor_level",
    "walk_to_station",
    "walk_to_park",
    "lease_length",
    "sc_gr_annual",
    "energy_effeciency",
    "est_monthly_rent",
  ],
  qualityEnumFields: ["interior", "view"],
  boolFields: [
    "garden_balcony",
    "local_gym",
    "local_supermarket",
    "off_street_parking",
  ],
};

interface PropertyNumberInputConfigObject {
  [key: string]: {
    min?: number;
    max?: number;
    prefix?: string;
    suffix?: string;
    validator?: (v: any) => boolean;
    validatorMessage?: string;
    displayFormat: (x: number) => string;
    decimalPrecision: number;
  };
}

export const propertyNumberInputConfig: PropertyNumberInputConfigObject = {
  house_price: {
    min: 0,
    prefix: "£",
    displayFormat: (x: number) => currencyFormat(x),
    decimalPrecision: 0,
  },
  floor_level: {
    min: 0,
    displayFormat: (x: number) => x.toString(),
    decimalPrecision: 0,
  },
  walk_to_station: {
    min: 0,
    suffix: "mins",
    displayFormat: (x: number) => x.toString(),
    decimalPrecision: 0,
  },
  walk_to_park: {
    min: 0,
    suffix: "mins",
    displayFormat: (x: number) => x.toString(),
    decimalPrecision: 0,
  },
  lease_length: {
    min: 0,
    suffix: "years",
    displayFormat: (x: number) => x.toString(),
    decimalPrecision: 0,
  },
  energy_effeciency: {
    min: 0,
    max: 100,
    suffix: "(0-100)",
    validator: (v: number) => v >= 0 && v <= 100,
    validatorMessage: "Range is 0 to 100",
    displayFormat: (x: number) => x.toString(),
    decimalPrecision: 0,
  },
  sc_gr_annual: {
    min: 0,
    prefix: "£",
    displayFormat: (x: number) => currencyFormat(x),
    decimalPrecision: 0,
  },
  sq_metres: {
    min: 0,
    suffix: "sq mtr",
    displayFormat: (x: number) => x.toString(),
    decimalPrecision: 1,
  },
  est_monthly_rent: {
    min: 0,
    prefix: "£",
    displayFormat: (x: number) => currencyFormat(x),
    decimalPrecision: 0,
  },
};

interface ScoreAlgorithmCalculationConfig {
  [key: string]: {
    inputToNumberConverter: (x: any) => number;
    formula: (input: number, weight: number) => number;
  };
}

export const scoreAlgorithmCalculationConfig: ScoreAlgorithmCalculationConfig =
  {
    house_price: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => x * w,
    },
    sc_gr_annual: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => x * w,
    },
    floor_level: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => Math.min(x, 6) * w,
    },
    // Each minute over 10 minutes affects score by [-weight], under 10 minutes [+weight]
    walk_to_station: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => (x - 10) * w,
    },
    // Each minute over 15 minutes affects score by [-weight],  under 15 minutes [+weight]
    walk_to_park: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => (x - 15) * w,
    },
    // Anything under 125 will reduce score, anything above will increase it up to a max of [max]
    lease_length: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => Math.min(x - 125, 25) * w,
    },
    // Anything below 70 will reduce score, anything above will increase it.
    energy_effeciency: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => (x - 70) * w,
    },
    sq_metres: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => x * w,
    },
    interior: {
      inputToNumberConverter: (
        x: Database["public"]["Enums"]["quality_assessment_enum"]
      ) =>
        ({
          Awful: -2,
          Bad: -1,
          Okay: 0,
          Good: 1,
          Great: 2,
        }[x]),
      formula: (x, w) => x * w,
    },
    view: {
      inputToNumberConverter: (
        x: Database["public"]["Enums"]["quality_assessment_enum"]
      ) =>
        ({
          Awful: -2,
          Bad: -1,
          Okay: 0,
          Good: 1,
          Great: 2,
        }[x]),
      formula: (x, w) => x * w,
    },
    local_gym: {
      inputToNumberConverter: (x: boolean) => (x ? 0 : -1),
      formula: (x, w) => x * w,
    },
    local_supermarket: {
      inputToNumberConverter: (x: boolean) => (x ? 0 : -1),
      formula: (x, w) => x * w,
    },
    garden_balcony: {
      inputToNumberConverter: (x: boolean) => (x ? 1 : 0),
      formula: (x, w) => x * w,
    },
    off_street_parking: {
      inputToNumberConverter: (x: boolean) => (x ? 1 : 0),
      formula: (x, w) => x * w,
    },
  };

interface ScoreAlgorithmCalculationWeights {
  [key: string]: number;
}

export const scoreAlgorithmCalculationWeights: ScoreAlgorithmCalculationWeights =
  {
    // Number
    house_price: 1, // 'Initial Cost'
    sc_gr_annual: 30, // '30 years of ongoing Cost'
    floor_level: 5000,
    walk_to_station: -1000,
    walk_to_park: -500,
    lease_length: 1000,
    energy_effeciency: 1000,
    sq_metres: 8000,
    // Quality Enum
    interior: 10000,
    view: 12000,
    // Bool. All weights are positive so control the sign of output via [inputToNumberConverter]
    local_gym: 10000,
    local_supermarket: 10000,
    garden_balcony: 15000,
    off_street_parking: 10000,
  };

export const calculatePropertyScore = (property: Property): PropertyScore => {
  const inputKeys = Object.keys(scoreAlgorithmCalculationConfig);
  const costKeys = ["house_price", "sc_gr_annual"];
  const pointsKeys = inputKeys.filter((k) => !costKeys.includes(k));

  const cost = costKeys.reduce((acum, nextKey) => {
    const config = scoreAlgorithmCalculationConfig[nextKey];
    const numericScore = config.inputToNumberConverter(property[nextKey]);
    const weight = scoreAlgorithmCalculationWeights[nextKey];
    return acum + config.formula(numericScore, weight);
  }, 0);

  const points = pointsKeys.reduce((acum, nextKey) => {
    const config = scoreAlgorithmCalculationConfig[nextKey];
    const numericScore = config.inputToNumberConverter(property[nextKey]);
    const weight = scoreAlgorithmCalculationWeights[nextKey];
    return acum + config.formula(numericScore, weight);
  }, 0);

  const rentalYield = calculateNetYield(property);

  return {
    propertyId: property.id,
    cost: Math.floor(cost),
    points: Math.floor(points),
    score: points / cost,
    rentalYield,
    sqMtrCost:
      property.house_price && property.sq_metres
        ? Math.floor(property.house_price / property.sq_metres)
        : null,
  };
};

export const calculateAllPropertyScores = (
  properties: Property[]
): PropertyScores =>
  properties.reduce<PropertyScores>((acum, next) => {
    acum[next.id] = calculatePropertyScore(next);
    return acum;
  }, {});

/// All fields except agent details must be not null / undefined / empty string
export const checkPropertyCompleteInfo = (properties: Property[]) =>
  properties.reduce<{
    completed: Property[];
    awaitingInfo: Property[];
  }>(
    (acum, next) => {
      if (
        Object.entries(next).every(
          ([k, v]) =>
            ["agent_website", "agent_phone", "agent_email", "notes"].includes(
              k
            ) ||
            (v !== null && v !== undefined && v !== "")
        )
      ) {
        acum.completed.push(next);
      } else {
        acum.awaitingInfo.push(next);
      }
      return acum;
    },
    { completed: [], awaitingInfo: [] }
  );

//// Yield Calculations ////
/// (12 x monthly rent - yearly service charge and ground rent) / house price
export const calculateNetYield = (property: Property) => {
  const { est_monthly_rent, house_price, sc_gr_annual } = property;
  if (!est_monthly_rent || !house_price || !sc_gr_annual) {
    return null;
  } else {
    return roundToFixedDecimal(
      (12 * est_monthly_rent - sc_gr_annual) / house_price,
      4
    );
  }
};
