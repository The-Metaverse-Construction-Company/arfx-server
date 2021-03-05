
export const validateProductTotalPrice = (price: number, discountPercentage: number) => {
  // calculate the total price and validate it if its not below $0.50 usd.
  // payment gateway provider have a limit of $0.50 as it's minimum amount and with a maximum amount of $999,999.99 for the transaction.
  // reference link: https://support.chargebee.com/support/solutions/articles/228511-transaction-amount-limit-in-stripe#:~:text=The%20minimum%20amount%20for%20processing,Click%20Here%20for%20other%20currencies.
  const totalPrice = (price - (price * (discountPercentage / 100)))
  return totalPrice >= 0.50 && totalPrice <= 999999;
}