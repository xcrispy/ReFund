import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

import "./styles.css";

export default function PreviewBar({ show, children, element }) {
  useEffect(() => {
    if (show === true) {
      document.getElementById("splitPreviewBar").style.width = "39%";
    } else {
      document.getElementById("splitPreviewBar").style.width = "0%";
    }
  });
  return (
    <div>
      <div id="splitPreviewBar" className="rightPreviewBar">
        <ReactQuill value={element} readOnly={true} theme={"bubble"} />
        <div className="">{children}</div>
      </div>
    </div>
  );
}
