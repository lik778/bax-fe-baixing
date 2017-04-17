
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'

export const getOrderInfo = createAction((id) => {
  return oapi.getOrderInfo(id)
})
