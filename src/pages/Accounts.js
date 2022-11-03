import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const Account = () => {
  const { account_address } = useParams();
  useEffect(() => {
    if(account_address.length === 42){

    window.location.replace(
      `https://mumbai.polygonscan.com/address/${account_address}`
    );
          
  }
  });
  return (<div>
    {account_address.length !== 42 ?
     <div>
    <h1>404</h1>
    </div> 
    : null}
  </div>)
};
