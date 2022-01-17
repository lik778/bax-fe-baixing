import { getCurrentBalanceBreif, isCareFreeUser } from './account'
import { SPUCODES } from 'constant/product'
import { adPlatform, trim } from './base'

const { CARE_FREE_SPU_CODE } = SPUCODES

export async function getHomePageAdplatformData (params) {
  const { userId } = params
  const [adPlatformBalanceBrief] = await Promise.all([
    getCurrentBalanceBreif(CARE_FREE_SPU_CODE, userId)
  ])
  return adPlatformBalanceBrief
}

export async function isAdplatformUser (params) {
  const { userId } = params
  const [value] = await Promise.all([isCareFreeUser(userId)])
  return value
}

export async function foundsInfo (params) {
  const body = await adPlatform
    .get('/report/funds/info')
    .query(trim(params))
    .json()
  return body
}

/**
 * @param {object} params
 * @param {string} params.startDate
 * @param {string} params.endDate
 * @returns
 */
export async function statistic (params) {
  const body = await adPlatform
    .post('/report/cost/statistic')
    .send(trim(params))
    .json()
  return body
}

/**
 * @param {object} params
 * @param {string} params.startDate
 * @param {string} params.endDate
 * @returns
 */
export async function costList (params) {
  const body = await adPlatform
    .post('/report/cost/list')
    .send(trim(params))
    .json()
  return body
}

/**
 * @param {object} params
 * @param {string} params.startDate
 * @param {string} params.endDate
 * @returns
 */
export async function ciueCenterList (params) {
  const body = await adPlatform
    .post('/report/lead/list')
    .send(trim(params))
    .json()
  return body
}

/**
 * @param {object} params.id
 * @param {string} params.remark
 * @returns
 */
export async function remarkEdit (params) {
  const body = await adPlatform
    .post('/report/lead/edit')
    .send(params)
    .json()
  return body
}
