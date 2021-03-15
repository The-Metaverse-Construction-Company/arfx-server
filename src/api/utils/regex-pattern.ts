import { AZURE_AD_ACCOUNT_NAME } from "../../config/vars"

export const HumanNamePattern = /^[a-z\s\.]{3,}$/i
export const EmailAddressPattern = /^[a-zA-Z0-9\_\-\.]+\@([a-zA-Z0-9])+(\.[a-zA-Z0-9]{2,})+$/
export const EmailDomainPattern = new RegExp(`\@${AZURE_AD_ACCOUNT_NAME}\.onmicrosoft\.com$`, 'i')