import { createStore } from 'vue-duo'
import { getUploads, saveUpload, deleteUpload } from './action'
import moment from 'moment'

const store = createStore({
    uploads: []
})

store.subscribeActions({
  [getUploads]: uploads => ({ uploads }),

  [deleteUpload]: ({id, affectedRows}) => {
    return {
      uploads: store.state.uploads.filter(u => u.id !== +id)
    }
  },
  [saveUpload]: result => ({ uploads: [result, ...store.state.uploads] })
})

export default store
