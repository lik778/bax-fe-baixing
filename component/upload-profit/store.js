import { createStore } from 'vue-duo'
import { getUploads, saveUpload, deleteUpload } from './action'

const store = createStore({
  uploads: []
})

store.subscribeActions({
  [getUploads]: uploads => {
    uploads.forEach(u => {
      u.income = Number(u.income)
      u.profit = Number(u.profit)
    })
    return { uploads }
  },

  [deleteUpload]: ({id, affectedRows}) => {
    return {
      uploads: store.state.uploads.filter(u => u.id !== +id)
    }
  },
  [saveUpload]: result => ({ uploads: [result, ...store.state.uploads] })
})

export default store
