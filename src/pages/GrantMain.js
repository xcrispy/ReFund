import React from "react";
import styles from "./styles/GrantMain.module.scss";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const GrantMain = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.GrantMainHeadDiv}>
      <div className={styles.QuoteImage}>
        <div style={{ width: "100%" }}>
          <h1>Fund the open web</h1>

          <h3>
            ReFund help fund the open source projects built in the Polygon
            Ecosystem
          </h3>
          <div className={styles.ButtonSplit}>
            <Button
              onClick={() => {
                navigate(`/grants/explorer`);
              }}
              variant="primary"
            >
              View All Grants
            </Button>
            <Button
              onClick={() => {
                navigate(`/grants/new`);
              }}
              variant="outline-primary"
            >
              Create a Grants
            </Button>
          </div>
        </div>
        <div style={{ width: "100%" }} className={styles.imgTag}>
          <img
            width="100%"
            height="250px"
            alt="-"
            src="https://gateway.pinata.cloud/ipfs/QmU6csML8rWvpkE75JKKDc23b3sc5M1t1LFPNmK1sNL65n"
          />
        </div>
      </div>
      <div style={{ margin: "4em" }}>
        <img
          height="380px"
          width="100%"
          alt="-"
          src="https://gateway.pinata.cloud/ipfs/QmNx8fLicWR6MHjQRmzguD2k4RMazTfCBDy3m7RsCRQpAN"
        />
      </div>
    </div>
  );
};

export default GrantMain;
