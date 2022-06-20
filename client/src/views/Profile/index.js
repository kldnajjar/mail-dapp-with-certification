import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGunContext from "../../context/useGunContext";

import Header from "../Header";
import Sidebar from "../Sidebar";
// import Mail from "../Mail";
import EmailList from "../EmailList";
// import styles from './Profile.module.css';

import Input from "../../components/input";

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const Profile = () => {
  const [firstName, setFirstName] = useState("");

  let navigate = useNavigate();

  const { getGun, getUser, getCertificate, setCertificate } = useGunContext();
  const profile = JSON.parse(sessionStorage.getItem("profile"));

  useEffect(() => {
    if (!profile) {
      return navigate("/sign-in");
    }

    setFirstName(profile.firstName);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userPub = getUser().is.pub;

    getGun()
      .get(`~${APP_PUBLIC_KEY}`)
      .get("profiles")
      .get(userPub)
      .put(
        { firstName: firstName },
        ({ err }) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Successfully changed display name to ${firstName}`);
          }
        },
        {
          opt: { cert: getCertificate() },
        }
      );
  };

  const renderProfile = () => {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <EmailList />
        </div>

        <form onSubmit={handleSubmit}>
          <h3>profile</h3>

          <Input
            type="text"
            label="First Name"
            placeholder="Change your First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  return <>{profile ? renderProfile() : null}</>;
};

export default Profile;
