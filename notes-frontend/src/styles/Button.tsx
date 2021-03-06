import styled from 'styled-components'

export const Button = styled.button`
  transition: all 0.2s;
  display: inline-block;
  padding: 0.7em 1.7em;
  margin: 0.5em 0.3em 0.3em 0;
  border-radius: 0.2em;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: #ffffff;
  background-color: #3369ff;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  position: relative;
  min-width: 100px;

  &.secondary {
      background-color: #f14e4e;
  }
   &:hover {
    cursor: pointer;
    transform: scale(1.1);
    transition: all 0.2s;
    color: #000000;
    background-color: #ffffff;
  }

  @media all and (max-width: 30em) {
    display: block;
    margin: 0.4em auto;
  }
`
