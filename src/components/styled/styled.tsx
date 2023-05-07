import styled from "@emotion/styled";
import { MyTheme } from "./theme";

//// Typography
export const Header1 = styled.h1`
  font-size: 1.8em;
  padding: 0;
  margin: 0;
  font-weight: 200;
`;

//// Buttons
const getButtonPadding = (size: "sm" | "md" | "lg" | undefined) =>
  size
    ? {
        sm: "0.5rem 2rem",
        md: "0.7rem 2.9rem",
        lg: "1rem 3.2rem",
      }[size]
    : "0.7rem 2.9rem";

const getButtonFontSize = (size: "sm" | "md" | "lg" | undefined) =>
  size
    ? {
        sm: "12px",
        md: "14px",
        undefined: "14px",
        lg: "16px",
      }[size]
    : "14px";

interface ButtonProps {
  size?: "sm" | "md" | "lg";
}

export const PrimaryButton = styled.button<ButtonProps>`
  display: flex;
  padding: ${(p) => getButtonPadding(p.size)};
  align-items: center;
  border-radius: 62rem;
  background-color: ${MyTheme.colors.primary};
  color: #212423;
  font-size: ${(p) => getButtonFontSize(p.size)};
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  outline: none;
  border: none;
  transition: all 350ms ease;
  :hover {
    cursor: pointer;
    background-color: #dfdfdf;
  }
  :disabled {
    opacity: 0.1;
  }
`;

export const SecondaryButton = styled.button<ButtonProps>`
  display: flex;
  padding: ${(p) => getButtonPadding(p.size)};
  align-items: center;
  border-radius: 62rem;
  border: 1px solid ${MyTheme.colors.primary};
  background-color: ${MyTheme.colors.primary};
  color: ${MyTheme.colors.primary};
  background: #1b1f1e;
  font-size: ${(p) => getButtonFontSize(p.size)};
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 350ms ease;
  :hover {
    cursor: pointer;
    border: 1px solid #dfdfdf;
    color: #dfdfdf;
  }
`;
