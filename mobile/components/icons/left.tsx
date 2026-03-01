import type { SvgProps } from 'react-native-svg';

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Left = ({ width = 24, height = 24, color = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M17.6778 4.13291V2.06238C17.6778 1.88291 17.4715 1.7838 17.3322 1.89363L5.25724 11.3249C5.15464 11.4047 5.07163 11.5068 5.01452 11.6236C4.95742 11.7403 4.92773 11.8686 4.92773 11.9985C4.92773 12.1285 4.95742 12.2568 5.01452 12.3735C5.07163 12.4902 5.15464 12.5924 5.25724 12.6722L17.3322 22.1034C17.4742 22.2133 17.6778 22.1142 17.6778 21.9347V19.8642C17.6778 19.7329 17.6162 19.607 17.5144 19.5267L7.87152 11.9999L17.5144 4.47041C17.6162 4.39005 17.6778 4.26416 17.6778 4.13291Z"
        fill={color}
      />
    </Svg>
  );
};

export default Left;
