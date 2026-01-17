import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

const Add = ({ width = 24, height = 24, color = 'white', ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 896 896" fill="none" {...props}>
      <Path
        d="M438.659 112C452.835 112 464.553 122.528 466.409 136.195L466.667 139.994L466.711 410.667H737.494C752.957 410.667 765.494 423.203 765.494 438.667C765.494 452.842 754.958 464.557 741.294 466.413L737.494 466.667H466.711L466.786 737.3C466.79 752.763 454.257 765.307 438.793 765.307C424.618 765.307 412.899 754.779 411.044 741.111L410.786 737.311L410.711 466.667H140.082C124.618 466.667 112.082 454.13 112.082 438.667C112.082 424.491 122.616 412.776 136.283 410.921L140.082 410.667H410.711L410.667 140.006C410.663 124.542 423.196 112 438.659 112Z"
        fill={color as string}
      />
    </Svg>
  );
};

export default Add;
