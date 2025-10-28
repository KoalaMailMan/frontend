type IconProps = {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
};

export default function QuestionIcon({
  className,
  width = 11,
  height = 20,
  color = "#666666",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={className}
        d="M3.25 16.25H6.5V19.5H3.25V16.25ZM10.8333 2.16667V8.66667H9.75V9.75H8.66667V10.8333H6.5V13H3.25V9.75H4.33333V8.66667H6.5V7.58333H7.58333V3.25H3.25V4.33333H2.16667V5.41667H0V2.16667H1.08333V1.08333H2.16667V0H8.66667V1.08333H9.75V2.16667H10.8333Z"
        fill={color}
      />
    </svg>
  );
}
