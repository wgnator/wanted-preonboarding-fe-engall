import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyle = createGlobalStyle`

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
  color: ${theme.fontDarkColor};
  font-family: 'Arial', sans-serif;
  box-sizing: border-box;

}
body {
  height: 100vh;
  margin: 0;

}

#root {
  height: 100%;
  @media (max-width: 720px) {
    width: 100vw;
  }
}
  h1 {
    font-size: 1.5rem;
    letter-spacing: 1.2px;
  }
  @keyframes appear-opacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
