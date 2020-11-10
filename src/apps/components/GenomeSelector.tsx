import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Popover from '@material-ui/core/Popover'

// import FilterIcon from '@material-ui/icons/FilterListOutlined'
import filterIcon from '../../../assets/icons/filter.svg'
import LockIcon from '@material-ui/icons/Lock'
import Checkbox from '@material-ui/core/Checkbox'

import {queryGenomeNames} from '../../api/data-api'
import highlightText from '../../utils/text'





const getFilterString = (state) => {
  var parts = []
  let filterStr = ''

  // this block should include all 4 combinations of selection of public
  // and private; will use logic OR for selections
  if (state.allOtherPublicGenomes && state.repGenomes && state.refGenomes) {
    parts.push('eq(public,true)')
  } else if (state.repGenomes && state.refGenomes) {
    parts.push('and(or(eq(reference_genome,%22Reference%22),eq(reference_genome,%22Representative%22)),eq(public,true))')
  } else if (state.allOtherPublicGenomes && state.refGenomes) {
    parts.push('and(not(reference_genome,%22Representative%22),eq(public,true))')
  } else if (state.allOtherPublicGenomes && state.repGenomes) {
    parts.push('and(not(reference_genome,%22Reference%22),eq(public,true))')
  } else if (state.refGenomes) {
    parts.push('and(eq(reference_genome,%22Reference%22),eq(public,true))')
  } else if (state.repGenomes) {
    parts.push('and(eq(reference_genome,%22Representative%22),eq(public,true))')
  } else if (state.allOtherPublicGenomes) {
    parts.push('and(not(reference_genome,%22Reference%22),not(reference_genome,%22Representative%22),eq(public,true))')
  }

  if (state.myGenomes) {
    parts.push('eq(public,false)')
  }

  // if the user accidentally unchecks everything, we'll provide all genomes

  // assemble the query filter
  if (parts.length == 0) {
    filterStr = ''
  } else if (parts.length == 1) {
    filterStr = parts.join('')
  } else {
    filterStr = '&or(' + parts.join(',') + ')'
  }

  return filterStr
}


type Genome = {
  genome_id: string
  genome_name: string
  owner: string
  public: boolean
  taxon_id: number
}



type Props = {
  // value: Genome
  label?: string
  onChange: (genome: Genome) => void
}


export default function GenomeSelector(props: Props) {
  const {
    // value,
    label = 'Select Genome',
    onChange
  } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const [state, setState] = useState({
    refGenomes: true,
    repGenomes: true,
    allOtherPublicGenomes: true,
    myGenomes: true,
    filterString: ''
  })

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await queryGenomeNames(query, state.filterString)
      setOptions(data)
      setLoading(false)
    })()
  }, [query, state])


  const handleOnChange = (evt, obj) => {
    onChange(obj)
  }


  const openFilterMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeFilterMenu = () => {
    setAnchorEl(null)
  }

  const handleCheck = (evt, type) => {
    setState(prev => {
      const newState = {...prev, [type]: evt.target.checked}
      return {...newState, filterString: getFilterString(newState)}
    })
  }

  const open = Boolean(anchorEl)
  const popoverID = open ? 'filter-menu-popover' : undefined


  return (
    <Root>
      <InputLabel shrink htmlFor={label}>
        {label}
      </InputLabel>
      <Autocomplete
        style={{ width: 350 }}
        getOptionLabel={(option) => option.genome_name}
        options={options}
        autoComplete
        onChange={handleOnChange}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(evt) => setQuery(evt.target.value)}
            size="small"
            placeholder="e.g. Mycobacterium tuberculosis H37Rv"
            variant="outlined"
            /*
            InputLabelProps={{
              shrink: true,
            }}
            */
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <div>
                  <IconButton onClick={openFilterMenu} size="small">
                    <img src={filterIcon} width="18" />
                  </IconButton>
                  <Popover
                    id={popoverID}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={closeFilterMenu}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                    }}
                  >
                    <FilterTitle>Include in Search</FilterTitle>
                    <div className="flex flex-column" style={{margin:0, padding: 10}}>
                      <b>Public Genomes</b>
                      <Label
                        control={
                          <Checkbox
                            checked={state.refGenomes}
                            onChange={evt => handleCheck(evt, 'refGenomes')}
                            size="small"
                            color="primary"
                            disableRipple
                          />
                        }
                        label="Reference genomes"
                      />
                      <Label
                        control={
                          <Checkbox
                            checked={state.repGenomes}
                            onChange={evt => handleCheck(evt, 'repGenomes')}
                            size="small"
                            color="primary"
                            disableRipple
                          />
                        }
                        label="Representative genomes"
                      />
                      <Label
                        control={
                          <Checkbox
                            checked={state.allOtherPublicGenomes}
                            onChange={evt => handleCheck(evt, 'allOtherPublicGenomes')}
                            size="small"
                            color="primary"
                            disableRipple
                          />
                        }
                        label="All other public genomes Genomes"
                      />

                      <b>Private Genomes</b>
                      <Label
                        control={
                          <Checkbox
                            checked={state.myGenomes}
                            onChange={evt => handleCheck(evt, 'myGenomes')}
                            size="small"
                            color="primary"
                            disableRipple
                          />
                        }
                        label="My genomes"
                      />
                    </div>
                  </Popover>
                </div>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(option) => (
          <div>
            {!option.public && <LockIcon style={{fontSize: 12}} />}{' '}
            {highlightText(option.genome_name, query)} [{highlightText(option.genome_id, query)}]
          </div>
        )}
      />
    </Root>
  )
}


const Root = styled.div`
  .MuiFormControlLabel-root {
    font-size: .8em;
  }
`

const Label = styled(FormControlLabel)`
  .MuiButtonBase-root {
    padding: 5px 4px 5px 10px;
  }
`

const FilterTitle = styled.div`
  font-weight: bold;
  width: 100%;
  background: #2e76a3;
  color: #f2f2f2;
  padding: 4px 5px;
`
