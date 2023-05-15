import React from "react";
import { Property } from "../../types/types";
import { useFormState } from "../useFormState";
import { updateProperty } from "../../common/supabase";
import { propertyFieldDefs } from "../../common/propertyUtils";
import PropertyFieldsForm from "./PropertyFieldsForm";
import { convertToTitleCase } from "../../common/utils";
import { MessageInstance } from "antd/es/message/interface";

function UpdateProperty({
  property,
  closeDrawer,
  messageApi,
}: {
  property: Property;
  closeDrawer: (updated?: Property) => void;
  messageApi: MessageInstance;
}) {
  const { formState, checkErrors, getObjectData, resetFormState } =
    useFormState<Property>([
      ...propertyFieldDefs.stringFields.map((k) => ({
        key: k,
        value: property[k],
        label: convertToTitleCase(k),
      })),
      ...propertyFieldDefs.qualityEnumFields.map((k) => ({
        key: k,
        value: property[k],
        label: convertToTitleCase(k),
      })),
      ...propertyFieldDefs.numberFields.map((k) => ({
        key: k,
        value: property[k],
        label: convertToTitleCase(k),
      })),
      ...propertyFieldDefs.boolFields.map((k) => ({
        key: k,
        value: property[k],
        label: convertToTitleCase(k),
      })),
    ]);

  const handleSave = async () => {
    const { data, error } = await updateProperty({
      ...property,
      ...getObjectData(),
    });
    if (data && !error) {
      messageApi.success("Property updated");
      resetFormState();
      closeDrawer(data);
    } else {
      messageApi.error("Something went wrong...");
      console.log(error);
    }
  };

  return (
    <PropertyFieldsForm
      title="Update Property"
      formState={formState}
      handleCancel={closeDrawer}
      handleSave={handleSave}
      saveBtnDisabled={!Object.values(checkErrors()).every((e) => e === true)}
    />
  );
}

export default UpdateProperty;
