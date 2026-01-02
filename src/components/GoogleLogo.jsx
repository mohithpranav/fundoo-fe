import React from "react";

const GoogleLogo = ({ width = 120, height = 40 }) => (
  <svg width={width} height={height} viewBox="0 0 120 40" fill="none">
    <text
      x="0"
      y="30"
      fontFamily="Arial, sans-serif"
      fontSize="34"
      fontWeight="500"
    >
      <tspan fill="#4285F4">G</tspan>
      <tspan fill="#EA4335">o</tspan>
      <tspan fill="#FBBC05">o</tspan>
      <tspan fill="#4285F4">g</tspan>
      <tspan fill="#34A853">l</tspan>
      <tspan fill="#EA4335">e</tspan>
    </text>
  </svg>
);

export default GoogleLogo;
