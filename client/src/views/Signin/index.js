import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useGunContext from "../../context/useGunContext";
import Input from "../../components/input";
import styles from "./Signin.module.css";

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const SignIn = () => {
  let navigate = useNavigate();
  const { getGun, getUser, setProfile } = useGunContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pageRedirection = (page) => {
    navigate(page, { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    getUser().auth(email, password, ({ err }) => {
      if (err) {
        return toast.error(err);
      }

      getGun()
        .get(`~${APP_PUBLIC_KEY}`)
        .get("profiles")
        .get(getUser().is.pub)
        .on((profile) => {
          setProfile(profile);
          toast.success("User Logged");
          pageRedirection("/profile");
        });
    });
  };

  const renderLogin = () => {
    return (
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h3>Sign In</h3>

        <Input
          type="email"
          label="Email address"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <div className="footer-container">
          Don't have an account
          <button className="link " onClick={() => pageRedirection("/sign-up")}>
            register
          </button>
        </div>
      </form>
    );
  };

  return <>{renderLogin()}</>;
};

export default SignIn;
