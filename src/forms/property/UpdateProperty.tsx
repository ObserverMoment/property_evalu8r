import React from "react";
import { Property } from "../../types/types";
import { useFormState } from "../useFormState";
import { propertyFieldDefs } from "../../common/propertyUtils";
import PropertyFieldsForm from "./PropertyFieldsForm";
import { convertToTitleCase } from "../../common/utils";
import { usePropertiesStore } from "../../common/stores/propertiesStore";

function UpdateProperty({
  property,
  closeDrawer,
}: {
  property: Property;
  closeDrawer: (updated?: Property) => void;
}) {
  const { api } = usePropertiesStore();

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
    const error = await api.updateProperty({
      ...property,
      ...getObjectData(),
    });
    if (!error) {
      resetFormState();
      closeDrawer();
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
