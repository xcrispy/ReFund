import { useEffect, useState } from "react";
import "./EditBar.module.css";

export default function EditBar({ show }) {
  useEffect(() => {
    if (show === true) {
      document.getElementById("split").style.width = "0%";
    } else {
      document.getElementById("split").style.width = "50%";
    }
  });
  return (
    <div className="App">
      <div className="split left">
        <div className="centered">
          <img src="img_avatar2.png" alt="Avatar woman" />
          <h2>Jane Flex</h2>
          <p>Some text.</p>
        </div>
      </div>

      <div className="split right">
        <div className="centered">
          <img src="img_avatar.png" alt="Avatar man" />
          <h2>John Doe</h2>
          <p>Some text here too.</p>
        </div>
      </div>
    </div>
  );
}
