import React from "react";
import styles from "./Option.module.css";

function SidebarOption({ Icon, title, number, selected }) {
  return (
    <div
      className={`${styles.sidebarOption} ${
        selected && styles["sidebarOption--active"]
      }`}
    >
      <Icon />
      <h3>{title}</h3>
      <p>{number}</p>
    </div>
  );
}

export default SidebarOption;
