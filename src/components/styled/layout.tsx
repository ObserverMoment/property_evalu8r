import styled from "@emotion/styled";
import { MyTheme } from "./theme";

export const PageLayout = styled.div`
  min-height: 100vh;
  text-align: center;
  margin: 0;
  padding: 0;
  color: white;
  /* background: ${MyTheme.colors.background}; */
  background: linear-gradient(
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
  );
  /* background: linear-gradient(
    to right top,
    #1b1f1e,
    #1f2524,
    #232a29,
    #283030,
    #2c3636,
    #2c3636,
    #2c3636,
    #2c3636,
    #283030,
    #242b2a,
    #202524,
    #1c201f
  ); */
  /* https://stackoverflow.com/questions/206652/how-to-create-div-to-fill-all-space-between-header-and-footer-div */
  display: grid;
  /* let content auto to occupy remaining height and pass value in fit-content with min-height for header and footer */
  grid-template-rows: fit-content(8rem) auto fit-content(60px);
  grid-template-areas: "header" "main" "footer";
`;

export const PageHeader = styled.header`
  height: 70px;
  padding: 16px;
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

export const PageFooter = styled.footer`
  height: 40px;
  grid-area: footer;
`;

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

type MySpacerProps = {
  height?: number;
  width?: number;
};

export const MySpacer = styled.div<MySpacerProps>`
  height: ${(p) => (p.height ? `${p.height}px` : "0")};
  width: ${(p) => (p.width ? `${p.width}px` : "0")};
`;
