import styled from "@emotion/styled";
import { DEVICES } from "./theme";

export const PageLayout = styled.div`
  min-height: 100vh;
  text-align: center;
  margin: 0;
  color: white;
  background: linear-gradient(
    to right top,
    #1d2120,
    #1e2220,
    #1f2221,
    #202221,
    #212322,
    #222423,
    #242525,
    #252626,
    #272828,
    #2a2a2a,
    #2c2c2c,
    #2e2e2e
  );
  /* background: linear-gradient(
    to right top,
    #ecbd91,
    #eab690,
    #e8af8f,
    #e5a88f,
    #e1a28f,
    #dd9d90,
    #d99890,
    #d49391,
    #ce8e92,
    #c78992,
    #bf8492,
    #b78092
  ); */
  /* https://stackoverflow.com/questions/206652/how-to-create-div-to-fill-all-space-between-header-and-footer-div */
  display: grid;
  /* let content auto to occupy remaining height and pass value in fit-content with min-height for header and footer */
  grid-template-rows: fit-content(8rem) auto fit-content(60px);
  grid-template-areas: "header" "main" "footer";
`;

export const PageHeader = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97vw;
  padding: 14px;
  @media ${DEVICES.tablet} {
    height: 80px;
    width: 97vw;
    padding: 0 20px;
  }
  @media ${DEVICES.desktop} {
    height: 80px;
    width: 85vw;
    padding: 0 20px;
  }
`;

export const PageContent = styled.main`
  grid-area: main;
  text-align: center;
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
`;

export const HomeContent = styled.div`
  text-align: center;
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  max-width: 99vw;
`;

export const PageFooter = styled.footer`
  height: 40px;
  grid-area: footer;
`;

type FlexRowProps = {
  justifyContent?: string;
  gap?: string;
  alignItems?: string;
  wrap?: string;
};

export const FlexRow = styled.div<FlexRowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${(p) => p.wrap || "wrap"};
  justify-content: ${(p) => p.justifyContent};
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems || ""};
`;

type MySpacerProps = {
  height?: number;
  width?: number;
};

export const MySpacer = styled.div<MySpacerProps>`
  height: ${(p) => (p.height ? `${p.height}px` : "0")};
  width: ${(p) => (p.width ? `${p.width}px` : "0")};
`;
