import React from 'react';
import { useMediaQuery, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';
import { grey, green, indigo, blue } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    
    
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background:indigo[300],
    paddingBottom: theme.spacing(5),
    width:'40%',
    paddingLeft:'30px',
    
    
  },
  paper: {
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    boxShadow: '-2px 0px 16px rgba(0, 0, 0, 0.25)',
    backgroundColor:indigo[200],
    paddingRight:'30px'
    
  },
  form: {
    
    maxWidth: theme.spacing(50),
    padding: '50px',
    width: '100%',
    marginLeft:'10px',
    marginBottom:'200px',
    
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <Paper className={classes.paper}>
        <form className={classes.form}>
          {children}
        </form>
      </Paper>
      <div className={classes.sidebar}>
        {!useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.secondary.contrastText} />}
      </div>
    </main>
  );
};

export default LoginLayout;
