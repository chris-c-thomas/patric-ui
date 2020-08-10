import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/SearchOutlined'

import { getFacets } from '../api/data-api'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '../forms/checkbox'

const FilterComponent = (props) => {
  const {field, label, core, taxonID, hideSearch, onCheck} = props

  const [enableQuery, setEnableQuery] = useState(false)

  const [data, setData] = useState(null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    getFacets({field, core, taxonID})
      .then(data => {
        setData(data)
      })
  }, [])

  useEffect(() => {
    onCheck({field, value: checked})
  }, [checked])

  const handleCheck = (id) => {
    setChecked(prev => ({...prev, [id]: !prev[id]}))
  }


  return (
    <Container>
      <Header>
        {!enableQuery &&
          <Title>
            {label}
          </Title>
        }

        {enableQuery &&
          <TextField
            placeholder={`Filter ${label}`}
            onChange={() => {}}
            InputProps={{
              style: {marginTop: 4, height: 26},
              startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
            }}
            variant="outlined"
          />
        }

        {!enableQuery && !hideSearch &&
          <Button onClick={() => setEnableQuery(true)}>
            <SearchIcon/>
          </Button>
        }
      </Header>

      <Filters>
        {
          data &&
          data.slice(0, 10).map(obj =>
            <div key={obj.name}>
              <CBContainer
                control={
                  <Checkbox
                    checked={checked[obj.name]}
                    onChange={() => handleCheck(obj.name)}
                  />}
                label={
                  <>
                    <CBLabel>{obj.name}</CBLabel> <Count>{obj.count.toLocaleString()}</Count>
                  </>
                }
              />
            </div>
          )
        }
      </Filters>
    </Container>
  )
}

const Container = styled.div`
  margin-bottom: 10px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.div`
  margin-left: 5px;
`
const Filters = styled.div`
  max-height: 250px;
  overflow: scroll;
`

const CBContainer = styled(FormControlLabel)`
  margin-left: 5px;

  &.MuiFormControlLabel-root {
    width: 225px;
  }

  & .MuiTypography-root {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const CBLabel = styled.div`
  font-size: .8rem;
`

const Count = styled.div`
  color: #888;
  font-size: .8rem;
`


const buildFilterString = (state) =>
  'and(' +
    Object.keys(state).map(field =>
      'or(' +
        Object.keys(state[field])
          .map(name =>
            state[field][name] ? [...acc, `eq(${field},${encodeURI(name)})`] : acc
          , []).join(',') +
      ')'
    ).join(',') +
  ')'.replace(/or(),/g, '')



const Sidebar = (props) => {
  const {filters, onChange} = props

  if (!onChange)
    throw '`onChange` is required a prop for the sidebar component'

  const [query, setQuery] = useState({})

  useEffect(() => {
    onChange(query, buildFilterString(query))
  }, [query])

  const onCheck = ({field, value}) => {
    setQuery(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Root>
      {
        filters.map(({id, label, hideSearch}) =>
          <FilterComponent
            key={id}
            field={id}
            label={label}
            hideSearch={hideSearch}
            onCheck={onCheck}
            {...props}
          />
        )
      }
    </Root>
  )
}


const Root = styled.div`
  overflow: scroll;
  background: #fff;
  width: 249px;
  height: calc(100% - 170px);
  float: left;
  border-right: 1px solid #e9e9e9;

  @media (max-width: 960px) {
    display: none;
  }
`


export default Sidebar
