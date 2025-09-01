export function useRandomDefaults() {
  function randomStock() {
    return Math.floor(Math.random() * 10) + 1
  }

  function randomPrice() {
    const allowedPrices = [249, 299, 349, 399, 449, 499]
    return allowedPrices[Math.floor(Math.random() * allowedPrices.length)]
  }

  return { randomStock, randomPrice }
}
