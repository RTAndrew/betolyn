import type { SvgProps } from 'react-native-svg';

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlayFilled = ({ width = 24, height = 24, color = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M5 5.27368C5 3.56682 6.82609 2.48151 8.32538 3.2973L20.687 10.0235C22.2531 10.8756 22.2531 13.124 20.687 13.9762L8.32538 20.7024C6.82609 21.5181 5 20.4328 5 18.726V5.27368Z"
        fill={color}
      />
    </Svg>
  );
};

export default PlayFilled;
