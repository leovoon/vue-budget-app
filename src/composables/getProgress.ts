export const getProgressVariant = (amount: number, max: number) => {
  const ratio = amount / max
  if (ratio < 0.5) return 'primary'
  if (ratio < 0.75) return 'warning'
  return 'red'
}

export const getProgressValue = (amount: number, max: number) => {
  const ratio = amount / max
  return ratio
}
