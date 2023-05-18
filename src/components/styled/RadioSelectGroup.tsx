import styled from "@emotion/styled";
import { MyTheme } from "./theme";

interface RadioSelectGroupProps {
  options: RadioSelectGroupOption[];
  groupName: string;
  selectedValue: any;
  onChange: (value: string) => void;
}

interface RadioSelectGroupOption {
  label: string;
  value: string | number;
}

export const RadioSelectGroup = ({
  options,
  groupName,
  selectedValue,
  onChange,
}: RadioSelectGroupProps) => {
  return (
    <RadioGroupContainer>
      {options.map(({ label, value }) => (
        <RadioButton
          key={value}
          label={label}
          value={value}
          checked={selectedValue === value}
          name={groupName}
          onChange={(e) => onChange(e.target.value)}
        />
      ))}
    </RadioGroupContainer>
  );
};

interface RadioButtonProps {
  label: string;
  value: any;
  checked: boolean;
  name: string;
  onChange: (value: any) => void;
}

const RadioButton = ({
  label,
  value,
  checked,
  name,
  onChange,
}: RadioButtonProps) => {
  return (
    <StyledLabel>
      <HiddenInput
        type="radio"
        name={name}
        id={label}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <CustomRadioButton checked={checked}>{label}</CustomRadioButton>
    </StyledLabel>
  );
};

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px;
  border-radius: 8px;
  background: ${MyTheme.colors.cardBackground};
`;

const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const HiddenInput = styled.input`
  appearance: none;
  position: relative;
  opacity: 0;
`;

interface CustomRadioButtonProps {
  checked: boolean;
}

const CustomRadioButton = styled.div<CustomRadioButtonProps>`
  margin: 1px;
  border-radius: 5px;
  background: ${(p) =>
    p.checked ? MyTheme.colors.primary : MyTheme.colors.cardBackground};
  box-shadow: ${(p) =>
    p.checked ? " rgba(0, 0, 0, 0.24) 0px 3px 8px" : "none"};
  padding: 3px 6px;
  color: ${(p) =>
    p.checked ? MyTheme.colors.secondary : MyTheme.colors.primary};
  transition: all 0.3s ease;
  font-size: 0.8em;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
`;
