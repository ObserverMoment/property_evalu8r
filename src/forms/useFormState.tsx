import { useState } from "react";

/// Data for a single form field within the form.
export interface FormField<Property> {
  key: string;
  value: Property;
  label?: string;
  isDirty?: boolean;
  validator?: (value: Property) => boolean | string;
  setValue: (value: Property) => void;
}

/// Form state is an object
/// Keys must exist in [StateObjectType]
/// Values are [FormField] objects of type [Property]
export type FormState<StateObjectType> = {
  [Property in keyof StateObjectType]: FormField<StateObjectType[Property]>;
};

/// User should pass a FieldDef for each FormField they wish to include in the form state.
export interface FieldDef {
  key: string;
  value?: any;
  label?: string;
  isDirty?: boolean;
  validator?: (value: any) => boolean | string;
}

type FormErrors<StateObjectType> = {
  [Property in keyof StateObjectType]: boolean | string;
};

interface FormStateResponse<StateObjectType> {
  formState: FormState<StateObjectType>;
  getObjectData: () => StateObjectType;
  formDirty: () => boolean;
  checkErrors: () => FormErrors<StateObjectType>;
}

export function useFormState<StateObjectType extends Record<string, any>>(
  fieldDefs: Array<FieldDef>
): FormStateResponse<StateObjectType> {
  const [formState, setFormState] = useState<StateObjectType>(
    fieldDefs.reduce<StateObjectType>((acum, next) => {
      (acum as Record<string, any>)[next.key] = {
        key: next.key,
        value: next.value,
        label: next.label,
        isDirty: next.isDirty || false,
        validator: next.validator,
        setValue: (newValue: any) =>
          setFormState((prev) => ({
            ...prev,
            [next.key]: {
              ...prev[next.key],
              value: newValue,
              isDirty: true,
            },
          })),
      };
      return acum;
    }, {} as StateObjectType)
  );

  // Returns just key value pairs that an api would want.
  function getObjectData(): StateObjectType {
    return Object.keys(formState).reduce((acum, key) => {
      (acum as Record<string, any>)[key] = formState[key].value;
      return acum;
    }, {} as StateObjectType);
  }

  function formDirty(): boolean {
    return Object.keys(formState).some((key) => formState[key].isDirty);
  }

  function checkErrors(): FormErrors<StateObjectType> {
    return Object.keys(formState).reduce((acum, key) => {
      const validator = formState[key].validator;
      const value = formState[key].value;
      (acum as Record<string, any>)[key] = !!validator
        ? validator(value)
        : true;
      return acum;
    }, {} as FormErrors<StateObjectType>);
  }

  return {
    formState,
    getObjectData,
    formDirty,
    checkErrors,
  };
}
