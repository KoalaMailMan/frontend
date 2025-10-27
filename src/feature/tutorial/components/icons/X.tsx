type IconProps = {
  className?: string;
  size?: number;
  strokeColor?: string;
  stroke?: number;
};

export default function X({
  className,
  size = 14,
  strokeColor = "#B3B3B3",
  stroke = 1,
}: IconProps) {
  const defaultSize = 1.16667 * stroke;
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 3.5L3.5 10.5"
        stroke={strokeColor}
        strokeWidth={`${defaultSize}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 3.5L10.5 10.5"
        stroke={strokeColor}
        strokeWidth={`${defaultSize}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
