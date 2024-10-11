import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  table: {
    marginBottom: theme.spacing(10),
  },
  columnAction: {
    width: '1%',
    paddingRight: theme.spacing(1),
  },
  container: {
    marginTop: theme.spacing(2),
    borderRadius:'20px',
  },
  buttons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    borderRadius:'20px',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    borderRadius:'30px',
  },
  verticalActions: {
    display: 'flex',
    flexDirection: 'column',
  },
  Accordion:{
    borderRadius:'50px'
  }
}));
