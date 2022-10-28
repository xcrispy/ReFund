import React from "react";
import { Button } from "react-bootstrap";
import "./ReviewGrant.scss";
import ReportIcon from "@mui/icons-material/Report";
import HelpIcon from "@mui/icons-material/Help";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AboutBar from "../RichText/RichText";
import { copyToClipboard, getEllipsisTxt } from "../../pages/Extra";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Chip } from "@mui/material";

export const ReviewGrant = ({
  grantname,
  grantwebsite,
  granttwitter,
  grantaddress,
  grantgithub,
  grantdescription,
  grantbanner,
  granttags,
}) => {
  return (
    <div>
      <div>
        <img alt="" width="100%x" height="400px" src={grantbanner} />
      </div>
      <br />
      <div className={"GrantBodyReview"}>
        <div className="GrantTittleandAboutReview">
          <h2 className="GrantNameHeaderReview">{grantname}</h2>
          {granttags.map((tag, index) => (
            <Chip style={{ margin: "2px" }} key={index} label={tag} />
          ))}
          <div className="lineReview"></div>
          <div className="socialDetailsReview">
            <div>
              <a href={"" + grantwebsite + ""} target="_blank" rel="noreferrer">
                {grantwebsite}
              </a>
              <br />
              <a
                href={"https://twitter.com/" + granttwitter + ""}
                target="_blank"
                rel="noreferrer"
              >
                {granttwitter}
              </a>
              <br />
              <span>Updated : {new Date().toDateString()}</span>
            </div>
            <div>
              <div className="addressGrant">
                <a
                  href={
                    "https://mumbai.polygonscan.com/address/" +
                    grantaddress +
                    ""
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {getEllipsisTxt(grantaddress, 6)}
                </a>
                <ContentCopyIcon
                  onClick={() => copyToClipboard(grantaddress)}
                  className="ContentCopyIcon"
                />
                Polygon
              </div>

              <a href={"" + grantgithub + ""} target="_blank" rel="noreferrer">
                {grantgithub}
              </a>
            </div>
          </div>
          <div className="lineReview"></div>
          <h3>Estimated lifetime funding received</h3>
          <h2>~$0</h2>
          <span>This number should not be used for accounting purposes.</span>
          <br />
          <br />
          <div className="lineReview"></div>
          <h3>About </h3>
          <div className="AboutReview">
            <AboutBar element={grantdescription} />
          </div>
        </div>
        <div className="CartandTeamHeaderReview">
          <div className="EditGrantReview">
            <span className="progressTextEditReview">
              <DriveFileRenameOutlineIcon /> Keep your grant up to date
            </span>
            <br />
            <p className="progressTextReview">
              Let your grant contributors know about your project and progress.
            </p>

            <Button className="AddtocartbtnReview">Edit Grant</Button>
            <div className="lineReview"></div>
          </div>
          <div className="CartandTeamReview">
            <div className="rateprojectReview">
              <div className="upvotessectionReview">
                <ThumbUpIcon sx={{ fontSize: 65 }} />
                <br />
                <span>0</span>
              </div>
              <div className="downvotessectionReview">
                <ThumbDownIcon sx={{ fontSize: 65 }} />
                <br />
                <span>0</span>
              </div>
            </div>
            <Button className="AddtocartbtnReview">Add to Cart</Button>
          </div>
          {/*}
          <div className="displayflexalign">
            <span style={{ cursor: "pointer" }}>
              <HelpIcon /> rules
            </span>
            <span style={{ cursor: "pointer" }}>
              <ReportIcon /> report
            </span>
          </div>
                */}
        </div>
      </div>
    </div>
  );
};
