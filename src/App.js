import { Navbar, Nav, Button, Container, Card } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Grants } from "./pages/Grants";
import { CreateGrant } from "./pages/CreateGrant";
import { CartCheckout } from "./pages/CartCheckout";
import { Account } from "./pages/Accounts";
import { GrantView } from "./pages/GrantView";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Dropdown from "react-bootstrap/Dropdown";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { useCart } from "./context/CartContext";
import Moralis from "moralis-v1";
import GrantMain from "./pages/GrantMain";

function App() {
  const [dataId, setDataId] = useState(false);
  const { address, isConnected } = useAccount();
  let navigate = useNavigate();
  const { cartItems } = useCart();

  useEffect(() => {
    loadMoralis();
  }, []);
  const loadMoralis = async () => {
    await Moralis.start({
      appId: process.env.REACT_APP_APPLICATION_ID,
      serverUrl: process.env.REACT_APP_SERVER_URL,
    });
  };

  return (
    <>
      <Navbar
        sticky="top"
        expand="lg"
        bg="primary"
        className="navbar"
        variant="dark"
      >
        <Container>
          <Navbar.Brand className="navheading grantslink">
            <img
              src="https://gateway.pinata.cloud/ipfs/QmUtUn4yWadrd2aaXRpMfmRHQeGFhvSd8XRbRCEJs4bpsz"
              width="40"
              height="40"
              className="rotateImg"
              alt=""
            />
            ReFund
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="toggle"
          />
          <Navbar.Collapse
            style={{ outline: "none", boxShadow: "none" }}
            id="responsive-navbar-nav"
          >
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/grants">
                Grants
              </Nav.Link>
            </Nav>

            <Nav>
              {isConnected ? (
                <>
                  <Nav.Link
                    style={{ marginRight: "50px" }}
                    as={Link}
                    to="/grants/cart"
                  >
                    <Badge badgeContent={cartItems?.length} color="primary">
                      <AddShoppingCartIcon />
                    </Badge>
                    CART
                  </Nav.Link>

                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      Account
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          navigate(`/${address}`);
                        }}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          navigate("/grants/explorer");
                        }}
                      >
                        Grants Explorer
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : null}

              <ConnectButton
                showBalance={false}
                chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" exact element={<GrantMain />} />
        <Route path="/grants/explorer" element={<Grants />} />
        <Route
          path="/grants/:id_grant/:grant_name_url"
          element={<GrantView />}
        />
        <Route path="/grants/new" element={<CreateGrant />} />
        <Route path="/grants" element={<GrantMain />} />
        <Route path="/:account_address" element={<Account />} />
        <Route path="/grants/cart" element={<CartCheckout />} />
      </Routes>
    </>
  );
}

export default App;
