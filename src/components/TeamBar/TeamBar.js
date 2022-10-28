import React from "react";
import Blockie from "react-blockies";
import { getEllipsisTxt } from "../../pages/Extra";
import styles from "./TeamBar.module.scss";
import { useNavigate } from "react-router-dom";

const TeamBar = ({ address }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.FlexDisplay}>
        <Blockie
          seed={"" + address + ""}
          size={10}
          scale={3}
          className={styles.Blockies}
        />
        <span
          className="TeamNameHover"
          onClick={() => {
            navigate(`/${address}`);
          }}
        >
          {getEllipsisTxt(address)}
        </span>
      </div>
    </div>
  );
};

export default TeamBar;
