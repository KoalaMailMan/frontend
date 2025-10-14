type IconProps = {
  className?: string;
  size?: number;
};
export default function AddressBook({ className, size = 14 }: IconProps) {
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
        d="M0 14H10.5V11.6667H11.6667V10.5H10.5V7.00002H11.6667V5.83335H9.33333V12.8334H1.16667V2.33335H11.6667V1.16669H0V14ZM2.33333 11.6667H8.16667V9.33335H7V10.5H3.5V9.33335H2.33333V11.6667ZM3.5 9.33335H7V8.16669H3.5V9.33335ZM3.5 7.00002H7V4.66669H5.83333V5.83335H4.66667V4.66669H3.5V7.00002ZM4.66667 4.66669H5.83333V3.50002H4.66667V4.66669ZM11.6667 10.5H12.8333V7.00002H11.6667V10.5ZM11.6667 5.83335H12.8333V2.33335H11.6667V5.83335Z"
        fill="#373737"
      />
    </svg>
  );
}
