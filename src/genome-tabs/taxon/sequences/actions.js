
import React, {useState, useEffect} from 'react';
import styled from 'styled-components'

import featuresIcon from '../../../../assets/icons/selection-FeatureList.svg'
import browserIcon from '../../../../assets/icons/genome-browser.svg'

import ActionBtn from '../../../tables/ActionBtn'


export default function Actions(props) {

  const [show, setShow] = useState(props.show);

  useEffect(() => {
    setShow(props.show);
  }, [props.show])


  return (
    <>
    {show ?
      <Root>
        <ActionBtn aria-label="feature viewer">
          <img src={featuresIcon} />
          <div>Features</div>
        </ActionBtn>
        <ActionBtn aria-label="genome browser">
          <img src={browserIcon} />
          <div>Browser</div>
        </ActionBtn>
      </Root>
      : <></>
    }
    </>
  )
}


const Root = styled.div`
  margin-left: 10px;
  padding-left: 5px;
  border-left: 1px solid #f2f2f2;
`

const Divider = styled.div`


`

