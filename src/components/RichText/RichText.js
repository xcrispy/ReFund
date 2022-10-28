import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

import "./styles.css";

export default function AboutBar({ children, element }) {
  return (
    <div>
      <div id="splitAboutBar" className="rightAboutBar">
        <ReactQuill value={element} readOnly={true} theme={"bubble"} />
        <div className="">{children}</div>
      </div>
    </div>
  );
}
