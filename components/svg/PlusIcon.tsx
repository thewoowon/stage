const PlusIcon = ({
  width = 24,
  height = 24,
  fill = "black",
  opacity = 0.5,
}: SvgIconProps & {
  opacity?: number;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={opacity}>
        <path d="M3 12H21" stroke={fill} />
        <path d="M12 3V21" stroke={fill} />
      </g>
    </svg>
  );
};

export default PlusIcon;
