import React, { useState, useEffect } from "react";
import styles from "./GrantBoxView.module.scss";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getEllipsisTxt } from "../../pages/Extra";

export const GrantBoxView = ({
  clickFunction,
  grantId,
  grant_name,
  grant_banner,
  grant_donation_address,
  grant_name_url,
  grant_owner_address,
  grant_description,
  last_updated,
}) => {
  let navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  return (
    <div>
      <div className={styles.BorderDiv}>
        <Card.Img
          onClick={() => {
            navigate(`/grants/${grantId}/${grant_name_url}`);
          }}
          variant="top"
          src={grant_banner}
        />

        <div className={styles.Content}>
          <div
            onClick={() => {
              navigate(`/grants/${grantId}/${grant_name_url}`);
            }}
          >
            <br />
            <h3>
              {grant_name.length > 16
                ? grant_name.slice(0, 15) + "..."
                : grant_name}
            </h3>
            <span className={styles.BorderDivSpan}>
              by {getEllipsisTxt(grant_owner_address, 5)}
            </span>
            <div className="line"></div>
            <div>
              {grant_description
                ? grant_description.slice(0, 70)
                : grant_description}
            </div>
            <div style={{ marginTop: "6px" }}>
              <span className={styles.lastUpdate}>
                last updated : {last_updated}
              </span>
            </div>
            <div
              onClick={() => {
                navigate(`/grants/${grantId}/${grant_name_url}`);
              }}
              className="line"
            ></div>
          </div>
          {cartItems.includes(grantId) ? (
            <Button
              className={styles.ButtonFix}
              onClick={() => {
                addToCart(grantId);
              }}
              variant="outline-danger"
            >
              - Remove from Cart
            </Button>
          ) : (
            <Button
              className={styles.ButtonFix}
              onClick={() => {
                addToCart(grantId);
              }}
              variant="primary"
            >
              + Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
