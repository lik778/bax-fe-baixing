
import { createAction } from 'vue-duo'
import * as aapi from 'api/account'

export const getUsers = createAction((opts) => {
  return aapi.getUsers(opts)
})
