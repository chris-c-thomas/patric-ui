import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Label from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/ArrowForwardRounded';

import AdvandedButton from './advanced-button'
import ObjectSelector from './object-selector/object-selector';
import SelectedTable from './selected-table';
import { InputLabel } from '@material-ui/core';
import TextInput from './text-input';
import Selector from './selector';

import { parsePath } from '../../utils/paths';


const useStyles = makeStyles(theme => ({

}))


const AddBtn = ({onAdd, disabled}) =>
  <Button
    aria-label="add item"
    onClick={onAdd}
    disableRipple
    disabled={disabled}
  >
    Add <AddIcon />
  </Button>



export default function ReadSelector(props) {
  const styles = useStyles();

  const { onChange, advancedOptions} = props;

  // currently selected path (for single reads)
  const [path, setPath] = useState(null);

  // currently selected paths (for single paired reads)
  const [path1, setPath1] = useState(null);
  const [path2, setPath2] = useState(null);

  // current SRA ID input
  const [sraID, setSraID] = useState(null);

  // currently selected read type
  const [type, setType] = useState('single');

  // list of selected reads
  const [reads, setReads] = useState([]);

  const [advOpen, setAdvOpen] = useState(false);

  const [interleaved, setInterleaved] = useState('false');
  const [read_orientation_outward, setMatePaired] = useState('false');
  const [platform, setPlatform] = useState('infer');


  // two way binding on "reads"
  useEffect(() => {
    onChange(reads);
  }, [reads])


  const onTypeChange = (evt, type) => {
    setType(type);
  }

  function onAdd() {
    let item;
    if (type == 'single') {
      item = {
        name: parsePath(path).label,
        platform
      }
    } else if (type == 'paired') {
      item = {
        name: parsePath(path1).label + ', ' + parsePath(path2).label ,
        platform,
        interleaved,
        read_orientation_outward
      }
    }

    // add reads
    setReads([...reads, item]);
  }

  function onRemove({index}) {
    setReads(reads.filter((_, i) => i != index));
  }

  return (
    <Grid container justify="space-between">
      <Grid item xs={5}>
        <ObjectSelector
          label="Single Read Library"
          value={path}
          onChange={val => setPath1(val)}
          type="reads"
          dialogTitle="Select read file 1"
          placeholder="Read file 1"
        />

        <AddBtn onAdd={onAdd} disabled={!path} />

        <ObjectSelector
          label="Paired Read Library"
          value={path1}
          onChange={val => setPath(val)}
          type="reads"
          dialogTitle="Select read file"
          placeholder="Read file 1"
        />
        <ObjectSelector
          label=" "
          value={path2}
          onChange={val => setPath2(val)}
          type="reads"
          dialogTitle="Select read file 2"
          placeholder="Read file 2"
        />

        <AddBtn onAdd={onAdd} disabled={!path1 || !path2} />

        <InputLabel shrink>
          SRA run accession
        </InputLabel>
        <TextInput
          placeholder="SRR"
          value={sraID}
          noLabel
        />

        <AddBtn onAdd={onAdd} disabled={!sraID} />

      </Grid>
      <Grid item xs={5}>
        <SelectedTable
          items={reads}
          onRemove={onRemove}
        />
      </Grid>

    </Grid>
  )
}
