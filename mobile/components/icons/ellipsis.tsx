import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'
import type { SvgProps } from 'react-native-svg'

const Ellipsis = ({ width = 12, height = 12, color = '#485164', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none" {...props}>
      <Circle cx="6" cy="6" r="5" stroke={color as string} strokeWidth={2} />
      <Path
        d="M8.5 6C8.5 7.38071 7.38071 8.5 6 8.5C4.61929 8.5 3.5 7.38071 3.5 6C3.5 4.61929 4.61929 3.5 6 3.5C7.38071 3.5 8.5 4.61929 8.5 6Z"
        fill={color as string}
      />
    </Svg>
  );
}

export default Ellipsis