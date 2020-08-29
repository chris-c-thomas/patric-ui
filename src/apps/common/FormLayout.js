import styled from 'styled-components'

const indentPad = '10px' // 35px ?


const Root = styled.div`
  max-width: ${props => props.small ? '560px' : '800px'};
  background: #fff;
  margin: auto;
  padding: 30px 20px 10px 20px;
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;

  /* spaceBetween; usefor for submit buttons */
  ${props => props.spaceBetween &&
    'justify-content: space-between;'}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  display: flex;
  padding: 0  ${props => props.noIndent ? 0 : indentPad};
  margin-bottom: 20px;

  ${props => props.column &&
    'flex-direction: column;'}

  /* pad all <Row> components if "padRows" */
  > div {
    ${props => props.padRows &&
      'margin-bottom: 10px;'}
  }
`

const Title = styled.h5`
  margin: 0 0 0px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
`

const TableTitle = styled.h5`
  margin: 0 0 10px 0;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
`

export {
  Root, Row, Section, Title, Column,
  TableTitle
}