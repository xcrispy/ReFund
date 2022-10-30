import React, { useEffect, useState } from "react";
import styles from "./GrantCheckoutBar.module.scss";
import { useCart } from "../../context/CartContext";
import { useMoralis } from "react-moralis";
import Moralis from "moralis-v1";
import { ShimmerCategoryItem } from "react-shimmer-effects";
import { useNavigate } from "react-router-dom";

export const GrantCheckoutBar = ({ grantId }) => {
  const { addToCart } = useCart();
  let navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    localStorage.setItem("testValue", +1);
    const loadMoralis = async () => {
      await Moralis.start({
        appId: process.env.REACT_APP_APPLICATION_ID,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
    };
    loadMoralis();
    QueryData();
  }, []);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const QueryData = async () => {
    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    const grantTestDataquery = new Moralis.Query(grantTestData);
    grantTestDataquery.equalTo("grantId", grantId);
    const idQuery = await grantTestDataquery.find();
    setData(idQuery[0]);
  };
  return (
    <div>
      {data ? (
        <div className={styles.checkoutouterdiv}>
          <div className={styles.imageandname}>
            <img width={160} height={100} src={data.attributes.grantBanner} />
            <h3 className={styles.Name}>{data.attributes.grantName}</h3>
          </div>
          <div className={styles.amoutnandclose}>
            <span
              onClick={async () => {
                window.location.reload();
                addToCart(grantId);
              }}
              style={{
                cursor: "pointer",
                fontSize: "30px",
              }}
            >
              &times;
            </span>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              padding: "1em 3em",
              width: "440px",
              height: "fit-content",
            }}
          >
            <ShimmerCategoryItem
              style={{ padding: "2em" }}
              hasImage
              imageType="thumbnail"
              imageWidth={100}
              imageHeight={100}
              title={true}
            />
          </div>
        </>
      )}
    </div>
  );
};
