import React from "react";
import { CreateProperty, Property } from "../types/types";
import { useFormState, FormField } from "./useFormState";
import { Button, Input, Space, Switch } from "antd";
import {
  FlexRow,
  FormInputBox,
  FormInputLabel,
  Spacer,
} from "../common/styled";
import { createProperty } from "../common/supabase";

export default ({
  closeDrawer,
}: {
  closeDrawer: (created?: Property) => void;
}) => {
  const { formState, formDirty, checkErrors, getObjectData } =
    useFormState<CreateProperty>(initPropertyFormState);

  const handleCancel = () => {
    if (formDirty()) {
      console.log("TODO: are you sure...");
      closeDrawer();
    } else {
      closeDrawer();
    }
  };

  const handleSave = async () => {
    if (Object.values(checkErrors()).every((e) => e)) {
      const { data, error } = await createProperty(getObjectData());
      if (data !== null && data.length && !error) {
        closeDrawer(data.at(0));
      } else {
        console.log("There was an error");
      }
    } else {
      console.log("you need to enter some more info");
      console.log("TODO: highlight the invalid fields");
    }
  };

  return (
    <div>
      <FlexRow justifyContent="space-between">
        <h3>Add Property</h3>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleSave}
            type="primary"
            disabled={!Object.values(checkErrors()).every((e) => e === true)}
          >
            Submit
          </Button>
        </Space>
      </FlexRow>

      {stringInputs.map((i) => (
        <FormInputBox key={formState[i].key}>
          <InputLabel inputKey={formState[i].key} label={formState[i].label} />
          <Input
            placeholder="Url link"
            onChange={(e) => formState[i].setValue(e.target.value)}
            value={formState[i].value}
          />
        </FormInputBox>
      ))}

      {numberInputs.map((i) => (
        <FormInputBox key={formState[i].key}>
          <InputLabel inputKey={formState[i].key} label={formState[i].label} />
          <Input
            placeholder="999"
            onChange={(e) =>
              formState[i].setValue(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            value={formState[i].value}
          />
        </FormInputBox>
      ))}

      {boolInputs.map((i) => (
        <FlexRow
          key={formState[i].key}
          justifyContent="space-between"
          style={{ padding: "5px" }}
        >
          <InputLabel inputKey={formState[i].key} label={formState[i].label} />
          <Switch
            defaultChecked={false}
            onChange={formState[i].setValue}
            checked={formState[i].value}
          />
        </FlexRow>
      ))}
    </div>
  );
};

const InputLabel = ({
  inputKey,
  label,
}: {
  inputKey: string;
  label?: string;
}): JSX.Element => (
  <>
    <FormInputLabel>
      <div>{inputKey}</div>
      <div style={{ fontSize: "0.8em" }}>{label}</div>
    </FormInputLabel>
    <Spacer height={8} />
  </>
);

const stringInputs = ["url_link"];
const numberInputs = [
  "house_price",
  "floor_level",
  "interior",
  "lease_length",
  "energy_effeciency",
  "est_month_rent",
  "sc_gr_annual",
  "sq_metres",
  "view",
];
const boolInputs = [
  "cladding_cert",
  "electrics_cert",
  "local_gym",
  "local_supermarket",
  "garden_balcony",
  "contacted_agent",
];

const initPropertyFormState = [
  {
    key: "url_link",
    value: null,
    validator: (x: string) => typeof x === "string",
  },
  {
    key: "contacted_agent",
    value: false,
  },
  {
    key: "cladding_cert",
    value: false,
  },
  {
    key: "electrics_cert",
    value: false,
  },
  {
    key: "local_gym",
    value: false,
  },
  {
    key: "local_supermarket",
    value: false,
  },
  {
    key: "garden_balcony",
    value: false,
  },
  {
    key: "house_price",
    value: null,
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "energy_effeciency",
    value: null,
    label: "Input Range: -2 to 2",
    validator: (x: number) => typeof x === "number" && x >= -2 && x <= 2,
  },
  {
    key: "est_month_rent",
    value: null,
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "floor_level",
    value: null,
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "interior",
    value: null,
    label: "Input Range: -2 to 2",
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "lease_length",
    value: null,
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "sc_gr_annual",
    value: null,
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "sq_metres",
    value: null,
    validator: (x: number) => typeof x === "number",
  },
  {
    key: "view",
    value: null,
    label: "Input Range: -2 to 2",
    validator: (x: number) => typeof x === "number",
  },
];
