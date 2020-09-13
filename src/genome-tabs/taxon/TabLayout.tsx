import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'


const Root = styled.div`
  display: flex;
  max-height: calc(100% - 150px);
  height: 100%; /* fill rest */
`

const GridContainer = styled.div`
  position: relative;
  margin: 0 10px;
  width: calc(100% - ${(props) => props.fullWidth ? '5px' : '270px'} );

  @media (max-width: 960px) {
    width: calc(100% - 2px);
  }
`

const Progress = styled(LinearProgress)`
  position: absolute;
  top: 0;
`

const ActionContainer = styled.div`
  margin-left: 10px;
  padding-left: 5px;
  border-left: 1px solid #f2f2f2;
`


export {
  Root, GridContainer, Progress, ActionContainer
}