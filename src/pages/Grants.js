import React, { useState, useEffect } from "react";
import { GrantBoxView } from "../components/GrantBoxView/GrantBoxView";
import "./styles/Grants.scss";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Moralis from "moralis-v1";
import { useMoralis } from "react-moralis";
import { ShimmerThumbnail } from "react-shimmer-effects";

export const Grants = () => {
  const [mappedDB, setMappedDB] = useState();
  const { isInitialized } = useMoralis();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    // loadData();
    if (isInitialized) {
      const id = setInterval(() => loadData(), 1500);
      return () => clearInterval(id);
    }
  });
  const loadData = async () => {
    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    const grantTestDataquery = new Moralis.Query(grantTestData);
    const dataQuery = await grantTestDataquery.find();
    setMappedDB(dataQuery);
    console.log(dataQuery);
  };

  return (
    <div className="marginalBorder">
      {mappedDB ? (
        <Box sx={{ flexGrow: 2, padding: "2em" }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3, sm: 4 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {mappedDB &&
              mappedDB.map((db) => {
                if (db.attributes.grantIsActive === false) return;
                console.log(db.attributes);
                return (
                  <Grid item xs={4} sm={4} md={4} key={db.id}>
                    <Item>
                      <GrantBoxView
                        grantId={db.attributes.grantId}
                        grant_banner={db.attributes.grantBanner}
                        grant_description={
                          db.attributes.grantDescription.richtext
                        }
                        last_updated={new Date(
                          db.attributes.updatedAt
                        ).toDateString()}
                        //grant_donation_address={testd.donation_address}
                        grant_name_url={db.attributes.grantRouteName}
                        grant_name={db.attributes.grantName}
                        grant_owner_address={db.attributes.grantOwnerAddress}
                      />
                    </Item>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      ) : (
        <>
          <div style={{ padding: "2em" }}>
            <ShimmerThumbnail height={550} width={250} rounded />
          </div>
        </>
      )}
    </div>
  );
};
