import { createAction } from 'vue-duo'
import * as dapi from 'api/dashboard'

export const getUploads = createAction(() => {
  return dapi.getUploads()
})

export const saveUpload = createAction((upload) => {
  return dapi.saveUpload(upload)
})

export const deleteUpload = createAction((id) => {
  return dapi.deleteUpload(id)
})
