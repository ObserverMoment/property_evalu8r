import React from "react";
import { Property } from "../../types/types";
import { useFormState } from "../useFormState";
import {
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../../common/propertyUtils";
import PropertyFieldsForm from "./PropertyFieldsForm";
import { convertToTitleCase } from "../../common/utils";
import { MessageInstance } from "antd/es/message/interface";
import { useProjectDataStore } from "../../common/stores/projectDataStore";

interface AddNewPropertyProps {
  onComplete: () => void;
  messageApi: MessageInstance;
  activeProjectId: number;
}

function AddNewProperty({ onComplete, activeProjectId }: AddNewPropertyProps) {
  const { api } = useProjectDataStore();

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
    const error = await api.createProperty(getObjectData(), activeProjectId);
    if (!error) {
      onComplete();
    }
  };

  return (
    <PropertyFieldsForm
      title="Add Property"
      formState={formState}
      handleCancel={onComplete}
      handleSave={handleSave}
      saveBtnDisabled={!Object.values(checkErrors()).every((e) => e === true)}
    />
  );
}

export default AddNewProperty;
