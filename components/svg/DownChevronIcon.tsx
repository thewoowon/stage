const DownChevronIcon = ({
  width = 16,
  height = 16,
  fill = "#8C8C8C",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9961 6.00146L7.99886 10.9987L3.00164 6.00146"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownChevronIcon;
