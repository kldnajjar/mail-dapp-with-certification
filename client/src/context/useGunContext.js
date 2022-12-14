/*
 * Provide one instance of gun to your entire app.
 * NOTE Using this component blocks render until gun is ready
 *
 * Usage examples:
 * // index.js
 *   import { GunContextProvider } from './useGunContext'
 *   // ...
 *   <GunContextProvider>
 *     <App />
 *   </GunContextProvider>
 *
 * // App.js
 *   import useGunContext from './useGunContext'
 *   // ...
 *   const { getGun, getUser } = useGunContext()
 *
 *   getGun().get('ours').put('this')
 *   getUser().get('mine').put('that')
 */
import React, { createContext, useContext, useRef, useEffect } from "react";
import Gun from "gun/gun";
import "gun/sea";
const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const GunContext = createContext({
  getGun: () => {},
  getUser: () => {},
  getMails: () => {},
  getCertificate: () => {},
  setCertificate: () => {},
  onAuth: () => () => {},
});

export const GunContextProvider = ({ children }) => {
  const gunRef = useRef();
  const userRef = useRef();
  const mailsRef = useRef();
  const certificateRef = useRef();
  const accessTokenRef = useRef();
  const onAuthCbRef = useRef();

  useEffect(() => {
    Gun.on("opt", (ctx) => {
      if (ctx.once) return;

      ctx.on("out", function (msg) {
        const to = this.to;
        // Adds headers for put
        msg.headers = {
          accessToken: accessTokenRef.current,
        };
        to.next(msg); // pass to next middleware

        if (msg.err === "Invalid access token") {
          console.log("Invalid access token");
          // not implemented: handle invalid access token
          // you might want to do a silent refresh, or
          // redirect the user to a log in page
        }
      });
    });

    const gun = Gun(process.env.APP_PEERS.split(","));
    // const gun = Gun(["http://localhost:8765/gun"]);
    window.gun = gun;

    // create user
    const user = gun
      .user()
      // save user creds in session storage
      // this appears to be the only type of storage supported.
      // use broadcast channels to sync between tabs
      .recall({ sessionStorage: true });

    gun.on("auth", (...args) => {
      if (!accessTokenRef.current) {
        // get new token
        user.get("alias").once((email) => {
          fetch(`${process.env.API_URL}/tokens`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ accessToken }) => {
              // store token in app memory
              accessTokenRef.current = accessToken;
            });
        });
      }

      if (!certificateRef.current) {
        // get new certificate
        user.get("alias").once((email) => {
          fetch(`${process.env.API_URL}/certificates`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ certificate }) => {
              // store certificate in app memory
              // TODO check if expiry isn't working or misconfigured
              // TODO handle expired certificates
              certificateRef.current = certificate;
            });
        });
      }

      if (onAuthCbRef.current) {
        onAuthCbRef.current(...args);
      }
    });

    const mails = gun.get("profiles").get("mails-list")

    gunRef.current = gun;
    userRef.current = user;
    mailsRef.current = mails
  }, []);

  return (
    <GunContext.Provider
      value={{
        getGun: () => gunRef.current,
        getUser: () => userRef.current,
        getMails: () => mailsRef.current,
        getCertificate: () => certificateRef.current,
        setCertificate: (v) => {
          certificateRef.current = v;
        },
        onAuth: (cb) => {
          onAuthCbRef.current = cb;
        },
      }}
    >
      {children}
    </GunContext.Provider>
  );
};

export default function useGunContext() {
  return useContext(GunContext);
}
