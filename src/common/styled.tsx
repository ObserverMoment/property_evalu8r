import styled from "@emotion/styled";

type FlexRowProps = {
  justifyContent?: string;
};

export const FlexRow = styled.div<FlexRowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: ${(p) => p.justifyContent};
  align-items: center;
`;

export const FormInputBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0;
`;

type SpacerProps = {
  height?: number;
  width?: number;
};

export const Spacer = styled.div<SpacerProps>`
  height: ${(p) => (p.height ? `${p.height}px` : "0")};
  width: ${(p) => (p.width ? `${p.width}px` : "0")};
`;

export const FormInputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75em;
`;
