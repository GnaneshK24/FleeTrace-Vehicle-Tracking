import React, { useState } from 'react';
import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainPage from './main/MainPage';
import UsersPage from './settings/UsersPage';
import DevicePage from './settings/DevicePage';
import UserPage from './settings/UserPage';
import PositionPage from './other/PositionPage';
import LoginPage from './login/LoginPage';
import RegisterPage from './login/RegisterPage';
import useQuery from './common/util/useQuery';
import { useEffectAsync } from './reactHelper';
import { devicesActions } from './store';
import PreferencesPage from './settings/PreferencesPage';
import App from './App';
import ChangeServerPage from './login/ChangeServerPage';
import DevicesPage from './settings/DevicesPage';
import Loader from './common/components/Loader';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [redirectsHandled, setRedirectsHandled] = useState(false);

  const { pathname } = useLocation();
  const query = useQuery();

  useEffectAsync(async () => {
    if (query.get('token')) {
      const token = query.get('token');
      await fetch(`/api/session?token=${encodeURIComponent(token)}`);
      navigate(pathname);
    } else if (query.get('deviceId')) {
      const deviceId = query.get('deviceId');
      const response = await fetch(`/api/devices?uniqueId=${deviceId}`);
      if (response.ok) {
        const items = await response.json();
        if (items.length > 0) {
          dispatch(devicesActions.selectId(items[0].id));
        }
      } else {
        throw Error(await response.text());
      }
      navigate('/');
    } else if (query.get('eventId')) {
      const eventId = parseInt(query.get('eventId'), 10);
      navigate(`/event/${eventId}`);
    } else {
      setRedirectsHandled(true);
    }
  }, [query]);

  if (!redirectsHandled) {
    return (<Loader />);
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/change-server" element={<ChangeServerPage />} />
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="position/:id" element={<PositionPage />} />
        <Route path="settings">
          <Route path="devices" element={<DevicesPage />} />
          <Route path="device/:id" element={<DevicePage />} />
          <Route path="device" element={<DevicePage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="user" element={<UserPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
