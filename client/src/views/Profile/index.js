import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGunContext from '../../context/useGunContext';
import useSessionChannel from '../../hooks/useSessionChannel';

// import styles from './Profile.module.css';

const Profile = () => {
  let navigate = useNavigate();
  const sessionChannel = useSessionChannel();

  const { getProfile, setProfile, getUser, setCertificate } = useGunContext();

  useEffect(() => {
    if (!getProfile()) {
      navigate('/sign-in');
    }
  }, []);

  const pageRedirection = (page) => {
    navigate(page, { replace: true });
  };

  const logOut = (evt) => {
    setCertificate(null);

    const user = getUser();

    user.leave();

    // check if logout failed, if so manually remove
    // user from session storage
    // see https://gun.eco/docs/User#user-leave
    if (user._.sea) {
      window.sessionStorage.removeItem('pair');
    }

    // logged out from click, notify other tabs
    if (evt) {
      sessionChannel.postMessage({
        eventName: 'REMOVE_YOUR_CREDS',
      });
    }

    setProfile();
    pageRedirection('/');
  };

  const renderProfile = () => {
    return (
      <div>
        <h1>community</h1>
        <div>
          logged in as {getProfile().firstName} ({getProfile().email}).{' '}
          <button onClick={logOut}>Log out</button>
        </div>
        <h2>user profiles</h2>
      </div>
    );
  };

  return <>{getProfile() ? renderProfile() : null}</>;
};

export default Profile;
