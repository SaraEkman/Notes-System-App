import styled from 'styled-components'

export const Div = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  background-color: #f2f1f6;
  border: 3px #e61525;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  width: 90%;
  min-height: 200px;
  margin: auto;
  padding: 8px;
  margin-top: 10px;

  h2 {
      align-self: center;
  }
  @media only screen and (min-width: 600px) {
    min-width: 50%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
`
