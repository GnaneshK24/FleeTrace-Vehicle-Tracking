import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Container, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, InputAdornment, IconButton, OutlinedInput, Autocomplete, TextField, createFilterOptions, Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CachedIcon from '@mui/icons-material/Cached';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation, useTranslationKeys } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { prefixString, unprefixString } from '../common/util/stringUtils';
import SelectField from '../common/components/SelectField';
import useMapStyles from '../map/core/useMapStyles';
import useMapOverlays from '../map/overlay/useMapOverlays';
import { useCatch } from '../reactHelper';
import { sessionActions } from '../store';
import { useAdministrator, useRestriction } from '../common/util/permissions';
import useSettingsStyles from './common/useSettingsStyles';

const deviceFields = [
  { id: 'name', name: 'sharedName' },
  { id: 'uniqueId', name: 'deviceIdentifier' },
  { id: 'phone', name: 'sharedPhone' },
  { id: 'model', name: 'deviceModel' },
  { id: 'contact', name: 'deviceContact' },
];

const PreferencesPage = () => {
  const classes = useSettingsStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const admin = useAdministrator();
  const readonly = useRestriction('readonly');

  const user = useSelector((state) => state.session.user);
  const [attributes, setAttributes] = useState(user.attributes);

  const versionApp = import.meta.env.VITE_APP_VERSION.slice(0, -2);
  const versionServer = useSelector((state) => state.session.server.version);
  const socket = useSelector((state) => state.session.socket);

  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(dayjs().add(1, 'week').locale('en').format('YYYY-MM-DD'));

  const mapStyles = useMapStyles();
  const mapOverlays = useMapOverlays();

  const positionAttributes = usePositionAttributes(t);

  const filter = createFilterOptions();

  const generateToken = useCatch(async () => {
    const expiration = dayjs(tokenExpiration, 'YYYY-MM-DD').toISOString();
    const response = await fetch('/api/session/token', {
      method: 'POST',
      body: new URLSearchParams(`expiration=${expiration}`),
    });
    if (response.ok) {
      setToken(await response.text());
    } else {
      throw Error(await response.text());
    }
  });

  const alarms = useTranslationKeys((it) => it.startsWith('alarm')).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  const handleSave = useCatch(async () => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, attributes }),
    });
    if (response.ok) {
      dispatch(sessionActions.updateUser(await response.json()));
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  const handleReboot = useCatch(async () => {
    const response = await fetch('/api/server/reboot', { method: 'POST' });
    throw Error(response.statusText);
  });

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedPreferences']}>
      <Container maxWidth="xs" className={classes.container}>
        {!readonly && (
          <>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('mapTitle')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <FormControl>
                  <InputLabel>{t('mapActive')}</InputLabel>
                  <Select
                    label={t('mapActive')}
                    value={attributes.activeMapStyles?.split(',') || ['openFreeMap', 'locationIqStreets', 'locationIqDark']}
                    onChange={(e, child) => {
                      const clicked = mapStyles.find((s) => s.id === child.props.value);
                      if (clicked.available) {
                        setAttributes({ ...attributes, activeMapStyles: e.target.value.join(',') });
                      } else if (clicked.id !== 'custom') {
                        const query = new URLSearchParams({ attribute: clicked.attribute });
                        navigate(`/settings/user/${user.id}?${query.toString()}`);
                      }
                    }}
                    multiple
                  >
                    {mapStyles.map((style) => (
                      <MenuItem key={style.id} value={style.id}>
                        <Typography component="span" color={style.available ? 'textPrimary' : 'error'}>{style.title}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('mapOverlay')}</InputLabel>
                  <Select
                    label={t('mapOverlay')}
                    value={attributes.selectedMapOverlay || ''}
                    onChange={(e) => {
                      const clicked = mapOverlays.find((o) => o.id === e.target.value);
                      if (!clicked || clicked.available) {
                        setAttributes({ ...attributes, selectedMapOverlay: e.target.value });
                      } else if (clicked.id !== 'custom') {
                        const query = new URLSearchParams({ attribute: clicked.attribute });
                        navigate(`/settings/user/${user.id}?${query.toString()}`);
                      }
                    }}
                  >
                    <MenuItem value="">{'\u00a0'}</MenuItem>
                    {mapOverlays.map((overlay) => (
                      <MenuItem key={overlay.id} value={overlay.id}>
                        <Typography component="span" color={overlay.available ? 'textPrimary' : 'error'}>{overlay.title}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Autocomplete
                  multiple
                  freeSolo
                  options={Object.keys(positionAttributes)}
                  getOptionLabel={(option) => (positionAttributes[option]?.name || option)}
                  value={attributes.positionItems?.split(',') || ['fixTime', 'address', 'speed', 'totalDistance']}
                  onChange={(_, option) => {
                    setAttributes({ ...attributes, positionItems: option.join(',') });
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue && !filtered.includes(params.inputValue)) {
                      filtered.push(params.inputValue);
                    }
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('attributePopupInfo')}
                    />
                  )}
                />
                <FormControl>
                  <InputLabel>{t('mapLiveRoutes')}</InputLabel>
                  <Select
                    label={t('mapLiveRoutes')}
                    value={attributes.mapLiveRoutes || 'none'}
                    onChange={(e) => setAttributes({ ...attributes, mapLiveRoutes: e.target.value })}
                  >
                    <MenuItem value="none">{t('sharedDisabled')}</MenuItem>
                    <MenuItem value="selected">{t('deviceSelected')}</MenuItem>
                    <MenuItem value="all">{t('notificationAlways')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('mapDirection')}</InputLabel>
                  <Select
                    label={t('mapDirection')}
                    value={attributes.mapDirection || 'selected'}
                    onChange={(e) => setAttributes({ ...attributes, mapDirection: e.target.value })}
                  >
                    <MenuItem value="none">{t('sharedDisabled')}</MenuItem>
                    <MenuItem value="selected">{t('deviceSelected')}</MenuItem>
                    <MenuItem value="all">{t('notificationAlways')}</MenuItem>
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        {!readonly && (
          <>
            <div className={classes.buttons}>
              <Button
                type="button"
                color="primary"
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                {t('sharedCancel')}
              </Button>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={handleSave}
              >
                {t('sharedSave')}
              </Button>
            </div>
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default PreferencesPage;
