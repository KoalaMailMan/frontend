import { ERROR_IMG_SRC } from "@/feature/home/const/url";
import React, { useState } from "react";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle`}
      style={style}
    >
      <div className="flex items-center justify-center text-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          srcSet={ERROR_IMG_SRC}
          alt="Error loading image"
          {...rest}
          data-original-url={src}
          width={props.width}
          height={props.height}
          className="flex items-center justify-center"
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      srcSet={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
      width={props.width}
      height={props.height}
    />
  );
}
