type IconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function MailIcon({
  className,
  width = 25,
  height = 24,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.5 8V7H6.5V8H5.5Z" stroke="white" />
      <path d="M7.5 10V9H8.5V10H7.5Z" stroke="white" />
      <path d="M9.5 12V11H10.5V12H9.5Z" stroke="white" />
      <path d="M11.5 14V13H12.5V14H11.5Z" stroke="white" />
      <path d="M13.5 12V11H14.5V12H13.5Z" stroke="white" />
      <path d="M15.5 10V9H16.5V10H15.5Z" stroke="white" />
      <path d="M17.5 8V7H18.5V8H17.5Z" stroke="white" />
      <path
        d="M2.5 18L2.50018 4.00002H3.47453L3.47435 18H2.5Z"
        stroke="white"
      />
      <path
        d="M3.9617 4.93335V4.00002L20.0385 4V4.93334L3.9617 4.93335Z"
        stroke="white"
      />
      <path
        d="M4.4487 18V17.0667L20.0383 17.0666V18L4.4487 18Z"
        stroke="white"
      />
      <path d="M21.5 4H20.5257L20.5255 18H21.4998L21.5 4Z" stroke="white" />
    </svg>
  );
}
