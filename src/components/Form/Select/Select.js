import React from "react";
import { Form, FormGroup } from "react-bootstrap";
import { SearchableSelect } from "../SearchableSelect/SSingleSelect";
import "./Select.scss";
import Error from "../InputError/Error";

function Select({
  blankSelect = "Select",
  label,

  name,
  value,
  onChange,
  disabled,

  style,
  array,
  object,
  className,

  menuPortalTarget,
  menuPlacement,
  error,
  errorClassName,

  KEY_label,
  placeholder,
  KEY_value,

  options,
  component = null,
  isCreatable,
  formGroupClass,
  width,
  selectClass,
}) {
  return (
    <FormGroup
      className={selectClass ? selectClass : "mb-3"}
      style={{ width: width }}
    >
      {label && (
        <Form.Label
          className={formGroupClass ? formGroupClass : "form-label-input"}
        >
          {label}
        </Form.Label>
      )}

      <SearchableSelect
        placeholder={placeholder}
        name={name ? name : ""}
        value={value}
        onChange={onChange}
        options={options}
        KEY_label={KEY_label ? KEY_label : "label"}
        KEY_value={KEY_value ? KEY_value : "value"}
        blankSelect={blankSelect}
        className={className}
        disabled={disabled ? disabled : false}
        style={style ? style : {}}
        array={array}
        object={object}
        menuPortalTarget={menuPortalTarget}
        component={component}
        menuPlacement="auto"
        isCreatable={isCreatable}
      />

      {error && <Error error={error} className={errorClassName} />}
    </FormGroup>
  );
}

export default Select;
