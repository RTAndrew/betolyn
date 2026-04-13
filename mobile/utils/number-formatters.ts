export function formatOddValue(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatKwanzaAmount(amount = 0, includeCurrency = true): string {
  if (amount === 0) return '0.00';

  const formattedAmount = `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return includeCurrency ? `${formattedAmount} Kz` : formattedAmount;
}
