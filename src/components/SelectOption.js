import { useState } from "react";
import Checkbox from "./Checkbox";

const shouldRenderChildren = (checked, children) => {
  return checked && children;
};

const SelectOption = ({ label, children, checked, value, name, onChange, ...rest }) => {

  return <li {...rest}>
    <Checkbox
      label={label}
      checked={checked}
      value={value}
      name={name}
      onChange={onChange}
    />
    {shouldRenderChildren(checked, children) && children.map((child, i) => <ul className="pl-5 space-y-1" key={i}>
      <SelectOption
        label={child.name}
        checked={checked}
        value={child.id}
        name={name}
        onChange={onChange}
      />
    </ul>)}
  </li>;
};

export default SelectOption;