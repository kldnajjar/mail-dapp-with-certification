import { Button, IconButton } from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import StarIcon from "@material-ui/icons/Star";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import NearMeIcon from "@material-ui/icons/NearMe";
import NoteIcon from "@material-ui/icons/Note";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/Person";
import DuoIcon from "@material-ui/icons/Duo";
import PhoneIcon from "@material-ui/icons/Phone";
import SidebarOption from "./Option";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openSendMessage } from "../../features/mailSlice";
import styles from "./Sidebar.module.css";
// import { getPlugin } from "immer/dist/internal";
// import useGunContext from '../../context/useGunContext';

function Sidebar() {
  // const { getGun, getUser } = useGunContext();
  const dispatch = useDispatch();

  return (
    <div className={styles.sidebar}>
      <Button
        className={styles["sidebar-compose"]}
        onClick={() => dispatch(openSendMessage())}
        startIcon={<AddIcon fontSize="large" />}
      >
        Compose
      </Button>
      <Link to="/" className={styles["sidebar-link"]}>
        <SidebarOption
          Icon={InboxIcon}
          title="Inbox"
          number={54}
          selected={true}
        />
      </Link>

      <SidebarOption Icon={StarIcon} title="Starred" number={12} />
      <SidebarOption Icon={AccessTimeIcon} title="Snoozed" number={9} />
      <SidebarOption Icon={LabelImportantIcon} title="Important" number={12} />
      <SidebarOption Icon={NearMeIcon} title="Sent" number={81} />
      <SidebarOption Icon={NoteIcon} title="Drafts" number={5} />
      <SidebarOption Icon={ExpandMoreIcon} title="More" />

      <div className={styles["sidebar-footer"]}>
        <div className={styles["sidebar-footerIcons"]}>
          <IconButton>
            <PersonIcon />
          </IconButton>
          <IconButton>
            <DuoIcon />
          </IconButton>
          <IconButton>
            <PhoneIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

// let email = {
//   subject: "",
//   sender: "",
//   recipient: "",
//   body: "",
//   key: "",
//   cc: [],
//   bcc: [],
//   keys: []
// }

// email = await encryption(email)   // Then you .set() this email to "emails" node or something like that as well as to "".

// async function encryption(email) {
//   const encryptionKey = "myk-key"   // <-- This key is just an example. Ideally I think we should generate it every time sender sends an email.
//   const encryptedMessage = await SEA.encrypt(email.body, encryptionKey)

//   const recipientEpub = await getRecipientEpub(email)
//   const myPair = getUser()._.sea    // "getUser()" is the current user

//   const encryptedEncryptionKey = await SEA.encrypt(encryptionKey, await SEA.secret(recipientEpub, myPair))

//   if (email.cc != null) {
//     const CCRecipientsArray = await getCCRecipients(email, encryptionKey, myPair)
//     email.keys = CCRecipientsArray
//   }

//   email.key = encryptedEncryptionKey
//   email.body = encryptedMessage
//   return email
// }

// async function getRecipientEpub(email) {
//   await users.map().once(user => {    // "users" is the node where every user data is stored.
//     if (user.email === email.recipient) {
//       return user.epub
//     }
//   })
// }

// async function getCCRecipients(email, encryptionKey, myPair) {
//   let CCRecipientsArray = []
//   let i = 0
//   await users.map().once(user => {
//     if (user.email === email.cc[i]) {
//       const recipient = {
//         email: user.email,
//         key: await SEA.encrypt(encryptionKey, await SEA.secret(user.epub, myPair))
//       }
//       CCRecipientsArray.push(recipient)
//     }
//     i++
//   })

//   return CCRecipientsArray
// }

// email = await decryption(email)

// async function decryption(email) {
//   const currentUserEmail = await getCurrentUserEmail()
//   let isCarbonCopy = false
//   let position = 0

//   email.cc.forEach((element, index) => {
//     if (currentUserEmail === element.recipient) {
//       isCarbonCopy = true
//       position = index
//     }
//   })

//   if (currentUserEmail === email.recipient) {
//     return await decrypt(email.key, email)
//   } else if (isCarbonCopy) {
//     const key = email.keys[position].key    // get the need key from email.keys array
//     return await decrypt(key, email)
//   } else {
//     return
//   }
// }

// async function decrypt(key, email) {
//   const senderEpub = await getSenderEpub(email)
//   const myPair = getUser()._.sea    // "getUser()" is the current user
//   const decryptedEncryptionKey = await SEA.decrypt(key, await SEA.secret(senderEpub, myPair))
//   const decryptedMessage = await SEA.decrypt(email.body, decryptedEncryptionKey)
//   email.body = decryptedMessage
//   return email
// }

// async function getSenderEpub(email) {
//   await users.map().once(user => {    // "users" is the node where every user data is stored.
//     if (user.email === email.sender) {
//       return user.epub
//     }
//   })
// }

// async function getCurrentUserEmail() {
//   await getUser().get("alias").once(user => {
//     return user.email
//   })
// }

export default Sidebar;
