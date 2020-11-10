import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

import IconButton from '@material-ui/core/IconButton'

// import FilterIcon from '@material-ui/icons/FilterListOutlined'
import filterIcon from '../../../assets/icons/filter.svg'
import LockIcon from '@material-ui/icons/Lock'

import {queryGenomeNames} from '../../api/data-api'
import InputLabel from '@material-ui/core/InputLabel'



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

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')
  // const [genome, setGenome] = useState(value)

  /*
  useEffect(() => {
    setGenome(value)
  }, [value])
  */

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await queryGenomeNames(query)
      setOptions(data)
      setLoading(false)
    })()
  }, [query])


  const handleOnChange = (evt, obj) => {
    onChange(obj)
  }

  return (
    <div>
      <InputLabel shrink htmlFor={label}>
        {label}
      </InputLabel>
      <Autocomplete
        id="asynchronous-selector"
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
                <IconButton size="small"><img src={filterIcon} width="18" /></IconButton>
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
            {!option.public && <LockIcon style={{fontSize: 12}} />} {option.genome_name} [{option.genome_id}]
          </div>
        )}
      />
    </div>
  )
}
