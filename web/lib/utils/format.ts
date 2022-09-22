const nokFormatter = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  minimumFractionDigits: 0,
});

export const formatNok = (amount: number) => nokFormatter.format(amount);
