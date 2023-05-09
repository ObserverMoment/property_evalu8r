import {
  propertyFieldDefs,
  propertyNumberInputConfig,
} from "../../common/propertyUtils";
import { FlexRow } from "../styled/layout";
import { convertToTitleCase } from "../../common/utils";
import { Property } from "../../types/types";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import styled from "@emotion/styled";

export const PropertyCardFieldsDisplay = ({
  property,
}: {
  property: Property;
}) => (
  <FlexRow>
    {propertyFieldDefs.numberFields.map((k) => (
      <PropertyFieldDisplayCard key={k}>
        <PropertyFieldTitle>{convertToTitleCase(k)}</PropertyFieldTitle>

        <div>
          <PropertyFieldNumber>
            {property[k]
              ? propertyNumberInputConfig[k].displayFormat(property[k])
              : "..."}
          </PropertyFieldNumber>

          {propertyNumberInputConfig[k].suffix && (
            <div
              style={{
                paddingLeft: "1px",
                fontSize: "0.6em",
              }}
            >
              {propertyNumberInputConfig[k].suffix}
            </div>
          )}
        </div>
      </PropertyFieldDisplayCard>
    ))}

    {propertyFieldDefs.qualityEnumFields.map((k) => (
      <PropertyFieldDisplayCard key={k}>
        <PropertyFieldTitle>{convertToTitleCase(k)}</PropertyFieldTitle>
        <PropertyFieldEnum>{property[k]}</PropertyFieldEnum>
      </PropertyFieldDisplayCard>
    ))}

    {propertyFieldDefs.boolFields.map((k) => (
      <PropertyFieldDisplayCard>
        <PropertyFieldTitle>{convertToTitleCase(k)}</PropertyFieldTitle>
        <div>
          <BooleanValueDisplay input={property[k]} />
        </div>
      </PropertyFieldDisplayCard>
    ))}
  </FlexRow>
);

const PropertyFieldDisplayCard = styled.div`
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 1px 3px;
  margin: 2px;
  padding: 4px;
  flex-grow: 1;
`;

const PropertyFieldTitle = styled.div`
  font-size: 0.75em;
  color: #2e2e2e;
`;

const PropertyFieldNumber = styled.div`
  font-size: 0.75em;
  font-weight: bold;
`;

const PropertyFieldEnum = styled.div`
  font-size: 0.75em;
  font-weight: bold;
`;

const BooleanValueDisplay = ({ input }: { input: boolean | null }) => {
  return input === true ? (
    <CheckCircleTwoTone twoToneColor="#06c582" />
  ) : input === false ? (
    <CloseCircleTwoTone twoToneColor="#d90832" />
  ) : (
    <QuestionCircleTwoTone twoToneColor="#d4d4d4" />
  );
};
