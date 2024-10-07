import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";

const animatedComponents = makeAnimated();
//  const options = [{ value: 'chocolate', label: 'Chocolate' }]

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.25)",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: "transparent",
      color: isSelected ? "#2c88d1" : "#686868",
      cursor: isDisabled ? "not-allowed" : "pointer",
      borderBottom: "1px solid #d6d9db",
    };
  },
};

export default function AnimatedMulti(props) {
  const [selected, setSelected] = useState([]);
  const [creatableSelected, setCreatableSelected] = useState("");
  const [options, setOptions] = useState([
    {
      label:
        props.blankSelect && props.blankSelect !== "none"
          ? props.blankSelect
          : "Select",
      value: "",
      optionDetails: {},
      tooltip:
        props.blankSelect && props.blankSelect !== "none"
          ? props.blankSelect
          : "Select",
    },
  ]);

  useEffect(() => {
    if (Array.isArray(props.options)) {
      let opArr = [];
      if (props.blankSelect !== "none") {
        opArr.push({
          label: props.blankSelect ? props.blankSelect : "Select",
          value: "",
          optionDetails: {},
          tooltip:
            props.blankSelect && props.blankSelect !== "none"
              ? props.blankSelect
              : "Select",
        });
      }
      props.options.map((option) => {
        if (props.object) {
          opArr.push({
            label: props.object[option],
            value: option,
            optionDetails: option,
          });
        } else if (props.array) {
          opArr.push({
            label: option,
            value: option,
            optionDetails: option,
          });
        } else {
          opArr.push({
            label: option[props.KEY_label || "label"],
            value: option[props.KEY_value || "value"],
            optionDetails: option[props.KEY_value || "optionDetails"],
            tooltip: option.tooltip,
          });
        }
      });
      setOptions(opArr);
    }
  }, [props.options]);

  useEffect(() => {
    if (!props?.isCreatable) {
      let ds = options.filter((obj) => props.value === obj.value);
      setSelected(ds);
    } else {
      let optionsObj = options.find((obj) => props.value === obj.value);
      let ds = {
        value: props.value,
        label: optionsObj?.label || props.value,
        __isNew__: true,
      };
      setCreatableSelected(ds);
    }
    // }
  }, [props.value, options, props?.isCreatable]);

  const onChange = (ob) => {
    if (props.onChange) {
      let e = {
        target: {
          value: ob?.value,
          name: props.name ? props.name : "",
          optionDetails: ob.optionDetails ? ob.optionDetails : {},
        },
      };
      props.onChange(e);
    }
  };

  let SelectComponent = !props?.isCreatable ? Select : CreatableSelect;

  return (
    <div>
      <SelectComponent
        value={!props?.isCreatable ? selected : creatableSelected}
        menuPlacement={props.menuPlacement ? props.menuPlacement : "bottom"}
        closeMenuOnSelect={true}
        components={
          props.component ? { Option: props.component } : animatedComponents
        }
        // defaultValue={selected}
        options={options}
        onChange={(e) => {
          onChange(e);
        }}
        placeholder={props.placeholder ? props.placeholder : "Select"}
        isDisabled={props.disabled ? props.disabled : false}
        style={props.style ? props.style : {}}
        menuPortalTarget={
          props.menuPortalTarget === null
            ? props.menuPortalTarget
            : document.body
        }
        className={`customDropdown ${props.className ? props.className : ""}`}
        classNamePrefix={"reactSelect"}
        styles={customStyles}
        // defaultMenuIsOpen={true}
      />
    </div>
  );
}

export const SearchableSelect = AnimatedMulti;
