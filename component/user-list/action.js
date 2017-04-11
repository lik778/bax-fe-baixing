
import * as aapi from 'api/account'
import { createAction } from 'vue-duo'

export const getUsers = createAction((opts) => {
  return aapi.getUsers(opts)
})
