import React from 'react';
import {
  Divider, List, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HelpIcon from '@mui/icons-material/Help';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import { makeStyles } from '@mui/styles';
import useFeatures from '../../common/util/useFeatures';

const MenuItem = ({
  title, link, icon, selected,
}) => (
  <ListItemButton key={link} component={Link} to={link} selected={selected}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={title} />
  </ListItemButton>
);
const useStyles = makeStyles((theme) => ({
  h3:{
    margin:'15px',
    marginLeft:'30px',
    fontFamily:'unset',
    
  },
  h:{
    margin:'10px',
    marginLeft:'30px',
    fontFamily:'unset',
    marginTop:'9px',
    marginBottom:'15px'
    
  }
}));

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();
  const classes = useStyles();

  const readonly = useRestriction('readonly');
  const manager = useManager();
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);

  const features = useFeatures();

  return (
    <>
      <List>
        {!readonly && (
          <>
          <h3 className={classes.h}>User</h3>
          <Divider />
            <MenuItem
              title={t('settingsUser')}
              link={`/settings/user/${userId}`}
              icon={<PersonIcon />}
              selected={location.pathname === `/settings/preferences`}
            />
            <MenuItem
              title={t('deviceTitle')}
              link="/settings/devices"
              icon={<SmartphoneIcon />}
              selected={location.pathname.startsWith('/settings/device')}
            />
            {!features.disableDrivers && (
              <MenuItem
                title={t('sharedDrivers')}
                link="/settings/drivers"
                icon={<PersonIcon />}
                selected={location.pathname.startsWith('/settings/driver')}
              />
            )}
            {supportLink && (
              <MenuItem
                title={t('settingsSupport')}
                link={supportLink}
                icon={<HelpIcon />}
              />
            )}
          </>
        )}
      </List>
      {manager && (
        <>
          <Divider />
          <h3 className={classes.h3}>Server</h3>
          <Divider />
          <List>
            <MenuItem
              title={t('settingsUsers')}
              link="/settings/users"
              icon={<PeopleIcon />}
              selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
            />
          </List>
        </>
      )}
    </>
  );
};

export default SettingsMenu;
