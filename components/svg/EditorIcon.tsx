const EditorIcon = ({
  width = 24,
  height = 24,
  fill = "white",
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
        d="M11.2787 5.44295H6.72952C5.22205 5.44295 4 6.66496 4 8.17238V17.2706C4 18.778 5.22205 20 6.72952 20H15.8279C17.3354 20 18.5574 18.778 18.5574 17.2706L18.5574 12.7215M8.5492 15.4509L11.8595 14.7839C12.0352 14.7485 12.1966 14.6619 12.3233 14.5352L19.7337 7.12093C20.089 6.76546 20.0887 6.18925 19.7332 5.83408L18.1634 4.26611C17.8079 3.91108 17.232 3.91133 16.8768 4.26665L9.46568 11.6816C9.3392 11.8082 9.25284 11.9692 9.2174 12.1446L8.5492 15.4509Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditorIcon;
