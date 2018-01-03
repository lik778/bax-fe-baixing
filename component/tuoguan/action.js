
import { createAction } from 'vue-duo'

import * as fapi from 'api/fengming'

export const getTuoguanStatus = createAction(() => {
  return fapi.getTuoguanStatus()
})

export const createTuoguan = createAction(opt => {
  return fapi.createTuoguan(opt)
})

export const stopTuoguan = createAction(opt => {
  return fapi.stopTuoguan(opt)
})

export const extendTuoguan = createAction(opt => {
  return fapi.extendTuoguan(opt)
})
