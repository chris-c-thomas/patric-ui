import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Label from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/AddRounded';

import ObjectSelector from './object-selector/object-selector';
import SelectedTable from './selected-table';
import TextInput from './text-input';

import { pathToObject } from '../../utils/paths';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2),
  },
}))


export default function ReadSelector(props) {
  const styles = useStyles();

  const { onChange } = props;

  // currently selected path (for single reads)
  const [path, setPath] = useState(null);

  // currently selected paths (for single paired reads)
  const [path1, setPath1] = useState(null);
  const [path2, setPath2] = useState(null);

  // current SRA ID input
  const [sraID, setSraID] = useState(null);

  // currently selected read type
  const [type, setType] = useState('single');

  // currently selected path (for single reads)
  const [reads, setReads] = useState([]);


  // two way binding on "reads"
  useEffect(() => {
    onChange(reads);
  }, [reads])


  const onTypeChange = (evt, type) => {
    setType(type);
  }

  function onAdd() {
    if (type == 'single') {
      const item = {
        name: path,
        platform: 'single ended'
      }

      setReads([...reads, item]);
    }
  }

  function onRemove({index}) {
    setReads(reads.filter((_, i) => i != index));
  }

  return (
    <>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={onTypeChange}
        aria-label="text alignment"
        size="small"
        className="btn-group"
      >
        <ToggleButton value="single" aria-label="left aligned" disableRipple>
          Single Reads
        </ToggleButton>
        <ToggleButton value="paired" aria-label="centered" disableRipple>
          Paired End Reads
        </ToggleButton>
        <ToggleButton value="SRA" aria-label="right aligned" disableRipple>
          SRA
        </ToggleButton>
      </ToggleButtonGroup>


      <Grid container>
        <Grid item xs={9}>
          {
            type == 'single' &&
            <ObjectSelector
              label="Read File"
              value={path}
              onChange={val => setPath(val)}
              type="reads"
              dialogTitle="Select read file"
            />
          }

          {
            type == 'paired' &&
            <>
              <ObjectSelector
                label="Read File 1"
                value={path1}
                onChange={val => setPath1(val)}
                type="reads"
                dialogTitle="Select read file 1"
              />

              <ObjectSelector
                label="Read File 2"
                value={path2}
                onChange={val => setPath2(val)}
                type="reads"
                dialogTitle="Select read file 2"
              />
            </>
          }

          {
            type == 'SRA' &&
            <TextInput
              label="SRA run accession"
              value={sraID}
            />
          }
        </Grid>

        {/* reuse "add" button for each set of forms */}
        <Grid item xs={1}>
          <Button
            className={styles.button}
            aria-label="add item"
            onClick={onAdd}
            disabled={
              type == 'single' && !path ||
              type == 'paired' && (!path1 || !path2) ||
              type == 'sra' && !sra
            }
            disableRipple
          >
            <AddIcon /> Add
          </Button>
        </Grid>



          <SelectedTable
            items={reads}
            onRemove={onRemove}
          />



      </Grid>



    </>
  )
}
