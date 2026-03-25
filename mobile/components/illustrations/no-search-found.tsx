import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const NoSearchFound = ({ width = 76, height = 70, color = 'white', ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 76 70" fill="none" {...props}>
    <Circle
      cx="35.3071"
      cy="27.2427"
      r="24.1919"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <Path
      d="M46.4222 23.3203L38.5762 27.2433L46.4222 31.1663"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M24.193 23.3203L32.0391 27.2433L24.193 31.1663"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Circle
      cx="35.3078"
      cy="27.2424"
      r="17.6535"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <Path
      d="M48.0059 47.8105L53.9482 53.7529M53.4178 42.3986L59.3602 48.3409"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <Path
      d="M52.5902 56.2279C50.6376 54.2753 50.6376 51.1095 52.5902 49.1568L54.7658 46.9813C56.7184 45.0287 59.8842 45.0287 61.8368 46.9813L71.9265 57.0709C73.8791 59.0235 73.8791 62.1894 71.9265 64.142L69.7509 66.3175C67.7983 68.2702 64.6325 68.2702 62.6798 66.3175L52.5902 56.2279Z"
      fill={color}
    />
    <Path
      d="M60.4326 1.95502C60.9671 1.22748 61.9902 1.07097 62.7177 1.60544C63.4453 2.13991 63.6018 3.16298 63.0673 3.89051L59.8585 8.25838C59.324 8.98592 58.301 9.14243 57.5734 8.60796C56.8459 8.07348 56.6894 7.05042 57.2239 6.32288L60.4326 1.95502Z"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <Path
      d="M67.726 10.2918C68.586 10.0174 69.5057 10.4921 69.7801 11.3521C70.0545 12.2122 69.5798 13.1319 68.7198 13.4063L63.5565 15.0539C62.6964 15.3283 61.7768 14.8536 61.5023 13.9936C61.2279 13.1335 61.7026 12.2139 62.5627 11.9394L67.726 10.2918Z"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <Path
      d="M3.57322 43.0847C2.70651 43.3373 2.20865 44.2446 2.46121 45.1113C2.71377 45.978 3.62111 46.4759 4.48782 46.2233L9.69122 44.707C10.5579 44.4545 11.0558 43.5471 10.8032 42.6804C10.5507 41.8137 9.64333 41.3159 8.77662 41.5684L3.57322 43.0847Z"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <Path
      d="M8.90511 52.7945C8.35237 53.5083 8.48292 54.535 9.19668 55.0877C9.91045 55.6405 10.9371 55.5099 11.4899 54.7961L14.8083 50.511C15.361 49.7972 15.2305 48.7705 14.5167 48.2178C13.8029 47.665 12.7762 47.7956 12.2235 48.5094L8.90511 52.7945Z"
      stroke={color}
      stroke-width="2"
      stroke-linejoin="round"
    />
  </Svg>
);
