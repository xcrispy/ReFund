import React, { useEffect, useState } from "react";
import styles from "./GrantCheckoutBar.module.scss";
import { useCart } from "../../context/CartContext";
import { useMoralis } from "react-moralis";
import Moralis from "moralis-v1";
import { ShimmerCategoryItem } from "react-shimmer-effects";

export const GrantCheckoutBar = ({ grantId, amount, setAmount, show }) => {
  const [grantDonationAmount, setGrantDonationAmount] = useState();
  const { addToCart, cartItems, setAddressOfCartItems, addressOfCartItems } =
    useCart();

  const [data, setData] = useState();
  const { isInitialized } = useMoralis();

  useEffect(() => {
    // loadData();
    if (isInitialized) {
      const id = setInterval(() => QueryData(), 1500);
      return () => clearInterval(id);
    }
  });

  const QueryData = async () => {
    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    const grantTestDataquery = new Moralis.Query(grantTestData);
    const dataQuery = await grantTestDataquery.find();

    if (dataQuery.length < Number(grantId)) return;

    grantTestDataquery.equalTo("grantId", grantId);
    const idQuery = await grantTestDataquery.find();
    setData(idQuery[0]);
  };
  /*
  constructor(props) {
    super(props);
    this.state = { objects: {} };
   }
   
   */
  /*const handleChange = (index, event) => {
    setGrantDonationAmount((state) => {
      const newObject = { ...state.amount };
      newObject[`${index}`] = { amount: event.target.value, key: index };
      amountbox(grantDonationAmount);
      return { grantDonationAmount: newObject };
    });
    console.log(grantDonationAmount);
  };

  const updateState = (index, e) => {
    const DonationAmount = grantDonationAmount.map((item) => {
      if (index === grantId) {
        return { ...item, amount: e.target.value };
      } else {
        return item;
      }
    });
    setGrantDonationAmount(DonationAmount);
    console.log(grantDonationAmount);
  };

  const handleUpdate = (id, e) => {
    const { value } = e.target;
    setGrantDonationAmount((amounts) => {
      grantDonationAmount?.map((list, index) =>
        index === id ? { ...list, amount: value } : list
      );
    });

    console.log(grantDonationAmount);
  };
*/
  if (show === true) {
    setAddressOfCartItems([...addressOfCartItems, grantDonationAmount]);
    console.log(addressOfCartItems);
  }
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
              onClick={() => {
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
