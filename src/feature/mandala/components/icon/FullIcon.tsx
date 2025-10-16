type IconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function FullIcon({
  className,
  width = 19,
  height = 20,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.00004 0.833313V2.49998H2.00004V7.49998H0.333374V1.66665H1.16671V0.833313H7.00004ZM7.00004 17.5V19.1666H1.16671V18.3333H0.333374V12.5H2.00004V17.5H7.00004ZM18.6667 12.5V18.3333H17.8334V19.1666H12V17.5H17V12.5H18.6667ZM18.6667 1.66665V7.49998H17V2.49998H12V0.833313H17.8334V1.66665H18.6667Z"
        fill="#373737"
      />
    </svg>
  );
}
