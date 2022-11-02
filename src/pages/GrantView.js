import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./styles/GrantView.scss";
import ReportIcon from "@mui/icons-material/Report";
import HelpIcon from "@mui/icons-material/Help";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import TeamBar from "../components/TeamBar/TeamBar";
import Moralis from "moralis-v1";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "./Extra";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useCart } from "../context/CartContext";
import { Chip } from "@mui/material";
import { copyToClipboard } from "./Extra";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAccount } from "wagmi";
import { MDBIcon } from "mdb-react-ui-kit";
import { Badge } from "react-bootstrap";
import { ShimmerPostDetails } from "react-shimmer-effects";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import RichTextEditor from "../RichTextEditor";
import * as Joi from "joi-browser";
import { Formik, Field, Form as FormikForm, useFormikContext } from "formik";
import { RegisterSchema1 } from "../Validation";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "antd/dist/antd.css";
import { ReviewGrant } from "../components/ReviewGrant/ReviewGrant";
import PreviewBar from "../components/PreviewBar/PreviewBar";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import CheckOutModal from "../components/Modal/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const GrantView = () => {
  const { id_grant, grant_name_url } = useParams();
  const [data, setData] = useState();
  const { cartItems, addToCart } = useCart();
  const { address, isConnected } = useAccount();
  const [show, setShow] = useState(false);

  const [grantName, setGrantName] = useState("");
  const [grantDescription, setGrantDescription] = useState("");
  const [grantBanner, setGrantBanner] = useState("");
  const [grantGithubURL, setGrantGithubURL] = useState("");
  const [grantWebsite, setGrantWebsite] = useState("");
  const [grantTwitterHandle, setGrantTwitterHandle] = useState("");

  const [imageBanner, setImageBanner] = useState("");
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);

  const FormObserver = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      setGrantDescription(values);
    }, [values]);

    return null;
  };

  const saveEdit = async () => {
    if (!isConnected) return;
    if (
      !grantName ||
      !grantDescription ||
      !grantWebsite ||
      !grantGithubURL ||
      !grantTwitterHandle
    ) {
      console.log("some stuffs are invalid");
    }

    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    // set data
    const grantTestDataquery = new Moralis.Query(grantTestData);
    grantTestDataquery.equalTo("grantId", id_grant);
    const idQuery = await grantTestDataquery.find();

    idQuery[0].set("grantName", grantName);
    const routeName = grantName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 18);
    idQuery[0].set("grantRouteName", routeName);
    setShowSuccess(true);
    idQuery[0].set("grantDescription", grantDescription);
    idQuery[0].set("grantBanner", grantBanner);
    idQuery[0].set("grantGithubURL", grantGithubURL);

    idQuery[0].set("grantWebsite", grantWebsite);
    idQuery[0].set("grantTwitterHandle", grantTwitterHandle);

    /*
    grantTestData.set("grantName", grantName);
    const routeName = grantName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 18);
    grantTestData.set("grantRouteName", routeName);
    setShowSuccess(true);
    grantTestData.set("grantDescription", grantDescription);
    grantTestData.set("grantBanner", grantBanner);
    grantTestData.set("grantGithubURL", grantGithubURL);

    grantTestData.set("grantWebsite", grantWebsite);
    grantTestData.set("grantTwitterHandle", grantTwitterHandle);
    */
    idQuery[0].save().then(
      (grantTestData) => {
        // Execute any logic that should take place after the object is saved.
        console.log("object edited with objectId: " + grantTestData.id);
        window.location.reload();
      },
      (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  };

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);

    reader.onload = () => {
      setImageBanner(reader.result);
      setGrantBanner(reader.result);
      console.log("successfully uploaded image"); //base64encoded string
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };

    // console.log(imageBanner);
  };
  const handleOndragOver = (event) => {
    event.preventDefault();
  };
  const handleOndrop = (event) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation(); //let's grab the image file
    const fileUploaded = event.dataTransfer.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);

    reader.onload = () => {
      setImageBanner(reader.result);
      setGrantBanner(reader.result);
      console.log("Sucessfully uploaded image"); //base64encoded string
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  useEffect(() => {
    const loadMoralis = async () => {
      await Moralis.start({
        appId: process.env.REACT_APP_APPLICATION_ID,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
    };
    loadMoralis();
    QueryData();
  }, []);
  const QueryData = async () => {
    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    const grantTestDataquery = new Moralis.Query(grantTestData);
    grantTestDataquery.equalTo("grantId", id_grant);
    const idQuery = await grantTestDataquery.find();
    setData(idQuery[0]);
    setGrantName(idQuery[0].attributes.grantName);
    setGrantDescription(idQuery[0].attributes.grantDescription);
    setGrantBanner(idQuery[0].attributes.grantBanner);
    setGrantGithubURL(idQuery[0].attributes.grantGithubURL);
    setGrantWebsite(idQuery[0].attributes.grantWebsite);
    setGrantTwitterHandle(idQuery[0].attributes.grantTwitterHandle);
    /*
    setGrantName(data.attributes.grantName);
    setGrantDescription(data.attributes.grantDescription.richtext);
    setGrantBanner(data.attributes.grantBanner);
    setGrantGithubURL(data.attributes.grantGithubURL);
    setGrantWebsite(data.attributes.grantWebsite);
    setGrantTwitterHandle(data.attributes.grantTwitterHandle);
    */
  };

  const [grantOwner, setGrantowner] = useState(false);
  const [teamMember, setTeamMember] = useState(false);
  useEffect(() => {
    CanEdit();
  }, [address]);
  const CanEdit = () => {
    if (data) {
      for (let i = 0; i < data.attributes.grantTeamMembers.length; i++) {
      //  console.log(data.attributes.grantTeamMembers[i].team_member_address);
        if (
          data.attributes.grantTeamMembers[i].team_member_address === address
        ) {
          setTeamMember(true);
         // console.log(data.attributes.grantTeamMembers[i].team_member_address);
         // console.log("found team");
          break;
        }

        if (address === data.attributes.grantOwnerAddress) {
          setGrantowner(true);
        } else {
          setGrantowner(false);
        }
      }
    }
  };
  return (
    <>
      {data ? (
        <div>
          <div style={{}}>
            <img
              alt=""
              width="100%x"
              height="400px"
              src={data.attributes.grantBanner}
            />
          </div>
          <div className={"GrantBody"}>
            <div className="GrantTittleandAbout">
              <h2 className="GrantNameHeader">{data.attributes.grantName}</h2>
              {data.attributes.grantProjectTag.map((tag, index) => (
                <Chip style={{ margin: "2px" }} key={index} label={tag} />
              ))}

              <div className="line"></div>
              <div className="socialDetails">
                <div>
                  <span className="grantViewAddressEdit">
                    <MDBIcon fas icon="link" />

                    <a
                      href={data.attributes.grantWebsite}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.attributes.grantWebsite}
                    </a>
                  </span>
                  <span className="grantViewAddressEdit">
                    <MDBIcon fab icon="twitter" />

                    <a
                      href={
                        "https://twitter.com/" +
                        data.attributes.grantTwitterHandle
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.attributes.grantTwitterHandle}
                    </a>
                  </span>

                  <span className="grantViewAddressEdit">
                    <MDBIcon fas icon="clock" />
                    <span>
                      Updated
                      {new Date(data.attributes.createdAt).toDateString()}
                    </span>
                  </span>
                </div>
                <div>
                  <div>
                    <span className="grantViewAddressEdit">
                      <MDBIcon fas icon="hand-holding-usd" />

                      <a
                        href={
                          "https://mumbai.polygonscan/account" +
                          data.attributes.grantDonationAddress
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {getEllipsisTxt(
                          data.attributes.grantDonationAddress,
                          5
                        )}
                      </a>

                      <ContentCopyIcon
                        width={1}
                        height={1}
                        onClick={() =>
                          copyToClipboard(data.attributes.grantDonationAddress)
                        }
                        className="ContentCopyIcon"
                      />
                      <Badge pill bg="primary">
                        polygon
                      </Badge>
                    </span>
                  </div>
                  <span>
                    {" "}
                    <MDBIcon fas icon="code-branch" />
                    &nbsp;
                    <a
                      href={data.attributes.grantGithubURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.attributes.grantGithubURL}
                    </a>
                  </span>
                </div>
              </div>
              <div className="line"></div>
              <h3>Estimated lifetime funding received</h3>
              <h2>~$0</h2>
              <span>
                This number should not be used for accounting purposes.
              </span>
              <br />
              <br />
              <div className="line"></div>
              <h3>About </h3>
              <div className="About">
                <ReactQuill
                  value={data.attributes.grantDescription.richtext}
                  readOnly={true}
                  theme={"bubble"}
                />
              </div>
            </div>
            <div className="test  CartandTeamHeader">
              {address === data.attributes.grantOwnerAddress ? (
                <div className="EditGrant">
                  <span className="progressTextEdit">
                    <DriveFileRenameOutlineIcon /> Keep your grant up to date
                  </span>
                  <br />
                  <p className="progressText">
                    Let your grant contributors know about your project and
                    progress.
                  </p>

                  <Button
                    onClick={() => [setShow(true)]}
                    className="Addtocartbtn"
                  >
                    Edit Grant
                  </Button>
                </div>
              ) : null}
              <div className="CartandTeam">
                <div className="rateproject">
                  <div className="upvotessection">
                    <ThumbUpIcon sx={{ fontSize: 65 }} />
                    <br />
                    <span>0</span>
                  </div>
                  <div className="downvotessection">
                    <ThumbDownIcon sx={{ fontSize: 65 }} />
                    <br />
                    <span>0</span>
                  </div>
                </div>
                {data.attributes.grantIsActive ? (
                  <>
                    {cartItems.includes(id_grant) ? (
                      <Button
                        className="Addtocartbtn"
                        onClick={() => {
                          addToCart(id_grant);
                        }}
                        variant="outline-danger"
                      >
                        Remove from Cart
                      </Button>
                    ) : (
                      <Button
                        className="Addtocartbtn"
                        onClick={() => {
                          addToCart(id_grant);
                        }}
                        variant="primary"
                      >
                        Add to Cart
                      </Button>
                    )}
                  </>
                ) : null}
              </div>
              <div className="displayflexalign">
                <Tooltip
                  title="only projects on polygon blockchain are currently allowed"
                  placement="right-end"
                >
                  <span style={{ cursor: "pointer" }}>
                    <HelpIcon /> rules
                  </span>
                </Tooltip>
                <Tooltip
                  title="create an issue in the project github"
                  placement="right-end"
                >
                  <span style={{ cursor: "pointer" }}>
                    <ReportIcon /> report
                  </span>
                </Tooltip>
              </div>
              <h3>Team</h3>
              <div>
                <TeamBar address={data.attributes.grantOwnerAddress} />
                {data.attributes.grantTeamMembers.map((team_member, index) => {
                  // console.log(team_member);
                  if (team_member.team_member_address.length < 40) return;
                  return (
                    <TeamBar
                      key={index}
                      address={team_member.team_member_address}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <PreviewBar show={show}>
            <div style={{ padding: "0em 2em", paddingBottom: "3em" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <h4 className="GrantDetailsHeader">Grant Details</h4>
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShow(false);
                  }}
                />
              </div>

              <div className="TitleField">
                <div className="displayFlex">
                  <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                    Title
                  </Typography>
                </div>
                <InputGroup className="mb-3">
                  <Form.Control
                    spellCheck={false}
                    value={grantName}
                    onChange={(e) => setGrantName(e.target.value)}
                    className="removeBoxShadow"
                    placeholder="My Grant Title"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </div>

              <div className="TitleField">
                <div className="displayFlex">
                  <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                    Project Description
                  </Typography>
                </div>
                <div className="editor">
                  <Formik
                    initialValues={{
                      richtext: grantDescription.richtext,
                    }}
                    validationSchema={RegisterSchema1}
                    onSubmit={(values, { setSubmitting }) => {
                      //  console.log("what I am submitting is: ", values);
                      setTimeout(() => {
                        //  alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                      }, 300);
                    }}
                  >
                    {({ isSubmitting, isValid, setFieldValue }) => {
                      return (
                        <>
                          <FormikForm>
                            <FormObserver />
                            <Field name="richtext">
                              {({ field, form }) => (
                                <div
                                  className="text-editor"
                                  style={{
                                    margin: "auto 0px",
                                    height: "fit-content",
                                  }}
                                >
                                  <RichTextEditor
                                    placeholder="Give a detailed description about your Grant"
                                    name="richtext"
                                    field={field}
                                  />
                                  {form.errors.richtext &&
                                  form.touched.richtext ? (
                                    <div className="explain">
                                      {form.errors.richtext}
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </Field>
                            <div
                              style={{
                                paddingBottom: "7px",
                              }}
                            ></div>
                          </FormikForm>
                          <button
                            onClick={() => {
                              show === true ? setShow(false) : setShow(true);
                            }}
                          >
                            {show === true ? "Close Preview" : "Open preview"}
                          </button>
                        </>
                      );
                    }}
                  </Formik>
                </div>
              </div>
              <br />
              <div className="TitleField">
                <div>
                  <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                    Project Banner
                  </Typography>
                </div>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div
                  onClick={handleClick}
                  onDragOver={handleOndragOver}
                  onDrop={handleOndrop}
                  className="bannerDiv"
                >
                  {!imageBanner ? (
                    <>
                      <span>Drag and Drop Image or Click to Browse File</span>
                      <span>Recommended: 500 x 200 px in jpg or png</span>
                    </>
                  ) : (
                    <img width="500px" height="200px" src={imageBanner} />
                  )}
                </div>
              </div>
              <br />
              <div className="TitleField">
                <div className="displayFlex">
                  <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                    Project Website
                  </Typography>
                </div>
                <InputGroup className="mb-3">
                  <Form.Control
                    spellCheck={false}
                    value={grantWebsite}
                    onChange={(e) => setGrantWebsite(e.target.value)}
                    className="removeBoxShadow"
                    placeholder="https://mygrant.com"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </div>
              <div className="TitleField">
                <div className="displayFlex">
                  <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                    Project Twitter Handle
                  </Typography>
                </div>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon3">
                    https://twitter.com/
                  </InputGroup.Text>
                  <Form.Control
                    spellCheck={false}
                    value={grantTwitterHandle}
                    onChange={(e) => setGrantTwitterHandle(e.target.value)}
                    className="removeBoxShadow"
                    placeholder="mygrant"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </div>
              <div className="TitleField">
                <div className="displayFlex">
                  <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                    Github URL
                  </Typography>
                </div>

                <span className="tinyTextBelowTitle">
                  Grant project code must be open sourced and on github or any
                  other code repositories
                </span>
                <p></p>
                <InputGroup className="mb-3">
                  <Form.Control
                    spellCheck={false}
                    value={grantGithubURL}
                    onChange={(e) => setGrantGithubURL(e.target.value)}
                    className="removeBoxShadow"
                    placeholder="https://github.com/mygrant"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  alignItem: "center",
                  gap: "2em",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    saveEdit();
                  }}
                  variant="primary"
                >
                  Save
                </Button>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    setShow(false);
                  }}
                  variant="outline-danger"
                >
                  Close
                </Button>
              </div>
            </div>
          </PreviewBar>
          <CheckOutModal
            show={showSuccess}
            onHide={() => setShowSuccess(false)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1em",
              }}
            >
              <CheckCircleOutlineIcon sx={{ width: "70px", height: "70px" }} />

              <span>Successfully Edited Grant</span>
              <span>This page will refresh in 5 seconds...</span>
            </div>
          </CheckOutModal>
        </div>
      ) : (
        <>
          <div>
            <ShimmerPostDetails card cta variant="EDITOR" />
          </div>
        </>
      )}
    </>
  );
};
