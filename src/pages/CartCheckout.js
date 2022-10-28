import React, { useState, useEffect } from "react";
import { GrantCheckoutBar } from "../components/GrantCheckoutBar/GrantCheckoutBar";
import "./styles/CartCheckout.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { copyToClipboard } from "./Extra";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSigner, useAccount } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import { erc20ABI } from "wagmi";
import Moralis from "moralis-v1";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export const ReFundAddress = "";
export const ReFundABI = "";

const Child = ({ amount, setAmount }) => {
  return (
    <div className="TheCheckoutInput">
      <InputGroup>
        <Form.Control
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%" }}
          className="grantCheckOutInput"
          placeholder="Amount"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
    </div>
  );
};

export const CartCheckout = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const { addToCart, cartItems, initialState } = useCart();
  const [expanded, setExpanded] = React.useState("");
  const [showCopy1, setShowCopy1] = React.useState(false);
  const [showCopy2, setShowCopy2] = React.useState(false);
  const [showCopy3, setShowCopy3] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const [approveState, setApproveState] = React.useState(true);

  let navigate = useNavigate();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));
  const handleTokenChange = (token_address, name) => {
    setTokenName(name);
    setTokenAddress(token_address);
  };

  const handleShowCopy = async (point) => {
    if (point === "2") {
      setShowCopy2(false);
      setShowCopy3(false);
      setShowCopy1(true);
      setTimeout(() => setShowCopy1(false), 3000);
    } else if (point === "1") {
      setShowCopy1(false);
      setShowCopy3(false);
      setShowCopy2(true);
      setTimeout(() => setShowCopy2(false), 3000);
    } else if (point === "3") {
      setShowCopy1(false);
      setShowCopy2(false);
      setShowCopy3(true);
      setTimeout(() => setShowCopy3(false), 3000);
    }
  };

  const handleInputChange = (value) => {};

  const { config, error, isError } = usePrepareContractWrite({
    address: ReFundAddress,
    chainId: 80001,
    abi: ReFundABI,
    functionName: "batchDonate",
    args: [],
  });
  const { data, write } = useContractWrite(config);

  const Approve = async () => {
    const ERC20Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
    const tokenApprove = await ERC20Contract.approve(
      ReFundAddress,
      "1000000000000000000000000000000000000000"
    );
    console.log(tokenApprove.wait(5));
  };

  const checkAllowance = async () => {
    const ERC20Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
    const tokenAllowance = await ERC20Contract.allowance(
      address,
      ReFundAddress
    );
    setApproveState(tokenAllowance > 100000000);
    console.log(approveState);
  };

  useEffect(() => {
    checkAllowance();
  }, [tokenAddress]);

  const [items, setItems] = useState(initialState);
  const [dataInfo, setDataInfo] = useState();

  const QueryData = async (grant_id) => {
    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    const grantTestDataquery = new Moralis.Query(grantTestData);
    const dataQuery = await grantTestDataquery.find();

    if (dataQuery.length < Number(grant_id)) return;

    grantTestDataquery.equalTo("grantId", grant_id);
    const idQuery = await grantTestDataquery.find();
    console.log(idQuery[0]);
    return idQuery[0].attributes.grantDonationAddress;
  };

  const setAmount = (id) => (amount) =>
    setItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              value: amount,
            }
          : item
      )
    );

  const collectALlItmes = () => {
    let Amount = [];
    for (let i = 0; i < items.length; i++) {
      const sentvalue = ethers.utils.parseUnits(items[i].value.toString(), 18);
      Amount.push(sentvalue);
    }
    console.log(Amount);
  };

  return (
    <div>
      <div className="grantCheckoutDiv">
        <div className="inputAndAmount">
          <div>
            {cartItems.map((cartItem) => {
              return (
                <div key={cartItem}>
                  <GrantCheckoutBar grantId={cartItem} show={show} />
                </div>
              );
            })}
          </div>
          <div>
            {items.map((item) => {
              return (
                <Child
                  key={items.id}
                  amount={item.value}
                  setAmount={setAmount(item.id)}
                />
              );
            })}
          </div>
        </div>
        {cartItems.length > 0 ? (
          <div className="checkoutsection">
            <div className="checkoutsectionOnly">
              <h3>Checkout</h3>
              <div className="line"></div>
              <div className="displayandflexlol">
                <span>Token Selection:</span>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={!tokenName ? "Select Token" : tokenName}
                >
                  <Dropdown.Item
                    onClick={() => {
                      handleTokenChange(
                        "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
                        "USDC"
                      );
                    }}
                  >
                    USDC
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      handleTokenChange(
                        "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
                        "DAI"
                      );
                    }}
                  >
                    DAI
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      handleTokenChange(
                        "0x953f88014255241332d8841C34921572db112D65",
                        "FRACT"
                      );
                    }}
                  >
                    FRACT
                  </Dropdown.Item>
                </DropdownButton>
              </div>
              <br />
              <div className="extratext">
                you are donating : 200 {tokenName}
              </div>

              <br />
              <div className="approveandcheckout">
                <button
                  onClick={() => {
                    collectALlItmes();
                    console.log(items);
                  }}
                >
                  Value
                </button>
                {approveState ? (
                  <Button variant="primary" onClick={Approve}>
                    Approve
                  </Button>
                ) : null}
                <Button
                  onClick={() => {
                    setShow(true);
                  }}
                  variant="primary"
                >
                  Checkout
                </Button>
              </div>
            </div>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Token Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span>USDC:</span>
                  &nbsp;&nbsp;&nbsp;0x2058A...e5FCbaA7e&nbsp;
                  <ContentCopyIcon
                    onClick={() => {
                      copyToClipboard(
                        "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"
                      );
                      handleShowCopy("3");
                    }}
                    className="copybutton"
                  />
                  &nbsp;
                  {showCopy3 ? <Badge bg="secondary">copied</Badge> : null}
                </Typography>
                <p></p>
                <Typography>
                  <span>DAI:</span>
                  &nbsp;&nbsp;&nbsp;0x001B3B4...B1B7b6F&nbsp;&nbsp;
                  <ContentCopyIcon
                    onClick={() => {
                      copyToClipboard(
                        "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F"
                      );
                      handleShowCopy("1");
                    }}
                    className="copybutton"
                  />
                  &nbsp;{" "}
                  {showCopy2 ? <Badge bg="secondary">copied</Badge> : null}
                </Typography>
                <p />
                <Typography>
                  <span>FRACT:</span>
                  &nbsp;&nbsp;&nbsp;0x953f88...db112D65&nbsp;&nbsp;
                  <ContentCopyIcon
                    onClick={() => {
                      copyToClipboard(
                        "0x953f88014255241332d8841C34921572db112D65"
                      );
                      handleShowCopy("2");
                    }}
                    className="copybutton"
                  />{" "}
                  &nbsp;{" "}
                  {showCopy1 ? <Badge bg="secondary">copied</Badge> : null}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        ) : (
          <div>
            <div>
              <h2>Your Grant Cart is currently empty</h2>
              <h4>Support and fund open-source projects built on polygon.</h4>

              <Button
                onClick={() => {
                  navigate(`/grants/explorer`);
                }}
                variant="primary"
              >
                Explore Projects
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
