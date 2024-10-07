import React from "react";
import { Form } from "react-bootstrap";
import Error from "../InputError/Error";

function FormInputText(props) {
  const {
    label,
    error,
    errorClassName,
    id,
    name,
    type,
    className,
    value,
    disabled,
    onChange,
    minLength,
    maxLength,
    checked,
    placeholder,
    placeHolder,
    multiple,
    accept,
    readOnly,
    formGroupClass,
    labelClass,
    required,
  } = props;

  return (
    <Form.Group className={formGroupClass || "mb-3"}>
      {label && (
        <Form.Label className={labelClass ? labelClass : "form-label-input"}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </Form.Label>
      )}

      <Form.Control
        id={id}
        name={name}
        type={type}
        className={className}
        value={value}
        disabled={disabled}
        onChange={onChange}
        min={minLength}
        max={maxLength}
        checked={checked}
        placeholder={placeholder || placeHolder}
        multiple={multiple}
        accept={accept}
        readOnly={readOnly}
        data-testid={name}
      />
      <Error error={error} className={errorClassName} />
    </Form.Group>
  );
}

export default FormInputText;
