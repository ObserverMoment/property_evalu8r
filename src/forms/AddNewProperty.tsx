import React from "react";
import { Property } from "../types/types";
import { useFormState } from "./useFormState";
import { createProperty } from "../common/supabase";
import {
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../common/propertyUtils";
import PropertyFieldsForm from "./PropertyFieldsForm";
import { convertToTitleCase } from "../common/utils";
import { MessageInstance } from "antd/es/message/interface";

function AddNewProperty({
  closeDrawer,
  messageApi,
}: {
  closeDrawer: (created?: Property) => void;
  messageApi: MessageInstance;
}) {
  const { formState, checkErrors, getObjectData } = useFormState<Property>(
    [
      ...propertyFieldDefs.stringFields,
      ...propertyFieldDefs.numberFields,
      ...propertyFieldDefs.boolFields,
      ...propertyFieldDefs.qualityEnumFields,
    ].map((k) => ({
      key: k,
      value: null,
      label: convertToTitleCase(k),
      validator: propertyNumberInputConfig[k]?.validator,
    }))
  );

  const handleCancel = () => closeDrawer();

  const handleSave = async () => {
    const { data, error } = await createProperty(getObjectData());
    if (data !== null && data.length && !error) {
      messageApi.success("Property added");
      closeDrawer(data.at(0));
    } else {
      messageApi.error("Something went wrong...");
      console.log(error);
    }
  };

  return (
    <PropertyFieldsForm
      title="Add Property"
      formState={formState}
      handleCancel={handleCancel}
      handleSave={handleSave}
      saveBtnDisabled={!Object.values(checkErrors()).every((e) => e === true)}
    />
  );
}

export default AddNewProperty;
