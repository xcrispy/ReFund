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

export const GrantView = () => {
  const { id_grant, grant_name_url } = useParams();
  const [data, setData] = useState();
  const { cartItems, addToCart } = useCart();
  const { address, isConnected } = useAccount();

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
    // console.log(idQuery);
  };
  const [grantOwner, setGrantowner] = useState(false);
  const [teamMember, setTeamMember] = useState(false);
  useEffect(() => {
    CanEdit();
  }, [address]);
  const CanEdit = () => {
    if (data) {
      for (let i = 0; i < data.attributes.grantTeamMembers.length; i++) {
        console.log(data.attributes.grantTeamMembers[i].team_member_address);
        if (
          data.attributes.grantTeamMembers[i].team_member_address === address
        ) {
          setTeamMember(true);
          console.log(data.attributes.grantTeamMembers[i].team_member_address);
          console.log("found team");
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
              {grantOwner || teamMember ? (
                <div className="EditGrant">
                  <span className="progressTextEdit">
                    <DriveFileRenameOutlineIcon /> Keep your grant up to date
                  </span>
                  <br />
                  <p className="progressText">
                    Let your grant contributors know about your project and
                    progress.
                  </p>

                  <Button className="Addtocartbtn">Edit Grant</Button>
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
