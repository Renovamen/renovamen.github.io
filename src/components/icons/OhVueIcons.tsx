import type { Component } from "solid-js";
import { useDark } from "solidjs-use";

export const OhVueIcons: Component = () => {
  const [isDark] = useDark();
  const color = () => (isDark() ? "#ff6562" : "#e1190e");

  return (
    <svg
      width="1.4em"
      viewBox="0 0 176 176"
      xmlns="http://www.w3.org/2000/svg"
      fill-rule="evenodd"
      stroke="currentColor"
      stroke-linecap="round"
    >
      <path d="m77.909 45.28-53.96 86.405" stroke-width="9.89px" />
      <path d="m151.971 131.071-127.006 1.011" stroke-width="9.37px" />
      <path
        d="m110.528 64.766 42.13 65.933M110.528 64.766l-23.966 38.483M78.415 46.086l11.692 18.225"
        stroke-width="9.89px"
      />
      <path
        d="M141.443 42.604c6.014 0 10.897 4.883 10.897 10.897 0 6.013-4.883 10.896-10.897 10.896-6.013 0-10.896-4.883-10.896-10.896 0-6.014 4.883-10.897 10.896-10.897Zm0 0c6.014 0 10.897 4.883 10.897 10.897 0 6.013-4.883 10.896-10.897 10.896-6.013 0-10.896-4.883-10.896-10.896 0-6.014 4.883-10.897 10.896-10.897Z"
        stroke-width="7.89px"
        stroke={color()}
      />
    </svg>
  );
};
