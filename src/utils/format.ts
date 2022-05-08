import BigNumber from "bignumber.js"

export const formatValue = (value: string, decimal?: number, symbol?: string) => {
  if (decimal === undefined || symbol === undefined) {
    return value
  }

  return `${new BigNumber(value).dividedBy(new BigNumber(10 ** decimal)).toFormat()} ${symbol}`
}
