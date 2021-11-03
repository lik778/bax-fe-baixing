import { getCurrentBalanceBreif } from './account'
import { SPUCODES } from 'constant/product'

const { CARE_FREE_SPU_CODE } = SPUCODES

export async function getHomePageAdplatformData (params) {
  const { userId } = params
  const [adPlatformBalanceBrief] = await Promise.all([
    getCurrentBalanceBreif(CARE_FREE_SPU_CODE, userId)
  ])
  return adPlatformBalanceBrief
}
