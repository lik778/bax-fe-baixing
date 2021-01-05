
const hotClient = require('webpack-hot-middleware/client?reload=true')

hotClient.subscribe(({action}) => {
  if (action === 'reload') {
    window.location.reload()
  }
})
