const MagnifierIcon = ({
  width = 24,
  height = 24,
  fill = "#111111",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.9998 19.9974L15.6367 15.6343"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10.2859"
        cy="10.2859"
        r="7.03588"
        stroke={fill}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default MagnifierIcon;
