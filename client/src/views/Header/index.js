import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import AppsIcon from "@material-ui/icons/Apps";
import NotificationsIcon from "@material-ui/icons/Notifications";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
// import { auth } from "../../firebase.js";

function Header() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    // auth.signOut().then(() => {
    //   dispatch(logout());
    // });
    sessionStorage.removeItem("profile");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.header}>
      <div className={styles["header-left"]}>
        <IconButton>
          <MenuIcon />
        </IconButton>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzRceIIBz4GgeNszaN5SupI6p1SJE_Bzgk3Q&usqp=CAU"
          alt="gmail logo"
        />
      </div>
      <div className={styles["header-middle"]}>
        <SearchIcon />
        <input type="text" placeholder="Search mail" />
        <ArrowDropDownIcon className={styles["header-inputCaret"]} />
      </div>
      <div className={styles["header-right"]}>
        <IconButton onClick={signOut}>
          <ExitToAppIcon />
        </IconButton>
        <IconButton>
          <HelpOutlineIcon />
        </IconButton>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <AppsIcon />
        </IconButton>
        <Avatar onClick={signOut} src={user?.photoUrl} />
      </div>
    </div>
  );
}

export default Header;
