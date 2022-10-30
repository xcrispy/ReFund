import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import "./styles/CreateGrant.scss";
import StepLabel from "@mui/material/StepLabel";
//import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Moralis from "moralis-v1";
import RichTextEditor from "../RichTextEditor";
import * as Joi from "joi-browser";
import { Formik, Field, Form as FormikForm, useFormikContext } from "formik";
import { Button } from "antd";
import { RegisterSchema1 } from "../Validation";
import Badge from "react-bootstrap/Badge";

import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "antd/dist/antd.css";
import { ReviewGrant } from "../components/ReviewGrant/ReviewGrant";
import PreviewBar from "../components/PreviewBar/PreviewBar";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import CheckOutModal from "../components/Modal/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const steps = ["Grant Details", "Owner Information", "Review Grant"];
const options = [
  "Web3",
  "DeFi",
  "ReFi",
  "NFT",
  "Gaming",
  "Web2",
  "DAO-tooling",
  "Social-impact",
];

export const CreateGrant = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [show, setShow] = useState(false);
  const [skipped, setSkipped] = useState(new Set());
  const [value, setValue] = React.useState();
  const { address, isConnected } = useAccount();
  React.useEffect(() => {
    setGrantProjectTag(value);
  }, [value]);
  const [teamMemberField, setTeamMemberField] = useState([
    { team_member_address: "" },
  ]);

  const [grantName, setGrantName] = useState("");
  const [grantDescription, setGrantDescription] = useState("");
  const [grantBanner, setGrantBanner] = useState("");
  const [grantGithubURL, setGrantGithubURL] = useState("");
  const [grantWebsite, setGrantWebsite] = useState("");
  const [grantTwitterHandle, setGrantTwitterHandle] = useState("");
  const [grantProjectTag, setGrantProjectTag] = useState([]);
  const [grantOwnerTwitterHandle, setGrantOwnerTwitterHandle] = useState("");
  const [grantTeamMembers, setGrantTeamMembers] = useState();
  const [grantBlockChain, setGrantBlockChain] = useState("Polygon");
  const [grantDonationAddress, setGrantDonationAddress] = useState("");
  const [grantOwnerAddress, setGrantOwnerAddress] = useState("");
  const [imageBanner, setImageBanner] = useState("");
  const navigate = useNavigate();
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      if (
        !grantName ||
        !grantDescription ||
        !grantBlockChain ||
        !grantWebsite ||
        !grantGithubURL ||
        !grantOwnerAddress ||
        !grantDonationAddress ||
        !grantProjectTag ||
        !grantTwitterHandle
      )
        return;
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreate = async () => {
    if (isConnected) {
      //  console.log("add all items to database and push url");
      submitValidatePush();
    } else {
      console.log("pls connect your account");
    }
  };
  const FormObserver = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      setGrantDescription(values);
      /*  console.log(
        "FormObserver::values",
        values,
        JSON.stringify(grantDescription, null, 2)
      );
      */
    }, [values]);

    return null;
  };

  const submitValidatePush = async () => {
    if (
      !grantName ||
      !grantDescription ||
      !grantBlockChain ||
      !grantWebsite ||
      !grantGithubURL ||
      !grantOwnerAddress ||
      !grantDonationAddress ||
      !grantProjectTag ||
      !grantTwitterHandle
    ) {
      console.log("some stuffs are invalid");
    }

    const GrantTestData = Moralis.Object.extend("GrantTestData");
    const grantTestData = new GrantTestData();
    // set data
    const grantTestDataquery = new Moralis.Query(grantTestData);
    // console.log("function received");
    grantTestData.set("grantName", grantName);
    const routeName = grantName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 18);
    grantTestData.set("grantRouteName", routeName);
    grantTestData.set("grantDescription", grantDescription);
    grantTestData.set("grantBanner", grantBanner);
    grantTestData.set("grantGithubURL", grantGithubURL);
    grantTestData.set("grantWebsite", grantWebsite);
    grantTestData.set("grantProjectTag", grantProjectTag);
    grantTestData.set("grantTwitterHandle", grantTwitterHandle);
    grantTestData.set("grantIsActive", true);
    setShowSuccess(true);
    const dataQuery = await grantTestDataquery.find();
    // console.log(dataQuery);
    ///// fix the grant_id, it is important
    grantTestData.set("grantId", `${dataQuery.length + 1}`);
    console.log(dataQuery.length + 1);

    ///// owner info
    grantTestData.set("grantOwnerTwitterHandle", grantOwnerTwitterHandle);
    grantTestData.set("grantTeamMembers", grantTeamMembers);
    grantTestData.set("grantTeamStruture", {
      owner: grantOwnerAddress,
      team_members: grantTeamMembers,
    });
    grantTestData.set("grantBlockChain", grantBlockChain);
    grantTestData.set("grantDonationAddress", grantDonationAddress);
    grantTestData.set("grantOwnerAddress", grantOwnerAddress);

    grantTestData.save().then(
      (grantTestData) => {
        // Execute any logic that should take place after the object is saved.
        console.log("New object created with objectId: " + grantTestData.id);
        navigate(`/grants/${dataQuery.length + 1}/${routeName}`);
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

    //  console.log(imageBanner);
  };
  useEffect(() => {
    setGrantTeamMembers(teamMemberField);
  }, [teamMemberField]);

  useEffect(() => {
    setGrantOwnerAddress(address);
  }, [address]);

  const handleTeamAddressChange = (idx, e) => {
    const newTeamMembers = teamMemberField.map((teamMember, sidx) => {
      if (idx !== sidx) return teamMember;
      // console.log({ ...teamMember, team_member_address: e.target.value });
      return { ...teamMember, team_member_address: e.target.value };
    });

    setTeamMemberField(newTeamMembers);
  };
  /*
  handleSubmit = (evt) => {
    const { name, shareholders } = this.state;
    alert(`Incorporated: ${name} with ${shareholders.length} shareholders`);
  };
*/
  const handleAddTeamMember = () => {
    setTeamMemberField(teamMemberField.concat([{ team_member_address: "" }]));
    /*  this.setState({
      shareholders: this.state.shareholders,
    });
    */
  };

  const handleRemoveTeamMember = (idx) => {
    /* this.setState({
      shareholders: this.state.shareholders),
    });
*/
    setTeamMemberField(teamMemberField.filter((s, sidx) => idx !== sidx));
  };

  return (
    <div className="outerDiv">
      <Box sx={{ width: "100%" }}>
        <Stepper
          sx={{ width: "50%", margin: "0 auto" }}
          activeStep={activeStep}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <React.Fragment>
          <div
            heighth={"100%"}
            width={"100%"}
            style={{ position: "relative", padding: "20px 2px" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "60%",
                margin: "0 auto",
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep === steps.length - 1 ? (
                <Button onClick={handleCreate}>Finish</Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </Box>
          </div>

          {activeStep === 0 ? (
            <div className="GrantDetails">
              <div className="GrantInfo">
                Step {activeStep + 1} of 3
                <br />
                <span></span>
                <div>
                  <h4 className="GrantDetailsHeader">Grant Details</h4>
                  <div className="TitleField">
                    <div className="displayFlex">
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Title
                      </Typography>
                      <Badge bg="secondary">required</Badge>
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
                  {/*Description and image */}

                  <div className="TitleField">
                    <div className="displayFlex">
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Project Description
                      </Typography>
                      <Badge bg="secondary">required</Badge>
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
                            // alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                          }, 300);
                        }}
                      >
                        {({ isSubmitting, isValid, setFieldValue }) => {
                          /*  console.log(
                              `why isSubmitting: ${isSubmitting} and isValid: ${isValid} are doing me kolo ? `
                            ); */
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
                                  show === true
                                    ? setShow(false)
                                    : setShow(true);
                                }}
                              >
                                {show === true
                                  ? "Close Preview"
                                  : "Open preview"}
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
                          <span>
                            Drag and Drop Image or Click to Browse File
                          </span>
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
                      <Badge bg="secondary">required</Badge>
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
                      <Badge bg="secondary">required</Badge>
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
                      <Badge bg="secondary">required</Badge>
                    </div>

                    <span className="tinyTextBelowTitle">
                      Grant project code must be open sourced and on github or
                      any other code repositories
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
                  <div className="TitleField">
                    <div className="displayFlex">
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Project Tag / Catergory
                      </Typography>
                      <Badge bg="secondary">required</Badge>
                    </div>
                    <Autocomplete
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      multiple={true}
                      id="tags-outlined"
                      options={options}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Tags" />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {activeStep === 1 ? (
            <div className="GrantDetails">
              <div className="GrantInfo">
                Step {activeStep + 1} of 3
                <br />
                <span></span>
                <div>
                  <h4 className="GrantDetailsHeader">Owner Information</h4>
                  <div className="TitleField">
                    <div>
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Your Twitter Handle
                      </Typography>
                    </div>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon3">
                        https://twitter.com/
                      </InputGroup.Text>
                      <Form.Control
                        spellCheck={false}
                        value={grantOwnerTwitterHandle}
                        onChange={(e) =>
                          setGrantOwnerTwitterHandle(e.target.value)
                        }
                        className="removeBoxShadow"
                        placeholder="myusername"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </InputGroup>
                  </div>

                  <br />
                  <div className="TitleField">
                    <div>
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Team Members
                      </Typography>
                    </div>
                    <span className="tinyTextBelowTitle">
                      Add any other team member wallet address (exculding the
                      owner, you!!!).
                    </span>
                    <br />
                    <span className="tinyTextBelowTitle">
                      Team members will have access to edit your grant.
                    </span>
                    <br />
                    <span className="tinyTextBelowTitle">
                      If no Team member(s), Remove all fields
                    </span>
                    <p></p>
                    {teamMemberField.map((teamMember, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1em",
                        }}
                        className="shareholder"
                      >
                        <InputGroup>
                          <Form.Control
                            spellCheck={false}
                            type="text"
                            placeholder={`Team member #${idx + 1} address`}
                            value={teamMember.team_member_address}
                            onChange={(e) => {
                              const re = /(?:0[xX])?[0-9a-fA-F]+/;
                              if (
                                e.target.value === "" ||
                                re.test(e.target.value)
                              ) {
                                handleTeamAddressChange(idx, e);
                              }
                            }}
                            className="removeBoxShadow"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                          />
                        </InputGroup>

                        <Button
                          variant="outline-dark"
                          onClick={() => handleRemoveTeamMember(idx)}
                          className="small"
                        >
                          - Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      style={{ marginTop: "10px" }}
                      type="button"
                      onClick={handleAddTeamMember}
                      className="small"
                    >
                      Add TeamMember
                    </Button>
                  </div>
                  <br />
                  <div className="TitleField">
                    <div className="displayFlex">
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Select blockchain on which to receive funds
                      </Typography>
                      <Badge bg="secondary">required</Badge>
                    </div>

                    <span className="tinyTextBelowTitle">
                      Grants need a wallet address to receive donations. Please
                      select a blockchain where you have an active wallet and
                      want to receive your funds.
                    </span>
                    <p></p>
                    <InputGroup className="mb-3">
                      <Form.Control
                        value={grantBlockChain}
                        readOnly
                        className="removeBoxShadow"
                        placeholder="Polygon"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </InputGroup>
                  </div>
                  <br />
                  <div className="TitleField">
                    <div className="displayFlex">
                      <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                        Add Recipient's Wallet Address
                      </Typography>
                      <Badge bg="secondary">required</Badge>
                    </div>

                    <span className="tinyTextBelowTitle">
                      IMPORTANT: This is the wallet address where contributions
                      to this grant will be sent.
                    </span>
                    <br />
                    <span className="tinyTextBelowTitle">
                      DO NOT use an exchange address — use a self-custody wallet
                      address such as MetaMask.
                    </span>
                    <br />
                    <span className="tinyTextBelowTitle">
                      Adding an incorrect wallet address could mean that you
                      don't receive your funds.
                    </span>

                    <InputGroup className="mb-3">
                      <Form.Control
                        spellCheck={false}
                        value={grantDonationAddress}
                        onChange={(e) => {
                          const re = /(?:0[xX])?[0-9a-fA-F]+/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            setGrantDonationAddress(e.target.value);
                          }
                        }}
                        className="removeBoxShadow"
                        placeholder="0x0000..."
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {activeStep === 2 ? (
            <div className="GrantDetailsSpecial">
              <div className="GrantDetailsSpeciaGrantInfo">
                <ReviewGrant
                  grantname={grantName}
                  grantwebsite={grantWebsite}
                  granttwitter={grantTwitterHandle}
                  grantaddress={grantDonationAddress}
                  grantgithub={grantGithubURL}
                  granttags={grantProjectTag}
                  grantbanner={grantBanner}
                  grantdescription={grantDescription.richtext}
                />
              </div>
            </div>
          ) : null}
        </React.Fragment>
      </Box>
      <PreviewBar show={show} element={grantDescription.richtext}></PreviewBar>
      <CheckOutModal show={showSuccess} onHide={() => setShowSuccess(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <CheckCircleOutlineIcon sx={{ width: "70px", height: "70px" }} />

          <span>Successfully Created Grant</span>
          <span>Redirecting to your grant page ...</span>
          <span>please wait ...</span>
        </div>
      </CheckOutModal>
    </div>
  );
};
