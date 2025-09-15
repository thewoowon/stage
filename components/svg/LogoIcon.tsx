const LogoIcon = ({
  width = 48,
  height = 49,
  fill = "#2F58E0",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.6846 32.3906H25.292L16.333 41.4961H6.59961V32.3906H6.60059V25.873L15.6846 16.5811V32.3906ZM40.5977 32.3867L25.29 32.3877L34.041 22.8926L40.5977 22.8916V32.3867ZM40.5996 16.5811H15.6855L24.8564 7.49805H40.5996V16.5811Z"
        fill={fill}
      />
    </svg>
  );
};

export default LogoIcon;
