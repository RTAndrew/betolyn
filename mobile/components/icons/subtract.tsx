import React from 'react'
import Svg, { Path } from 'react-native-svg'
import type { SvgProps } from 'react-native-svg'

const Subtract = ({ width = 24, height = 24, color = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 896 896" fill="none" {...props}>
      <Path
        d="M140.146 466.667H755.844C771.307 466.667 783.844 454.13 783.844 438.667C783.844 423.203 771.307 410.667 755.844 410.667H140.146C124.682 410.667 112.146 423.203 112.146 438.667C112.146 454.13 124.682 466.667 140.146 466.667Z"
        fill={color}
      />
    </Svg>
  );
}

export default Subtract