import React from 'react';
import { isEmptyObject } from "jquery";


const InputError = ({ submitted, error, name, className }) => {
  return (
    <span className={className ? className : 'small text-danger'}>
      {submitted &&
        error &&
        !isEmptyObject(error) &&
        error[name] &&
        error[name]}
    </span>
  );
};

export default InputError;
