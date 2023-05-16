import React from "react";
import { Property } from "../../types/types";
import { useFormState } from "../useFormState";
import { createProperty } from "../../common/supabase";
import {
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../../common/propertyUtils";
import PropertyFieldsForm from "./PropertyFieldsForm";
import { convertToTitleCase } from "../../common/utils";
import { MessageInstance } from "antd/es/message/interface";

interface AddNewPropertyProps {
  onSaveProperty: (created?: Property) => void;
  onCancel: () => void;
  messageApi: MessageInstance;
  activeProjectId: number;
}

function AddNewProperty({
  onSaveProperty,
  onCancel,
  messageApi,
  activeProjectId,
}: AddNewPropertyProps) {
  const { formState, checkErrors, getObjectData } = useFormState<Property>([
    ...propertyFieldDefs.stringFields
      .concat(propertyFieldDefs.numberFields)
      .concat(propertyFieldDefs.boolFields)
      .map((k) => ({
        key: k,
        value: null,
        label: convertToTitleCase(k),
        validator: propertyNumberInputConfig[k]?.validator,
      })),
    ...propertyFieldDefs.qualityEnumFields.map((k) => ({
      key: k,
      value: "Okay",
      label: convertToTitleCase(k),
      validator: propertyNumberInputConfig[k]?.validator,
    })),
  ]);

  const handleSave = async () => {
    const { data, error } = await createProperty(
      getObjectData(),
      activeProjectId
    );
    if (data && !error) {
      messageApi.success("Property added");
      onSaveProperty(data);
    } else {
      messageApi.error("Something went wrong...");
      console.log(error);
    }
  };

  return (
    <PropertyFieldsForm
      title="Add Property"
      formState={formState}
      handleCancel={onCancel}
      handleSave={handleSave}
      saveBtnDisabled={!Object.values(checkErrors()).every((e) => e === true)}
    />
  );
}

export default AddNewProperty;
