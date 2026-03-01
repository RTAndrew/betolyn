// React Native does not support the full `Intl.NumberFormat` API out of the box
// (including `notation: 'compact'`) on Android and sometimes iOS.
// We'll fallback to a manual implementation for "k", "M", "B", etc.

export const formatKNumber = (number: number, asCurrency: boolean = false): string => {
  if (number == null || isNaN(number)) return asCurrency ? '$0' : '0';

  const abs = Math.abs(number);
  if (abs < 1_000) {
    const n = number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return asCurrency ? `$${n}` : n;
  }

  const lookup = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  for (const item of lookup) {
    if (abs >= item.value) {
      let result = (number / item.value).toFixed(1).replace(/\.0$/, '');
      return asCurrency ? `$${result}${item.symbol}` : `${result}${item.symbol}`;
    }
  }

  const fallback = number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return asCurrency ? `$${fallback}` : fallback;
};
