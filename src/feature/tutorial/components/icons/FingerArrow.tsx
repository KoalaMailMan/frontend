type IconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function FingerArrow({
  className,
  width = 46,
  height = 39,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 46 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_53_4646)">
        <path
          d="M22.9186 28.0607V30.3561L36.6288 30.3561V28.0607L22.9186 28.0607ZM36.6288 25.7804V28.0607H38.9238V25.7804H36.6288ZM20.6386 25.7804V28.0607H22.9186V25.7804H20.6386ZM38.9238 23.5V25.7804H41.2038V23.5H38.9238ZM18.3586 23.5V25.7804H20.6386V23.5H18.3586ZM18.3586 23.5H16.0636V15.9925L5.63281 16L5.63356 13.7121H18.3586V23.5ZM21.7031 20V22.2804L29.7738 22.2804V20L21.7031 20ZM21.7031 13.7121V15.9925L29.7738 15.9925V13.7121L21.7031 13.7121ZM4 9.13643V13.7121H5.63356V9.13643H4ZM36.6288 6.85607V9.13643H41.2038V6.85607H36.6288ZM25.2136 6.85607V9.13643H5.63356L5.63281 6.85607H18.3586V2.28036H20.6386V6.85607H25.2136ZM34.3488 4.56071V6.85607H36.6288V4.56071H34.3488ZM32.0688 2.28036V4.56071H34.3488V2.28036H32.0688ZM20.6386 0V2.28036L32.0688 2.28036V0H20.6386Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_53_4646"
          x="0"
          y="0"
          width="45.2036"
          height="38.3561"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0144231 0 0 0 0 0.0144231 0 0 0 0 0.0144231 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_53_4646"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_53_4646"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
