
import { observable, action, toJS } from 'mobx'

import * as mapi from 'api/material'

const store = observable({
  _material: {},

  get material() {
    return toJS(this._material)
  },

  getMaterial: action(async function(id) {
    this._material = await mapi.getMaterial(id)
  })
})

export default store
