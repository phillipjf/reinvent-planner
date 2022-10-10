import React from "react";

const CheckboxFilter = ({ name, checked, onChange }) => {
  return (
    <label>
      <input
        type="checkbox"
        onChange={() => onChange(name)}
        checked={checked}
      />
      {name}
    </label>
  );
};

export default CheckboxFilter;
