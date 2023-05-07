import { Form, Input, InputNumber, Radio, Space, Typography } from "antd";
import {
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../common/propertyUtils";
import { Property } from "../types/types";
import { FormState } from "./useFormState";
import { PropsWithChildren } from "react";
import { FlexRow, MySpacer } from "../components/styled/layout";
import { PrimaryButton, SecondaryButton } from "../components/styled/styled";

const { Text, Title } = Typography;

interface PropertyFieldsFormProps {
  title: string;
  formState: FormState<Property>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  saveBtnDisabled: boolean;
}

function PropertyFieldsForm({
  title,
  formState,
  handleSave,
  handleCancel,
  saveBtnDisabled,
}: PropertyFieldsFormProps) {
  const enumOptions = [
    { label: "Awful", value: "Awful" },
    { label: "Bad", value: "Bad" },
    { label: "Okay", value: "Okay" },
    { label: "Good", value: "Good" },
    { label: "Great", value: "Great" },
  ];

  const boolOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <Form onFinish={handleSave}>
      <FlexRow justifyContent="space-between" style={{ paddingBottom: "10px" }}>
        <Title level={5}>{title}</Title>
        <Space>
          <SecondaryButton type="button" size="sm" onClick={handleCancel}>
            Cancel
          </SecondaryButton>
          <PrimaryButton size="sm" type="submit" disabled={saveBtnDisabled}>
            Submit
          </PrimaryButton>
        </Space>
      </FlexRow>
      <MySpacer height={8} />
      {propertyFieldDefs.stringFields.map((k) => (
        <MyFormItem key={k} formState={formState} fieldKey={k}>
          <Input
            placeholder={formState[k].label}
            onChange={(e) => formState[k].setValue(e.target.value)}
            value={formState[k].value}
          />
        </MyFormItem>
      ))}

      {propertyFieldDefs.numberFields.map((k) => {
        const hasError =
          !!formState[k].value &&
          !!formState[k].validator &&
          !formState[k].validator!(formState[k].value);

        const fieldConfig = propertyNumberInputConfig[k];

        return (
          <MyFormItem
            key={k}
            formState={formState}
            fieldKey={k}
            hasError={hasError}
          >
            <InputNumber
              min={fieldConfig.min}
              max={fieldConfig.max}
              addonBefore={fieldConfig.prefix}
              addonAfter={fieldConfig.suffix}
              placeholder={fieldConfig.validatorMessage || "999"}
              onChange={(e) => formState[k].setValue(e)}
              value={formState[k].value}
            />
          </MyFormItem>
        );
      })}

      {propertyFieldDefs.qualityEnumFields.map((k) => (
        <MyFormItem key={k} formState={formState} fieldKey={k}>
          <Radio.Group
            options={enumOptions}
            onChange={(e) => formState[k].setValue(e.target.value)}
            value={formState[k].value}
            optionType="button"
            size="small"
          />
        </MyFormItem>
      ))}

      {propertyFieldDefs.boolFields.map((k) => (
        <MyFormItem key={k} formState={formState} fieldKey={k}>
          <Radio.Group
            options={boolOptions}
            onChange={(e) => formState[k].setValue(e.target.value)}
            value={formState[k].value}
            optionType="button"
            size="small"
          />
        </MyFormItem>
      ))}
    </Form>
  );
}

interface MyFormItemProps {
  fieldKey: string;
  formState: FormState<Property>;
  hasError?: boolean;
}

const MyFormItem = ({
  fieldKey,
  formState,
  hasError = false,
  children,
}: PropsWithChildren<MyFormItemProps>) => (
  <Form.Item
    key={fieldKey}
    style={{ marginBottom: "14px" }}
    label={
      <Text style={{ fontSize: "0.75em" }}>{formState[fieldKey].label}</Text>
    }
    validateStatus={hasError ? "error" : undefined}
  >
    {children}
  </Form.Item>
);

export default PropertyFieldsForm;
