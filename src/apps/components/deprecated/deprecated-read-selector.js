import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Label from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/AddRounded';

import AdvandedButton from '../AdvancedButton'
import ObjectSelector from './object-selector/object-selector';
import SelectedTable from './selected-table';
import TextInput from '../TextInput';
import Selector from '../selector';

import { parsePath } from '../../../utils/paths';


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2),
  },
}))


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
    <>
      <RadioGroup
        row
        value={type}
        onChange={onTypeChange}
        aria-label="read type"
        size="small"
      >
        <FormControlLabel value="single" control={<Radio color="primary"/>} label="Single reads" />
        <FormControlLabel value="paired" control={<Radio color="primary"/>} label="Paired-end Reads" />
        <FormControlLabel value="SRA" control={<Radio color="primary"/>} label="SRA" />
      </RadioGroup>

      {/*<UserGuideDialog url={userGuideURL} />*/}

      <Grid container justify="space-between">
        <Grid item xs={10}>
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
              type == 'SRA' && !sraID
            }
            disableRipple
          >
            <AddIcon /> Add
          </Button>
        </Grid>

        {/* we show the advanced options for single or paired */
          advancedOptions && type != 'SRA' &&
          <AdvandedButton
            onClick={open => setAdvOpen(open)}
            label="Advanced"
          />
        }

        {
          advOpen &&
          <Grid container spacing={1}>

            { type == 'paired' &&
              <>
                <Grid item xs={4}>
                  <Selector
                    label="File 1 Interleaved"
                    value={interleaved}
                    width="150px"
                    options={[
                      {label: 'False', value: 'false'},
                      {label: 'True', value: 'true'}
                    ]}
                  />
                </Grid>

                <Grid item xs={4}>
                  <Selector
                      label="Mate Paired"
                      value={read_orientation_outward}
                      width="150px"
                      options={[
                        {label: 'False', value: 'false'},
                        {label: 'True', value: 'true'}
                      ]}
                    />
                </Grid>
              </>
            }

            <Grid item>
              <Selector
                  label="Platform"
                  value={platform}
                  onChange={val => setPlatform(val)}
                  options={[
                    {label: 'Infer Platform', value: 'infer'},
                    {label: 'Illumina', value: 'illumina'},
                    {label: 'Ion Torrent', value: 'iontorrent'}
                  ]}
                />
            </Grid>
          </Grid>

        }

        <SelectedTable
          items={reads}
          onRemove={onRemove}
        />

      </Grid>
    </>
  )
}
