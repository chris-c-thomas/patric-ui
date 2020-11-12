import InputBase from '@material-ui/core/InputBase'
import { withStyles } from '@material-ui/core/styles'

const CustomInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(2.2),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '250px',
    padding: '10px 26px 10px 12px',
    '&:focus': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.main,
    }
  },
}))(InputBase)


export default CustomInput