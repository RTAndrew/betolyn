import React from 'react'
import Svg, { Path } from 'react-native-svg'
import type { SvgProps } from 'react-native-svg'

const SoccerBall = ({ width = 24, height = 24, color = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M21.9642 5.14285H19.9553C19.8187 5.14285 19.6901 5.20982 19.6098 5.31964L12 15.8089L4.39013 5.31964C4.30978 5.20982 4.18121 5.14285 4.0446 5.14285H2.03567C1.86156 5.14285 1.75978 5.34107 1.86156 5.48303L11.3062 18.5036C11.6491 18.975 12.3508 18.975 12.691 18.5036L22.1357 5.48303C22.2401 5.34107 22.1383 5.14285 21.9642 5.14285V5.14285Z"
        fill={color}
      />
    </Svg>
  );
}

export default SoccerBall