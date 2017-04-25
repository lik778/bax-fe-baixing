
import { createAction } from 'vue-duo'
import * as oapi from 'api/order'

export const queryCalendar = createAction((opts) => {
  return oapi.getCalendar(opts)
})
