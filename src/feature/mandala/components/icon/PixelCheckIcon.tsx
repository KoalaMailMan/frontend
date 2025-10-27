type IconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function PixelCheckIcon({
  className,
  width = 8,
  height = 6,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 0H8V1H7V0ZM6 2V1H7V2H6ZM5 3V2H6V3H5ZM4 4H5V3H4V4ZM3 5H4V4H3V5ZM2 5V6H3V5H2ZM1 4H2V5H1V4ZM1 4H0V3H1V4Z"
        fill="black"
      />
    </svg>
  );
}
