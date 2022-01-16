export const currencyFormatter = new Intl.NumberFormat(undefined, {
  currency: 'myr',
  currencyDisplay: 'narrowSymbol',
  style: 'currency',
  minimumFractionDigits: 0,
})
