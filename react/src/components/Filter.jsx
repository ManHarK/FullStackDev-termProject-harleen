import React from "react";

function Filter({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Filter gardens..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default Filter;
