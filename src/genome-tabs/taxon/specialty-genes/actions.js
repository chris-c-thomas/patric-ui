
import React, {useState, useEffect} from 'react';
import styled from 'styled-components'

import genomeGroupIcon from '../../../../assets/icons/object-group.svg'

import ActionBtn from '../../../tables/ActionBtn'

import GenomeGroupDialog from '../../genome-group-dialog'

export default function Actions(props) {

  const [show, setShow] = useState(props.show);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  useEffect(() => {
    setShow(props.show);
  }, [props.show])

  const onGroup = () => {
    setShowGroupDialog(true)
  }

  return (
    <>
    {show ?
      <Root>
        <ActionBtn aria-label="filter" onClick={onGroup}>
          <img src={genomeGroupIcon} />
          <div>Group</div>
        </ActionBtn>

        <GenomeGroupDialog open={showGroupDialog}/>

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

