import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Inter, sans-serif;
  }
  body {
    font-size: 16px;
    background: ${({ theme: { colors } }) => colors.bgColor};
    color: ${({ theme: { colors } }) => colors.textColor};
  }
  html { 
    scroll-behavior: smooth;

    ::-webkit-scrollbar{
      width: 6px;
    background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: ${({ theme: { colors } }) => colors.colorLightNeutral3};
    }
  }
  a {
    text-decoration: none;
    color: initial;
    color: ${({ theme: { colors } }) => colors.textColor};
  }
  button {
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
  }
  ul {
    list-style: none;
  }


`;
export default GlobalStyles;
