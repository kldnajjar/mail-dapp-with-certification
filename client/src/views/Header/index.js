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
import logo from "../../aseets/logo.png";
import styles from "./Header.module.css";

function Header() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
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
        <img src={logo} alt="mykloud logo" />
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
