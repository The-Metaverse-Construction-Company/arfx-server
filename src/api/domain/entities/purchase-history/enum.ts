import {extractValue} from 'ts-enum-extractor'
export enum PURCHASE_HISTORY_STATE {
  COMPLETED = 1,
  PENDING = 2,
  CANCELLED = 3,
  FAILED = 4
}
export const ALLOWED_PURCHASE_HISTORY_STATES = extractValue(PURCHASE_HISTORY_STATE)