import React from 'react'
import Svg, { Path } from 'react-native-svg'
import type { SvgProps } from 'react-native-svg'

const CaretUp = ({ width = 24, height = 24, color = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M6.10204 16.9805C5.0281 16.9805 4.45412 15.7156 5.16132 14.9073L10.6831 8.59664C11.3804 7.79982 12.6199 7.79981 13.3172 8.59664L18.839 14.9073C19.5462 15.7156 18.9722 16.9805 17.8983 16.9805H6.10204Z"
        fill={color}
      />
    </Svg>
  );
}

export default CaretUp;