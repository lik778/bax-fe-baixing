import { api } from './base'
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'

export async function getProductsByMchCodes(mchCodes) {
  const body = await api
    .get('/merchant/products/merchantcodes')
    .query(reverseCamelcase({
      mchCodes
    }))
    .json()

  return toCamelcase(body.data)
}
