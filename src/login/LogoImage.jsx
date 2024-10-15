import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import Logo from '../resources/images/logo.svg?react';
import logd from '/logo.svg';

const useStyles = makeStyles((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '2400px',
    maxHeight: '600px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
  },
  images:{
    alignSelf: 'center',
    maxWidth: '2400px',
    maxHeight: '600px',
    width: 'auto',
    height: 'auto',
    margin: '-200px',

  }
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const classes = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  const logo = useSelector((state) => logd);
  const logoInverted = useSelector((state) => logd);

  if (logo) {
    if (expanded && logoInverted) {
      return <img className={classes.image} src={logd} alt="" />;
    }
    return <img className={classes.images} src={logd} alt="" />;
  }
  return <Logo className={classes.image} style={{ color }} />;
};

export default LogoImage;
