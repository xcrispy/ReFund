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
import CheckOutModal from "../components/Modal/Modal";
import PacmanLoader from "react-spinners/PacmanLoader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MDBIcon } from "mdb-react-ui-kit";

const Child = ({ amount, setAmount }) => {
  return (
    <div style={{ paddingBottom: "2em" }} className="TheCheckoutInput">
      <InputGroup>
        <Form.Control
          value={amount}
          onChange={(e) => {
            const re = /^\d*(\.)?(\d{0,10})?$/;
            if (e.target.value === "" || re.test(e.target.value)) {
              setAmount(e.target.value);
            }
          }}
          style={{ width: "100%", border: "2px solid #717171" }}
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
  const ReFundAddress = "0x1101ccc32B66e0cCC2B555Aa7aAD1227Ab030722";
  const ReFundABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "token_address",
          type: "address",
        },
        {
          internalType: "address[]",
          name: "donation_addresses",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "donation_amount",
          type: "uint256[]",
        },
      ],
      name: "batchDonate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "donator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "token_address",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "donation_addresses",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "donation_amount",
          type: "uint256[]",
        },
      ],
      name: "BatchDonated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "donator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "token_address",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "donation_addresses",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "donation_amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "donated_token_decimal",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "donated_token_symbol",
          type: "string",
        },
      ],
      name: "Donated",
      type: "event",
    },
  ];
  const [tokenName, setTokenName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const { addToCart, cartItems, initialState, donationAddress } = useCart();
  const [expanded, setExpanded] = React.useState("");
  const [showCopy1, setShowCopy1] = React.useState(false);
  const [showCopy2, setShowCopy2] = React.useState(false);
  const [grantDonationAmount, setGrantDonationAmount] = useState();
  const [showCopy3, setShowCopy3] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [Addresss, setAddress] = React.useState([]);
  const [showWaiting, setShowWaiting] = useState();

  const [error, setError] = useState("");

  const [approveState, setApproveState] = React.useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  let navigate = useNavigate();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
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
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#0C6DFD" : "#0C6DFD",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
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
  function formatToCommas(x) {
    if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
  const Approve = async () => {
    const ERC20Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
    try {
      const tokenApprove = await ERC20Contract.approve(
        ReFundAddress,
        ethers.utils.parseUnits(
          checked
            ? "10000000000000"
            : (Number(grantDonationAmount) + 1).toString(),
          18
        )
      );
      const tx = await tokenApprove.wait();
      addRecentTransaction({
        hash: tx.transactionHash,
        description: `Approved ${tokenName}`,
      });

      setShowWaiting(false);
    } catch (e) {
      setLoadingTx(false);
      console.log(e.message);
    }
  };

  const checkAllowance = async () => {
    const ERC20Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
    const tokenAllowance = await ERC20Contract.allowance(
      address,
      ReFundAddress
    );
    setApproveState(
      Number(tokenAllowance.toString()) > Number(grantDonationAmount)
    );
  };

  const batchDonate = async (_amount) => {
    const ReFundContract = new ethers.Contract(
      ReFundAddress,
      ReFundABI,
      signer
    );
    console.log(ReFundContract);
    try {
      const BatchDonate = await ReFundContract.batchDonate(
        tokenAddress,
        Addresss,
        _amount
      );
      setShowWaiting(false);
      setShowConfirm(true);
      const tx = await BatchDonate.wait();
      addRecentTransaction({
        hash: tx.transactionHash,
        description: `batchDonated ${formatToCommas(
          grantDonationAmount
        )} ${tokenName} to  ${items.length} grants`,
      });

      setTimeout(clearRefresh(), 5000);
    } catch (e) {
      setLoadingTx(false);
      console.log(e.message);
    }
  };

  const clearRefresh = () => {
    localStorage.removeItem("RefundcartItems");
    window.location.reload();
    setShowConfirm(false);
  };

  useEffect(() => {
    if (tokenAddress) {
      checkAllowance();
    }
  });
  useEffect(() => {
    if (items.length > 0) {
      test();
    }
  });

  useEffect(() => {
    if (items.length > 0) {
      getTotalAmount();
      if (tokenName) {
        setError("");
      }

      if (checked) {
      }
    }
  });
  const getTotalAmount = () => {
    let valueAdded = 0;
    for (let i = 0; i < items.length; i++) {
      valueAdded += Number(items[i].value);
    }
    setGrantDonationAmount(valueAdded);
  };

  useEffect(() => {
    const loadMoralis = async () => {
      await Moralis.start({
        appId: process.env.REACT_APP_APPLICATION_ID,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
    };
    loadMoralis();
  }, []);

  const [items, setItems] = useState(initialState);
  const [loadingTx, setLoadingTx] = useState(true);

  const test = async () => {
    let Address = [];
    for (let i = 0; i < cartItems.length; i++) {
      const GrantTestData = Moralis.Object.extend("GrantTestData");
      const grantTestData = new GrantTestData();
      const grantTestDataquery = new Moralis.Query(grantTestData);
      grantTestDataquery.equalTo("grantId", cartItems[i]);
      const idQuery = await grantTestDataquery.find();
      //console.log(idQuery[0].attributes.grantDonationAddress);
      Address.push(idQuery[0].attributes.grantDonationAddress);
    }
    setAddress(Address);
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
    setShow(true);
    let Amount = [];

    for (let i = 0; i < items.length; i++) {
      const sentvalue = ethers.utils.parseUnits(items[i].value.toString(), 18);
      Amount.push(sentvalue);
    }
    batchDonate(Amount);
  };

  const [checked, setChecked] = useState(true);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    console.log(event.target.checked);
  };

  return (
    <div>
      <div className="grantCheckoutDiv">
        <div className="inputAndAmount">
          <div>
            {cartItems.map((cartItem) => {
              return (
                <div key={cartItem}>
                  <GrantCheckoutBar grantId={cartItem} />
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
                  onClick={test}
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
              <Tooltip
                title="Approve donation amount or max"
                placement="top-start"
              >
                <FormControlLabel
                  style={{ float: "right" }}
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={checked}
                      onChange={switchHandler}
                    />
                  }
                  label="Max"
                />
              </Tooltip>
              <div className="approveandcheckout">
                <Button
                  disabled={approveState ? true : false}
                  className="buttoncheckout"
                  variant="primary"
                  onClick={() => {
                    if (tokenName) {
                      setShowWaiting(true);
                      setLoadingTx(true);
                      Approve();
                    } else {
                      setError("Token has not been selected");
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  disabled={!approveState ? true : false}
                  className="buttoncheckout"
                  onClick={() => {
                    if (tokenName) {
                      setShow(true);
                    } else {
                      setError("Token has not been selected");
                    }
                  }}
                  variant="primary"
                >
                  Polygon Checkout
                </Button>
                <span style={{ color: "red" }}>{error}</span>
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
                <p />
                <Typography>
                  <span className="grantViewAddressEdit">
                    <MDBIcon fas icon="link" />

                    <a
                      href="https://frac-tion.vercel.app/faucet"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get test FRACT here
                    </a>
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <CheckOutModal show={show} onHide={() => setShow(false)}>
              <div
                style={{
                  padding: "2em 0.7em",
                  display: "flex",
                  alignItems: "center",
                  gap: "1em",
                }}
              >
                <img
                  width="70px"
                  height="55px"
                  src="https://gateway.pinata.cloud/ipfs/QmaW6MPtnwvBXb59j8Wyec68D38x1ZP3bajJ4fq98GR86F"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.1em",
                  }}
                >
                  <span style={{ fontSize: "17px" }}>
                    Donating to {items.length} grants
                  </span>
                  <span style={{ fontSize: "15px" }}>
                    Total: {formatToCommas(grantDonationAmount)} {tokenName}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  className="buttoncheckout"
                  onClick={() => {
                    collectALlItmes();
                    setShowWaiting(true);
                    setLoadingTx(true);
                    setShow(false);
                  }}
                  variant="primary"
                >
                  Confirm Polygon Checkout
                </Button>
              </div>
            </CheckOutModal>
            <CheckOutModal
              show={showWaiting}
              onHide={() => setShowWaiting(false)}
            >
              {loadingTx ? (
                <div
                  style={{
                    padding: "2em 2em",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2.5em",
                  }}
                >
                  <PacmanLoader color="rgb(12,109,253)" />
                  <div>
                    <span style={{ fontSize: "17px" }}>
                      Waiting for confirmation
                    </span>
                    <br />
                    <br />
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>
                      Confirm this transaction in your wallet
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1em",
                  }}
                >
                  <WarningAmberIcon sx={{ width: "70px", height: "70px" }} />

                  <span>Transaction rejected</span>
                  <Button
                    className="buttoncheckout"
                    onClick={() => {
                      setShowWaiting(false);
                    }}
                    variant="primary"
                  >
                    Close
                  </Button>
                </div>
              )}
            </CheckOutModal>
            <CheckOutModal
              show={showConfirm}
              onHide={() => setShowConfirm(false)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1em",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ width: "70px", height: "70px" }}
                />

                <span>Successfully Donated</span>
                <span>This page will refresh in 5 secs </span>
                <Button
                  className="buttoncheckout"
                  onClick={() => {
                    setShowWaiting(false);
                    setShowConfirm(false);
                    clearRefresh();
                  }}
                  variant="primary"
                >
                  Confirm
                </Button>
              </div>
            </CheckOutModal>
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
