import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded';

import { fetchOverview } from '../../api/help';

import marked from '../../../node_modules/marked/lib/marked'


function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const usageError = (propName, value) => (
  `AdvancedButton component must have prop: ${propName}.  Value was: ${value}`
)

export default function UserGuideDialog(props) {
  const { url } = props;
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  if (!url) throw usageError('url', url)

  useEffect(() => {
    fetchOverview(url)
      .then(text => {
        setContent(text)
      });
  }, [])

  return (
    <>
      <HelpIcon
        onClick={() => setOpen(true)}
        fontSize="small"
        color="primary"
        className="help hover"
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="dragable-dialog"
      >
        {/*<DialogTitle style={{ cursor: 'move' }} id="dragable-dialog">
          Overview
        </DialogTitle>
        */}
        <DialogContent>
          <DialogContentText dangerouslySetInnerHTML={content && {__html: marked(content)}}>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}