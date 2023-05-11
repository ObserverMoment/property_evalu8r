import styled from "@emotion/styled";
import { MyTheme } from "./theme";
import { ReactSVG } from "react-svg";

/// Site logo
export const LogoTitle = () => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Header1>Property Evalu8R</Header1>
    <div style={{ width: "28px" }}>
      <ReactSVG src="logo.svg" style={{ position: "relative", top: "1px" }} />
    </div>
  </div>
);

//// Typography
export const Header1 = styled.h1`
  font-size: 1.8em;
  padding: 0;
  margin: 0;
  font-weight: 200;
  color: ${MyTheme.colors.primary};
  font-weight: normal;
`;

/// Card
export const MyCard = styled.div`
  border-radius: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  background: ${MyTheme.colors.cardBackground};
  padding: 10px;
`;

//// Buttons
const getButtonPadding = (size: "micro" | "sm" | "md" | "lg" | undefined) =>
  size
    ? {
        micro: "0.3rem 0.5rem",
        sm: "0.5rem 2rem",
        md: "0.7rem 2.9rem",
        lg: "1rem 3.2rem",
      }[size]
    : "0.7rem 2.9rem";

const getButtonFontSize = (size: "micro" | "sm" | "md" | "lg" | undefined) =>
  size
    ? {
        micro: "10px",
        sm: "12px",
        md: "14px",
        undefined: "14px",
        lg: "16px",
      }[size]
    : "14px";

interface ButtonProps {
  size?: "micro" | "sm" | "md" | "lg";
}

export const PrimaryButton = styled.button<ButtonProps>`
  display: flex;
  padding: ${(p) => getButtonPadding(p.size)};
  align-items: center;
  border-radius: 62rem;
  background-color: ${MyTheme.colors.primary};
  border: 1px solid ${MyTheme.colors.primary};
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
  color: ${MyTheme.colors.primary};
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
