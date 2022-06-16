import React, { useEffect } from "react";

import Navigator from "./Navigator";
import { ToastContainer } from "react-toastify";
import useSessionChannel from "./hooks/useSessionChannel";
import useGunContext from "./context/useGunContext";

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const App = () => {
  const { getGun, getUser, onAuth } = useGunContext();
  const sessionChannel = useSessionChannel();

  useEffect(() => {
    onAuth(() => {
      // notify other tabs
      sessionChannel.postMessage({
        eventName: "I_HAVE_CREDS",
        value: window.sessionStorage.getItem("pair"),
      });

      getGun()
        .get(`~${APP_PUBLIC_KEY}`)
        .get("profiles")
        .get(getUser().is.pub)
        .on((profile) => {
          // setUserProfile(profile);
          console.log("User profile", profile);
        });
    });

    sessionChannel.onMessage((e) => {
      const { eventName } = e.data;
      console.log(eventName);
      if (eventName === "REMOVE_YOUR_CREDS") {
        alert("REMOVE_YOUR_CREDS");
      }
    });
  }, []);

  return (
    <>
      <Navigator />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
