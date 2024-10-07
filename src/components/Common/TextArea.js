import React from "react";
import { FaRegCopy } from "react-icons/fa";
import toastr from "toastr";

const TextArea = ({ value, edit = false, onChange, borderShadow = false }) => {
  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value || "").then(() => {
        toastr.success("Text copied to clipboard!");
      }).catch(err => {
        toastr.error("Failed to copy text to clipboard.");
        console.error('Clipboard write failed', err);
      });
    } else {
      // Fallback method
      const textarea = document.createElement('textarea');
      textarea.value = value || "";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toastr.success("Text copied to clipboard!");
      } catch (err) {
        toastr.error("Failed to copy text to clipboard.");
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textarea);
    }
  };
  return (
    <div className="textAreaCopyTxt" style={{ position: "relative" }}>
      {/* <div class="divtext" contentEditable>Hello World</div> */}
      <textarea
        className={`form-control ${!borderShadow ? "no-border-shadow" : ""}`}
        value={value}
        readOnly={!edit}
        style={{
          width: "100%",
          height: "100px",
          resize: "vertical",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          scrollbarWidth: "thin",
        }}
        onChange={edit ? onChange : undefined}
      />

      <FaRegCopy
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          cursor: "pointer",
          fontSize: "18px",
          color: "#ebebeb",
          margin: "2px 12px 7px 0px",
        }}
        onClick={handleCopy}
      />
    </div>
  );
};

export default TextArea;
