import React from "react";
import "./FormGroup.css"; // Import the CSS file for styling

const FormGroup = ({ children }) => {
  return <div className="form-group">{children}</div>;
};

export default FormGroup;
