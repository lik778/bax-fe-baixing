
import { createAction } from 'vue-duo'

import {
  getReleasePageList,
  getDraftPageList
} from 'api/cashcow'

export const getPageList = createAction(async (uid) => {
  const query = {uid}
  const draftPageList = await getDraftPageList(query)
  const releasePageList = await getReleasePageList(query)

  const list = draftPageList.map(d => ({
    title: d.config.campaignName,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    pageId: d.id,
    type: 'draft',
    id: d.id
  }))

  releasePageList.forEach(page => {
    const item = list.find(item => item.id === page.pageId)

    if (item) {
      item.id = page.id
      item.type = 'release'
      item.pageId = page.pageId
      item.releaseAt = page.updatedAt
      return
    }

    list.push({
      title: page.config.campaignName,
      releaseAt: page.updatedAt,
      type: 'release',
      id: page.id
    })
  })

  return list
})
