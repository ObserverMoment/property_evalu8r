import { Database } from "../types/__database.types__";
import { Property } from "../types/types";

export const propertyFieldDefs = {
  stringFields: ["url_link", "agent_website", "agent_email", "agent_phone"],
  numberFields: [
    "house_price",
    "floor_level",
    "walk_to_station",
    "lease_length",
    "energy_effeciency",
    "est_month_rent",
    "sc_gr_annual",
    "sq_metres",
  ],
  qualityEnumFields: ["interior", "view"],
  boolFields: [
    "cladding_cert",
    "electrics_cert",
    "local_gym",
    "local_supermarket",
    "garden_balcony",
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
    algorithm: (x: number) => number;
  };
}

export const propertyNumberInputConfig: PropertyNumberInputConfigObject = {
  house_price: {
    min: 0,
    prefix: "£",
    algorithm: (x) => x * -1,
  },
  floor_level: {
    min: 0,
    algorithm: (x) => x * 2000,
  },
  walk_to_station: {
    min: 0,
    suffix: "mins",
    algorithm: (x) => x * -1000,
  },
  lease_length: {
    min: 0,
    suffix: "years",
    algorithm: (x) => (x - 125) * 1000,
  },
  energy_effeciency: {
    min: 0,
    max: 100,
    suffix: "0 - 100",
    validator: (v: number) => v >= 0 && v <= 100,
    validatorMessage: "Range is 0 to 100",
    algorithm: (x) => (x - 70) * 1000,
  },
  est_month_rent: { min: 0, prefix: "£", algorithm: (x) => x * 30 },
  sc_gr_annual: { min: 0, prefix: "£", algorithm: (x) => x * -30 },
  sq_metres: { min: 0, suffix: "sq mtr", algorithm: (x) => x * 9000 },
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
    floor_level: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => Math.min(x, 6) * w,
    },
    // Each minute over 9 minutes affects score by [-weight]
    walk_to_station: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => (x - 9) * w,
    },
    // Anything under 125 will reduce score, anything above will increase it up to a max of [max]
    lease_length: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => Math.min(x - 125, 160) * w,
    },
    // Anything below 70 will reduce score, anything above will increase it.
    energy_effeciency: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => (x - 70) * w,
    },
    sc_gr_annual: {
      inputToNumberConverter: (x: number) => x,
      formula: (x, w) => x * w,
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
    cladding_cert: {
      inputToNumberConverter: (x: boolean) => (x ? 0 : -1),
      formula: (x, w) => x * w,
    },
    electrics_cert: {
      inputToNumberConverter: (x: boolean) => (x ? 0 : -1),
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
  };

interface ScoreAlgorithmCalculationWeights {
  [key: string]: number;
}

export const scoreAlgorithmCalculationWeights: ScoreAlgorithmCalculationWeights =
  {
    // Number
    house_price: -1, // 'Cost'
    sc_gr_annual: -30, // 'Cost'
    floor_level: 2000,
    walk_to_station: -1000,
    lease_length: 1000,
    energy_effeciency: 1000,
    sq_metres: 9000,
    // Quality Enum
    interior: 10000,
    view: 10000,
    // Bool - all weights are positive so control the sign of output via [inputToNumberConverter]
    cladding_cert: 10000,
    electrics_cert: 5000,
    local_gym: 10000,
    local_supermarket: 10000,
    garden_balcony: 10000,
  };

export interface PropertyScore {
  propertyId: number;
  cost: number;
  points: number;
  score: number; // points - cost
}

export interface PropertScoresResult {
  [key: number]: PropertyScore;
}

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

  return { propertyId: property.id, cost, points, score: points + cost };
};

export const calculateAllPropertyScores = (
  properties: Property[]
): PropertScoresResult =>
  properties.reduce<PropertScoresResult>((acum, next) => {
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
            ["agent_website", "agent_phone", "agent_email"].includes(k) ||
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
