import styled from 'styled-components'

const ActionBtn = styled.button`
  color: #34698e;
  background: 0;
  border: none;
  margin-right: 5px;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 3px;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  min-width: 50px;

  :hover {
    border: 1px solid #bbb;
    opacity: .8;
  }

  div {
    font-size: 9px;
    margin-top: 4px;
    text-align: center;
    white-space: normal;
    overflow: hidden;
  }

  img {
    height: 25px;
  }
`

export default ActionBtn;