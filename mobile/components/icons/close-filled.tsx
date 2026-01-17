import React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
import type { SvgProps } from 'react-native-svg'

const CloseFilled = ({ width = 24, height = 24, color = 'white', fill = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <G clipPath="url(#clip0_2036_5772)">
        <Rect width={width} height={height} rx={12} fill={fill} />
        <Path
          id="close-filled-path"
          d="M16.6446 7.7893C16.6446 7.67144 16.5482 7.57501 16.4303 7.57501L14.6625 7.58305L12 10.7572L9.34017 7.58573L7.56963 7.57769C7.45178 7.57769 7.35535 7.67144 7.35535 7.79198C7.35535 7.84287 7.3741 7.89108 7.40624 7.93126L10.8911 12.083L7.40624 16.2322C7.37387 16.2714 7.35591 16.3206 7.35535 16.3714C7.35535 16.4893 7.45178 16.5857 7.56963 16.5857L9.34017 16.5777L12 13.4036L14.6598 16.575L16.4277 16.583C16.5455 16.583 16.642 16.4893 16.642 16.3688C16.642 16.3179 16.6232 16.2697 16.5911 16.2295L13.1116 12.0804L16.5964 7.92858C16.6286 7.89108 16.6446 7.84019 16.6446 7.7893Z"
          fill={color}
        />
      </G>

    </Svg>
  );
}

export default CloseFilled;