import React from "react";
import PropTypes from "prop-types";
import "./Input.css";

const Input = ({
  placeholder,
  value,
  onChange,
  className,
  disabled,
  type = "text",
  ...props
}) => {
  if (type === "textarea") {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`form-input textarea-input ${className}`}
        disabled={disabled}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`form-input ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

Input.defaultProps = {
  value: "",
  onChange: () => {},
  className: "",
  disabled: false,
  type: "text",
};

export default Input;
