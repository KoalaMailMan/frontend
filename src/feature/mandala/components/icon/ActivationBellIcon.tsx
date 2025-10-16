type IconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function ActivationBellIcon({
  className,
  width = 16,
  height = 18,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.25 15V16.5H9.5V17.25H6.5V16.5H5.75V15H10.25ZM14.75 12.75V12H14V10.5H13.25V6H12.5V4.5H11.75V3.75H11V3H9.5V2.25H8.75V0.75H7.25V2.25H6.5V3H5V3.75H4.25V4.5H3.5V6H2.75V10.5H2V12H1.25V12.75H0.5V13.5H1.25V14.25H14.75V13.5H15.5V12.75H14.75ZM3.5 12V10.5H4.25V6H5V4.5H6.5V3.75H9.5V4.5H11V6H11.75V10.5H12.5V12H13.25V12.75H2.75V12H3.5Z"
        fill="#373737"
      />
    </svg>
  );
}
