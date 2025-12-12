type IconProps = {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
};

export default function CheckIcon({
  className,
  width = 15,
  height = 12,
  fill = "#3A3A3A",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 15 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.225 11.0229L0 5.79792L1.30625 4.49167L5.225 8.41042L13.6354 0L14.9417 1.30625L5.225 11.0229Z"
        fill={fill}
      />
    </svg>
  );
}
