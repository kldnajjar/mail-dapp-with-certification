import { Checkbox, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RedoIcon from "@material-ui/icons/Redo";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import SettingsIcon from "@material-ui/icons/Settings";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Section from "../Section";
import EmailRow from "../EmailRow";
import styles from "./EmailList.module.css";
import useGunContext from '../../context/useGunContext';
import { decryption } from "../../util/privacy"
import "gun/lib/load";
import "gun/sea";
// import { db } from "../../firebase";

const loop = async (getMails) => {
  // console.log("inside")
  getMails().once(mail => {
    console.log("inside .map()")
    return mail
  })
}

const loopThrough = async (getUser, getMails) => {
  console.log("inside")
  let counter = 0
  await getUser().get("pub").once(async myPub => {
    const maillist = getMails()
    console.log(myPub)
    console.log(++counter)
    maillist.map().once(mail => {
      console.log("In once")
      console.log(mail)
    })
  })
}

const emailsList = async (mails) => {
  console.log("inside the function")
  const maillist = mails()
  await maillist.map().once(mail => {
    console.log(mail)
  })
}

function EmailList() {
  const [emails, setEmails] = useState([]);
  const { getUser, getMails } = useGunContext();

  console.log("before")
  loopThrough(getUser, getMails)
  console.log("after")

  useEffect(() => {
    // db.collection("emails")
    //   .orderBy("timestamp", "desc")
    //   .onSnapshot((snapshot) =>
    //     setEmails(
    //       snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         data: doc.data(),
    //       }))
    //     )
    //   );
  }, []);

  return (
    <div className={styles.emailList}>
      <div className={styles["emailList-settings"]}>
        <div className={styles["emailList-settingsLeft"]}>
          <Checkbox />
          <IconButton>
            <ArrowDropDownIcon />
          </IconButton>
          <IconButton>
            <RedoIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
        <div className={styles["emailList-settingsRight"]}>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton>
            <ChevronRightIcon />
          </IconButton>
          <IconButton>
            <KeyboardHideIcon />
          </IconButton>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
      {/* <div className={styles["emailList-sections"]}>
        <Section Icon={InboxIcon} title="Primary" color="red" selected />
        <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />
        <Section Icon={LocalOfferIcon} title="Promotions" color="green" />
      </div> */}

   
   
   
      {/* <div className={styles["emailList-list"]}>
        {emails.map(({ id, data: { to, subject, message, timestamp } }) => (
          <EmailRow
            id={id}
            key={id}
            title={to}
            subject={subject}
            description={message}
            time={new Date(timestamp?.seconds * 1000).toUTCString()}
          />
        ))}
        <EmailRow
          title="Twitch"
          subject="Hey fellow streamer!!"
          description="This is a DOPE"
          time="10pm"
        />
      </div> */}
    </div>
  );
}

export default EmailList;
