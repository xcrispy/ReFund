import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const Account = () => {
  const { account_address } = useParams();
  useEffect(() => {
    window.location.replace(
      `https://mumbai.polygonscan.com/address/${account_address}`
    );
  });
  return <div></div>;
};
